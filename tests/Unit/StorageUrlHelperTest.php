<?php

namespace Tests\Unit;

use App\Support\StorageUrlHelper;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class StorageUrlHelperTest extends TestCase
{
    public function test_returns_null_for_empty_path(): void
    {
        $this->assertNull(StorageUrlHelper::url(null));
        $this->assertNull(StorageUrlHelper::url(''));
    }

    public function test_returns_as_is_for_full_url(): void
    {
        $url = 'https://pub-xxx.r2.dev/uploads/image.jpg';
        $this->assertEquals($url, StorageUrlHelper::url($url));
    }

    public function test_generates_s3_storage_url(): void
    {
        Config::set('filesystems.default', 's3');
        Storage::fake('s3');

        $url = StorageUrlHelper::url('uploads/image.jpg');
        $this->assertNotNull($url);
        $this->assertStringContainsString('uploads/image.jpg', $url);
    }
}
