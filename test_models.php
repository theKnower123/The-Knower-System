<?php
$files = glob("app/Modules/*/Models/*.php");
foreach($files as $file) {
    $module = basename(dirname(dirname($file)));
    $name = basename($file, ".php");
    $class = "App\\Modules\\$module\\Models\\$name";
    echo "Testing $class\n";
    try {
        $obj = new $class;
        $ref = new ReflectionClass($class);
        foreach($ref->getMethods() as $method) {
            if ($method->class === $class && empty($method->getParameters()) && !in_array($method->getName(), ["getActivitylogOptions", "getProgressPercentAttribute", "boot", "booted"])) {
                try {
                    $res = $method->invoke($obj);
                } catch(Throwable $e) {
                    echo "  -> Method " . $method->getName() . " failed: " . $e->getMessage() . "\n";
                }
            }
        }
    } catch(Throwable $e) {
        echo "  -> Failed: " . $e->getMessage() . "\n";
    }
}
