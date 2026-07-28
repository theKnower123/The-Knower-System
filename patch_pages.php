<?php

$dir = 'resources/js/Pages';
$files = scandir($dir);

foreach ($files as $file) {
    if (pathinfo($file, PATHINFO_EXTENSION) !== 'tsx') continue;
    $path = "$dir/$file";
    $content = file_get_contents($path);

    if (preg_match('/useCollection\(\s*[\'"]([^\'"]+)[\'"]/', $content, $matches)) {
        $collectionKey = $matches[1];
        
        if (strpos($content, 'collectionKey=') === false) {
            $content = preg_replace('/<ResourcePage(?:<[^>]+>)?/', "$0\n      collectionKey=\"$collectionKey\"", $content, 1);
            file_put_contents($path, $content);
            echo "Patched $file with key $collectionKey\n";
        }
    }
}
