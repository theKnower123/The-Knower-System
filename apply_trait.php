<?php
$models = [
    'app/Modules/Projects/Models/Project.php',
    'app/Modules/Finance/Models/Invoice.php',
    'app/Modules/Finance/Models/Payment.php',
    'app/Modules/CRM/Models/Contract.php',
    'app/Modules/Support/Models/Ticket.php',
    'app/Modules/CRM/Models/Quotation.php',
    'app/Modules/CRM/Models/Client.php',
    'app/Modules/Hosting/Models/Domain.php',
    'app/Modules/Hosting/Models/HostingAccount.php',
    'app/Modules/Hosting/Models/Server.php',
    'app/Modules/Hosting/Models/SslCertificate.php',
];

foreach ($models as $model) {
    if (file_exists($model)) {
        $content = file_get_contents($model);
        
        // Add use App\Traits\IsolatesClientData; if missing
        if (strpos($content, 'use App\Traits\IsolatesClientData;') === false) {
            $content = preg_replace('/(class [a-zA-Z0-9_]+ extends [a-zA-Z0-9_]+(\s+implements [a-zA-Z0-9_,\s]+)?\s*\{)/', "$1\n    use \\App\\Traits\\IsolatesClientData;", $content);
            file_put_contents($model, $content);
            echo "Added trait to $model\n";
        }
    } else {
        echo "Missing: $model\n";
    }
}
