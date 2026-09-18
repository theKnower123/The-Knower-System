<?php

namespace App\Support;

class StorageUrlHelper
{
    /**
     * Resolve proxied URL for a file without revealing Cloudflare R2 / S3 URLs.
     *
     * @param string|null $path
     * @param string|null $disk
     * @param string|int|null $id
     * @param string|null $type
     * @return string|null
     */
    public static function url(?string $path = null, ?string $disk = null, string|int|null $id = null, ?string $type = null): ?string
    {
        if ($id !== null) {
            if ($type && $type !== 'file') {
                return route('file.show.type', ['type' => $type, 'id' => $id]);
            }
            return route('file.show', ['id' => $id]);
        }

        if (empty($path)) {
            return null;
        }

        // If path is already a proxy route link, return as-is
        if (str_contains($path, '/file/')) {
            return $path;
        }

        return $path;
    }
}
