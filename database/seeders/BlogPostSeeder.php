<?php

namespace Database\Seeders;

use App\Modules\CMS\Models\BlogPost;
use Illuminate\Database\Seeder;

/**
 * Run with: php artisan db:seed --class="Database\Seeders\BlogPostSeeder"
 * Safe to re-run: matches by `slug`, updates if it exists, creates if not.
 *
 * `body` is stored as JSON -- an array of paragraph strings, matching what
 * your admin editor and public blog page already expect.
 */
class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->posts() as $post) {
            BlogPost::updateOrCreate(
                ['slug' => $post['slug']],
                $post
            );
            $this->command?->info("Seeded blog post '{$post['title']}'.");
        }
    }

    private function posts(): array
    {
        return [
            [
                'slug' => 'excel-vs-custom-system',
                'title' => '5 Signs Your Business Has Outgrown Spreadsheets',
                'excerpt' => 'Excel got you this far. Here\'s how to tell when it starts costing you more than it saves.',
                'category' => 'Business',
                'author' => 'The Knower Team',
                'published_at' => now()->subDays(21)->toDateString(),
                'read_time' => '5 min',
                'is_published' => true,
                'body' => [
                    'Every growing business starts somewhere, and for most, that somewhere is a spreadsheet. It works, until it doesn\'t. The trouble is that the transition point rarely announces itself with a single dramatic failure -- it shows up as a slow accumulation of small frictions that eventually cost real money.',
                    'The first sign is version confusion: more than one person editing the same file, and nobody is fully sure which copy is current. The second is manual reconciliation -- someone spends part of every week copying numbers between sheets that should just be one source of truth.',
                    'The third sign is that reporting takes hours instead of seconds. If generating a simple "how did we do this month" report means opening five tabs and cross-referencing formulas, that time is a hidden cost compounding every month.',
                    'The fourth is access control, or the lack of it -- everyone with the file can edit everything, including the numbers that should be locked down. The fifth, and most telling, is when new hires need a "spreadsheet training session" just to understand how the business tracks its own operations.',
                    'None of these problems mean Excel was a bad choice early on. It means the business has grown past what a spreadsheet was ever designed to do. A custom system doesn\'t have to mean a massive ERP rebuild -- often it starts small: one workflow, one dashboard, replacing the most painful spreadsheet first.',
                ],
            ],
            [
                'slug' => 'choosing-between-web-mobile-desktop',
                'title' => 'Web, Mobile, or Desktop? How to Choose What to Build First',
                'excerpt' => 'You don\'t need all three platforms on day one. Here\'s how to decide where to start.',
                'category' => 'Strategy',
                'author' => 'The Knower Team',
                'published_at' => now()->subDays(14)->toDateString(),
                'read_time' => '6 min',
                'is_published' => true,
                'body' => [
                    'One of the most common early questions we get is "should we build a website, an app, or both?" The honest answer is almost always: start with one, and let real usage tell you if you need the others.',
                    'A web system is the right starting point for most businesses. It works on every device without an install, it\'s the easiest to update quickly, and it\'s where your team will likely spend most of its working hours -- dashboards, reports, and back-office tools live comfortably in a browser.',
                    'Mobile makes sense when your users are moving -- delivery drivers, field technicians, sales reps checking inventory on the shop floor, or customers who expect a quick app instead of typing a URL every time. If your core workflow happens while someone is standing up and moving around, mobile earns its cost.',
                    'Desktop is the right call in a narrower set of cases: point-of-sale systems that need to keep working without internet, or tools handling large files and hardware peripherals like receipt printers and barcode scanners that a browser can\'t reliably access.',
                    'The good news is that none of these choices are permanent or exclusive. If we build your web system first, adding a mobile or desktop companion later reuses the same backend and database -- it\'s a fraction of the cost of building any of them standalone.',
                ],
            ],
            [
                'slug' => 'hidden-cost-of-cheap-hosting',
                'title' => 'The Hidden Cost of Cheap Hosting',
                'excerpt' => 'Why the cheapest hosting plan is rarely the cheapest option once you count what it actually costs you.',
                'category' => 'Infrastructure',
                'author' => 'The Knower Team',
                'published_at' => now()->subDays(7)->toDateString(),
                'read_time' => '4 min',
                'is_published' => true,
                'body' => [
                    'It\'s tempting to treat hosting as a commodity -- pick whatever\'s cheapest, since "it\'s all just a server somewhere." In practice, hosting quality shows up exactly when you need it most: during a traffic spike, a security incident, or the one time your backup actually needs to be restored.',
                    'Cheap shared hosting plans usually cut corners in three places: backup frequency and testing, security patching cadence, and support response time. None of these are visible on a normal day. All three become very visible during an incident.',
                    'A backup that was never tested is not a backup, it\'s a hope. We\'ve seen businesses discover their "daily backups" hadn\'t actually run successfully in months, only after they needed to restore one.',
                    'Managed hosting costs more per month on paper, but the comparison isn\'t hosting cost versus hosting cost -- it\'s hosting cost versus the cost of downtime, lost data, or a slow support ticket queue during a crisis. For most operational business systems, that trade is worth making early rather than after a bad week.',
                ],
            ],
            [
                'slug' => 'what-counts-as-a-small-edit',
                'title' => '"Can You Just Add a Button?" — What Maintenance Actually Covers',
                'excerpt' => 'A practical breakdown of what fits inside a maintenance plan, and what needs its own quote.',
                'category' => 'Support',
                'author' => 'The Knower Team',
                'published_at' => now()->subDays(3)->toDateString(),
                'read_time' => '3 min',
                'is_published' => true,
                'body' => [
                    'One of the most common sources of friction between agencies and clients is a vague idea of what "maintenance" includes. We\'d rather be specific upfront than have that conversation after the invoice.',
                    'Small edits -- the kind covered by monthly Maintenance hours -- are things like adding or removing a button, changing text or colors, adding a field to an existing form, fixing a bug in something that used to work, or tweaking a report filter.',
                    'What doesn\'t fit in that bucket is anything that\'s really a new project wearing a small request\'s clothing: a new module or feature area, a full page redesign, a new third-party integration like a payment gateway, or a mobile app version of an existing web system.',
                    'The distinction matters because Maintenance plans are priced around a predictable number of hours per month. Treating a new-feature request as a "small edit" either blows through those hours fast or means someone\'s doing unpaid work -- neither is sustainable. Being upfront about the line keeps the relationship healthy on both sides.',
                ],
            ],
        ];
    }
}
