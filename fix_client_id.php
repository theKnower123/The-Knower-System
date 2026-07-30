<?php
$files = array_merge(
    glob('app/Policies/*Policy.php'),
    ['app/Http/Middleware/HandleInertiaRequests.php', 'app/Modules/Auth/Controllers/AuthController.php']
);

foreach ($files as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        if (strpos($content, '$user->client_id') !== false) {
            $content = str_replace('$user->client_id', '$user->client()->value(\'id\')', $content);
            file_put_contents($file, $content);
            echo "Fixed $file\n";
        }
    }
}
