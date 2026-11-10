<?php

namespace App\Support;

use Illuminate\Database\LostConnectionException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PDOException;
use Throwable;

/**
 * Deteksi dan pencatatan kegagalan koneksi basis data.
 *
 * Kelas ini sengaja tidak menyentuh model, session, atau cache aplikasi
 * sehingga tetap aman dipakai ketika MySQL sedang mati total.
 */
final class DatabaseFailure
{
    /**
     * Kode error driver MySQL yang menandakan masalah koneksi/server,
     * bukan kesalahan SQL biasa seperti kolom atau tabel tidak ada.
     *
     * @var array<int, int>
     */
    private const DRIVER_CODES = [
        1040, // Too many connections
        1044, // Access denied for user to database
        1045, // Access denied for user
        1049, // Unknown database
        1129, // Host is blocked
        1130, // Host is not allowed to connect
        1203, // User has exceeded max_user_connections
        1226, // User resource limit exceeded
        2002, // Connection refused / cannot connect
        2003, // Can't connect to MySQL server
        2006, // MySQL server has gone away
        2013, // Lost connection during query
    ];

    public static function isConnectionFailure(Throwable $e): bool
    {
        if ($e instanceof LostConnectionException) {
            return true;
        }

        if ($e instanceof QueryException) {
            return self::isConnectionMessage($e->getMessage())
                || self::isConnectionSqlState($e->getCode())
                || self::isConnectionSqlState($e->errorInfo[0] ?? null)
                || self::isConnectionDriverCode($e->errorInfo[1] ?? null);
        }

        if ($e instanceof PDOException) {
            return self::isConnectionMessage($e->getMessage())
                || self::isConnectionSqlState($e->getCode())
                || self::isConnectionSqlState($e->errorInfo[0] ?? null)
                || self::isConnectionDriverCode($e->errorInfo[1] ?? null);
        }

        // Beberapa wrapper driver melempar exception biasa, bukan
        // PDOException. Periksa pesan sebagai upaya terakhir.
        return self::isConnectionMessage($e->getMessage());
    }

    /**
     * Catat kegagalan ke channel log khusus tanpa pernah membiarkan
     * kegagalan logging mengubah respons error yang sedang dibuat.
     */
    public static function report(Throwable $e, Request $request, string $message): void
    {
        try {
            Log::channel('error-file')->error($message, [
                'url' => $request->getRequestUri(),
                'method' => $request->method(),
                'kelas' => $e::class,
                'pesan' => $e->getMessage(),
            ]);
        } catch (Throwable) {
            // Abaikan: halaman error harus tetap dapat dikirim ke pengguna.
        }
    }

    private static function isConnectionMessage(string $message): bool
    {
        $message = strtolower($message);

        return (bool) preg_match(
            '/sqlstate\[(?:hy000|08001|08004|08006|08s01)\]\s*\[(?:1040|1044|1045|1049|1129|1130|1203|1226|2002|2003|2006|2013)\]'
            .'|connection refused|could not connect|can\'t connect|lost connection'
            .'|server has gone away|no such host|getaddrinfo|connection timed out'
            .'|too many connections|host .* (?:is not allowed|is blocked)/i',
            $message
        );
    }

    private static function isConnectionSqlState(mixed $state): bool
    {
        return is_string($state) && str_starts_with(strtoupper($state), '08');
    }

    private static function isConnectionDriverCode(mixed $code): bool
    {
        return in_array((int) $code, self::DRIVER_CODES, true);
    }
}
