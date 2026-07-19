<?php
$fixes = [
    "app/Modules/Auth/Models/User.php" => [
        "use App\Modules\HR\Models\Employee;",
        "use App\Modules\Projects\Models\Task;",
        "use App\Modules\Support\Models\Ticket;",
        "use App\Modules\Projects\Models\Project;",
        "use App\Modules\Projects\Models\TaskComment;"
    ],
    "app/Modules/CRM/Models/Client.php" => [
        "use App\Modules\Projects\Models\Project;",
        "use App\Modules\Finance\Models\Invoice;",
        "use App\Modules\Support\Models\Ticket;",
        "use App\Modules\Hosting\Models\Domain;",
        "use App\Modules\Hosting\Models\HostingAccount;"
    ],
    "app/Modules/CRM/Models/Lead.php" => ["use App\Modules\Auth\Models\User;"],
    "app/Modules/CRM/Models/Quotation.php" => ["use App\Modules\Auth\Models\User;"],
    "app/Modules/Finance/Models/Expense.php" => ["use App\Modules\Auth\Models\User;"],
    "app/Modules/Finance/Models/Invoice.php" => [
        "use App\Modules\CRM\Models\Client;",
        "use App\Modules\Projects\Models\Project;"
    ],
    "app/Modules/HR/Models/Employee.php" => ["use App\Modules\Auth\Models\User;"],
    "app/Modules/Hosting/Models/Domain.php" => [
        "use App\Modules\CRM\Models\Client;",
        "use App\Modules\Projects\Models\Project;"
    ],
    "app/Modules/Hosting/Models/HostingAccount.php" => [
        "use App\Modules\CRM\Models\Client;",
        "use App\Modules\Projects\Models\Project;"
    ],
    "app/Modules/Projects/Models/Bug.php" => ["use App\Modules\Auth\Models\User;"],
    "app/Modules/Projects/Models/File.php" => ["use App\Modules\Auth\Models\User;"],
    "app/Modules/Projects/Models/Task.php" => ["use App\Modules\Auth\Models\User;"],
    "app/Modules/Projects/Models/TaskComment.php" => ["use App\Modules\Auth\Models\User;"],
    "app/Modules/Settings/Models/Workspace.php" => ["use App\Modules\Auth\Models\User;"],
    "app/Modules/Support/Models/Ticket.php" => [
        "use App\Modules\CRM\Models\Client;",
        "use App\Modules\Projects\Models\Project;",
        "use App\Modules\Auth\Models\User;"
    ],
    "app/Modules/Support/Models/TicketMessage.php" => ["use App\Modules\Auth\Models\User;"]
];

foreach ($fixes as $file => $imports) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        $lines = explode("\n", $content);
        $out = [];
        $inserted = false;
        foreach ($lines as $line) {
            $out[] = $line;
            if (!$inserted && str_starts_with($line, "namespace ")) {
                $out[] = "";
                foreach ($imports as $import) {
                    // check if already imported
                    if (!str_contains($content, $import)) {
                        $out[] = $import;
                    }
                }
                $inserted = true;
            }
        }
        file_put_contents($file, implode("\n", $out));
        echo "Fixed $file\n";
    }
}

