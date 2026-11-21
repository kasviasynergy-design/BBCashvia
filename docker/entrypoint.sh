#!/bin/sh
set -e

cd /var/www/html || exit 1

# Pastikan struktur folder Laravel wujud walaupun volume storage kosong.
mkdir -p storage/framework/cache/data \
         storage/framework/sessions \
         storage/framework/views \
         storage/framework/testing \
         storage/logs \
         bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwX storage bootstrap/cache

# APP_KEY diambil dari environment Coolify. Jika tiada, jana satu kali sahaja
# dan simpan di dalam volume storage supaya kekal stabil selepas restart.
if [ -z "${APP_KEY:-}" ]; then
    KEY_FILE=/var/www/html/storage/app/.app_key
    if [ ! -s "$KEY_FILE" ]; then
        php -r 'echo "base64:".base64_encode(random_bytes(32));' > "$KEY_FILE"
        chown www-data:www-data "$KEY_FILE"
        chmod 600 "$KEY_FILE"
    fi
    APP_KEY=$(cat "$KEY_FILE")
    export APP_KEY
fi

# composer dipasang dengan --no-scripts, jadi jana semula senarai package.
php artisan package:discover --ansi || true

# PENTING: storage:link diperlukan untuk uploads bukti_transaksi.
php artisan storage:link --force || true

# JANGAN guna `route:cache` / `optimize`: routes/web.php banyak guna closure.
php artisan config:cache || true
php artisan view:cache || true

# Migrasi hanya bila dibenarkan secara eksplisit (DB luar sekolah).
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    php artisan migrate --force --no-interaction
fi

exec "$@"
