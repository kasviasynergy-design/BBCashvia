# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# 1) Base: Apache + PHP 8.2 dengan ekstensi yang diperlukan Laravel 12.
#    Satu container sahaja (Apache) supaya mudah di-deploy di Coolify.
# ---------------------------------------------------------------------------
FROM php:8.2-apache AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
        curl git unzip libzip-dev libonig-dev libxml2-dev libicu-dev libpng-dev \
    && docker-php-ext-install pdo_mysql mbstring xml dom zip gd intl bcmath opcache \
    && docker-php-ext-enable opcache \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# Composer 2 (binary rasmi)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Arahkan DocumentRoot ke folder public/ dan benarkan .htaccess Laravel.
# Apache juga kita supaya mendengar pada port 8000 (sama seperti sebelum ini).
RUN printf '%s\n' \
        '<Directory /var/www/html/public>' \
        '    AllowOverride All' \
        '    Require all granted' \
        '</Directory>' \
        > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel \
    && sed -ri 's#/var/www/html#/var/www/html/public#g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri 's/Listen 80/Listen 8000/g' /etc/apache2/ports.conf \
    && sed -ri 's/:80>/:8000>/g' /etc/apache2/sites-available/000-default.conf \
    && printf '%s\n' 'ServerName localhost' > /etc/apache2/conf-available/servername.conf \
    && a2enconf servername

WORKDIR /var/www/html

# ---------------------------------------------------------------------------
# 2) Dependencies PHP (production sahaja, tanpa dev packages)
# ---------------------------------------------------------------------------
FROM base AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-interaction \
        --prefer-dist \
        --optimize-autoloader \
        --no-scripts

# ---------------------------------------------------------------------------
# 3) Build aset frontend dengan Node 22 (versi dari .nvmrc / package.json)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY vite.config.js ./
COPY resources ./resources
RUN npm run build

# ---------------------------------------------------------------------------
# 4) Image final
# ---------------------------------------------------------------------------
FROM base AS app
COPY --from=vendor /app/vendor /var/www/html/vendor
COPY --from=frontend /app/public/build /var/www/html/public/build
COPY . /var/www/html

COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint \
    && mkdir -p storage/framework/cache/data \
               storage/framework/sessions \
               storage/framework/views \
               storage/framework/testing \
               storage/logs \
               bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwX storage bootstrap/cache

EXPOSE 8000
ENTRYPOINT ["/usr/local/bin/entrypoint"]
CMD ["apache2-foreground"]
