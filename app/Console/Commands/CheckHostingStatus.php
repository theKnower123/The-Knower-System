<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Modules\Hosting\Models\Domain;
use App\Modules\Hosting\Models\HostingAccount;
use App\Modules\Auth\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

#[Signature('hosting:check')]
#[Description('Checks hosting and domains for expiry and downtime')]
class CheckHostingStatus extends Command
{
    public function handle()
    {
        $this->info('Checking domains and hosting for expiry and status...');
        
        $warningThreshold = now()->addDays(30);

        // Get Super Admins or users who should receive alerts
        $admins = User::role('Super Admin')->get();

        // Check Domains Expiry
        $domains = Domain::where('expiry_date', '<=', $warningThreshold)->where('status', '!=', 'expired')->get();
        foreach ($domains as $domain) {
            $this->info("Domain {$domain->domain} is expiring soon ({$domain->expiry_date})");
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\HostingExpiring('Domain', $domain->domain, clone $domain->expiry_date));
            }
        }

        // Check Hosting Accounts Expiry
        $accounts = HostingAccount::where('expiry_date', '<=', $warningThreshold)->where('status', '!=', 'expired')->get();
        foreach ($accounts as $account) {
            $this->info("Hosting Account {$account->domain} is expiring soon ({$account->expiry_date})");
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\HostingExpiring('Hosting Account', $account->domain, clone $account->expiry_date));
            }
        }

        // Optional: Simple HTTP Downtime Check
        $activeDomains = Domain::where('status', 'active')->get();
        foreach ($activeDomains as $domain) {
            try {
                $response = Http::timeout(5)->get("http://{$domain->domain}");
                if ($response->failed()) {
                    $this->warn("Downtime detected for {$domain->domain}");
                    // Trigger downtime notification
                }
            } catch (\Exception $e) {
                $this->warn("Could not reach {$domain->domain}: " . $e->getMessage());
            }
        }

        $this->info('Hosting check completed.');
    }
}
