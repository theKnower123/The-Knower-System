<?php
$files = shell_exec('find app/Modules -name "*.php" | grep Models');
$files = array_filter(explode("\n", trim($files)));

foreach ($files as $file) {
    $content = file_get_contents($file);
    if (strpos($content, 'SoftDeletes') !== false) {
        continue;
    }
    
    // Add import
    $content = preg_replace('/class\s+/', "use Illuminate\Database\Eloquent\SoftDeletes;\n\nclass ", $content, 1);
    
    // Add use trait
    $content = preg_replace('/(class\s+[a-zA-Z0-9_]+\s*(?:extends\s+[a-zA-Z0-9_]+)?\s*(?:implements\s+[a-zA-Z0-9_,\s]+)?\s*\{)/', "$1\n    use SoftDeletes;", $content, 1);
    
    file_put_contents($file, $content);
}
echo "Models patched.\n";
