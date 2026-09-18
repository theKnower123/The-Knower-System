<?php

namespace Database\Seeders;

use App\Modules\CMS\Models\Service;
use Illuminate\Database\Seeder;

/**
 * Fills in the rich detail-page content (full_description, features,
 * benefits, process_steps, tech_stack, faqs, badge_label, cta_label) for
 * every existing Service row, matched by slug. Safe to re-run: it only
 * updates rows that already exist (created via CMS > Services), it never
 * creates duplicates.
 *
 * Run with: php artisan db:seed --class=Database\\Seeders\\ServiceContentSeeder
 */
class ServiceContentSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->content() as $slug => $data) {
            $service = Service::where('slug', $slug)->first();
            if (! $service) {
                $this->command?->warn("Skipped '{$slug}' -- no Service row with that slug exists yet.");
                continue;
            }
            $service->update($data);
            $this->command?->info("Updated content for '{$slug}'.");
        }
    }

    private function content(): array
    {
        return [

            'web-development' => [
                'badge_label' => 'High-Performance Web Solutions',
                'cta_label' => 'Start Your Web Project',
                'full_description' => 'We design and build custom web applications engineered for speed, scalability, and real business outcomes -- not template sites. From internal management systems to public-facing platforms, every build is architected around your actual workflow, with a modern stack (React, Laravel, PostgreSQL/MySQL) that stays maintainable long after launch.',
                'features' => [
                    ['title' => 'Custom Architecture', 'description' => 'A backend and database structure designed around your business logic, not a generic template forced to fit.'],
                    ['title' => 'Performance First', 'description' => 'Fast page loads and efficient queries from day one -- not an optimization pass added later.'],
                    ['title' => 'Responsive by Default', 'description' => 'Every screen works cleanly on desktop, tablet, and mobile without a separate "mobile version."'],
                    ['title' => 'Built-in Security', 'description' => 'Authentication, role-based permissions, and input validation are part of the architecture, not an afterthought.'],
                ],
                'benefits' => [
                    ['title' => 'Faster Time to Market', 'description' => 'Reusable components and a proven build process mean fewer surprises and a realistic launch date.'],
                    ['title' => 'You Own Everything', 'description' => 'Full source code and database ownership -- no vendor lock-in, ever.'],
                    ['title' => 'Bilingual Ready', 'description' => 'Arabic (RTL) and English support built in from the start, not bolted on later.'],
                ],
                'process_steps' => [
                    ['step' => 1, 'title' => 'Discovery', 'description' => 'We map your actual workflow, not a generic feature list, before writing a line of code.'],
                    ['step' => 2, 'title' => 'Design', 'description' => 'Wireframes and a UI design system you approve before development starts.'],
                    ['step' => 3, 'title' => 'Build', 'description' => 'Iterative development with regular check-ins, not a black box until "done."'],
                    ['step' => 4, 'title' => 'QA & Testing', 'description' => 'Manual and automated testing across devices before anything goes live.'],
                    ['step' => 5, 'title' => 'Launch & Support', 'description' => 'Deployment plus a support window to catch anything real usage surfaces.'],
                ],
                'tech_stack' => [
                    ['name' => 'React / Next.js', 'category' => 'Frontend'],
                    ['name' => 'TypeScript', 'category' => 'Language'],
                    ['name' => 'Laravel', 'category' => 'Backend'],
                    ['name' => 'Tailwind CSS', 'category' => 'Styling'],
                    ['name' => 'MySQL / PostgreSQL', 'category' => 'Database'],
                ],
                'faqs' => [
                    ['question' => 'How long does a typical web project take?', 'answer' => 'Simple sites: 2-4 weeks. Custom business systems: 6-12 weeks depending on scope and integrations.'],
                    ['question' => 'Do I own the source code?', 'answer' => 'Yes, completely. You get full ownership of the code and database once the project is delivered and paid for.'],
                    ['question' => 'Do you support Arabic and RTL layouts?', 'answer' => 'Yes, this is standard on every project, not an add-on.'],
                ],
            ],

            'mobile-apps' => [
                'badge_label' => 'Native-Feel Mobile Apps',
                'cta_label' => 'Start Your App Project',
                'full_description' => 'We build iOS and Android apps from a single codebase using Flutter or React Native, so you get near-native performance without paying for two separate teams. Apps can stand alone or plug directly into a web system we already built for you, sharing the same backend and data.',
                'features' => [
                    ['title' => 'One Codebase, Two Platforms', 'description' => 'iOS and Android ship together, cutting both cost and time-to-market roughly in half.'],
                    ['title' => 'Offline-Friendly', 'description' => 'Core features keep working without a signal, syncing automatically once reconnected.'],
                    ['title' => 'Push Notifications', 'description' => 'Real-time alerts for orders, approvals, reminders -- whatever drives your users back in.'],
                    ['title' => 'App Store Ready', 'description' => 'We handle the submission process for both the Apple App Store and Google Play.'],
                ],
                'benefits' => [
                    ['title' => 'Lower Cost Than Native x2', 'description' => 'One team, one codebase, both platforms -- instead of paying for iOS and Android separately.'],
                    ['title' => 'Connects to What You Already Have', 'description' => 'If we built your web system, the app reuses the same backend -- no duplicate data entry.'],
                    ['title' => 'Fast Iteration', 'description' => 'Over-the-air updates for many changes without waiting on a new store release.'],
                ],
                'process_steps' => [
                    ['step' => 1, 'title' => 'Scope & Screens', 'description' => 'We map every screen the app actually needs, based on real user flows.'],
                    ['step' => 2, 'title' => 'UI Design', 'description' => 'Mobile-first design that respects platform conventions on both iOS and Android.'],
                    ['step' => 3, 'title' => 'Development', 'description' => 'Built against your existing API or a new one, with regular test builds you can install.'],
                    ['step' => 4, 'title' => 'Device Testing', 'description' => 'Tested across a real range of screen sizes and OS versions, not just a simulator.'],
                    ['step' => 5, 'title' => 'Store Submission', 'description' => 'We handle Apple and Google\'s review process end-to-end.'],
                ],
                'tech_stack' => [
                    ['name' => 'Flutter', 'category' => 'Framework'],
                    ['name' => 'React Native', 'category' => 'Framework'],
                    ['name' => 'Firebase', 'category' => 'Backend Services'],
                    ['name' => 'REST / GraphQL APIs', 'category' => 'Integration'],
                ],
                'faqs' => [
                    ['question' => 'Can the app connect to a system you already built for me?', 'answer' => 'Yes -- this is the most cost-effective path since the backend, auth, and database already exist.'],
                    ['question' => 'Native or cross-platform -- which do you recommend?', 'answer' => 'Cross-platform (Flutter/React Native) for most business apps. True native is only worth the extra cost for apps with heavy device-specific features (advanced camera/AR, etc.).'],
                    ['question' => 'Do you handle App Store and Google Play submission?', 'answer' => 'Yes, including account setup guidance, listing content, and review corrections if the store requests changes.'],
                ],
            ],

            'cloud' => [
                'badge_label' => 'Cloud & DevOps Engineering',
                'cta_label' => 'Talk to a Cloud Engineer',
                'full_description' => 'We design and manage cloud infrastructure that scales with real traffic instead of buckling under it. From CI/CD pipelines that make deployment boring (in a good way) to monitoring that catches problems before your customers do, we handle the operational side so your team can focus on the product.',
                'features' => [
                    ['title' => 'CI/CD Pipelines', 'description' => 'Automated testing and deployment so shipping code is routine, not risky.'],
                    ['title' => 'Auto-Scaling Infrastructure', 'description' => 'Resources grow with traffic spikes and shrink back down -- you don\'t pay for idle capacity.'],
                    ['title' => '24/7 Monitoring & Alerts', 'description' => 'Real-time visibility into uptime, errors, and performance, with alerts before users notice.'],
                    ['title' => 'Infrastructure as Code', 'description' => 'Your entire server setup is version-controlled and reproducible, not a manual configuration nobody remembers.'],
                ],
                'benefits' => [
                    ['title' => 'Fewer Outages', 'description' => 'Proactive monitoring and redundancy catch issues before they become downtime.'],
                    ['title' => 'Predictable Costs', 'description' => 'Right-sized infrastructure means you\'re not overpaying for capacity you don\'t use.'],
                    ['title' => 'Ship Faster, Safer', 'description' => 'Automated pipelines mean deployments happen in minutes with a clear rollback path.'],
                ],
                'process_steps' => [
                    ['step' => 1, 'title' => 'Infrastructure Audit', 'description' => 'We review your current setup (or design one from scratch) against real traffic patterns.'],
                    ['step' => 2, 'title' => 'Architecture Design', 'description' => 'Cloud provider, scaling strategy, and redundancy plan matched to your actual needs and budget.'],
                    ['step' => 3, 'title' => 'Pipeline Setup', 'description' => 'CI/CD configured so every deploy is tested and reversible.'],
                    ['step' => 4, 'title' => 'Monitoring & Alerts', 'description' => 'Dashboards and alerting wired up before launch, not after the first incident.'],
                ],
                'tech_stack' => [
                    ['name' => 'AWS / DigitalOcean / GCP', 'category' => 'Cloud Provider'],
                    ['name' => 'Docker', 'category' => 'Containers'],
                    ['name' => 'GitHub Actions', 'category' => 'CI/CD'],
                    ['name' => 'Terraform', 'category' => 'Infrastructure as Code'],
                ],
                'faqs' => [
                    ['question' => 'Which cloud provider do you recommend?', 'answer' => 'Depends on budget and scale -- DigitalOcean for most small-to-mid projects, AWS/GCP once you need advanced managed services.'],
                    ['question' => 'Can you migrate us from our current host?', 'answer' => 'Yes, with a migration plan designed to minimize or eliminate downtime.'],
                    ['question' => 'Do you offer ongoing infrastructure management?', 'answer' => 'Yes, as part of our Managed Hosting and Maintenance plans.'],
                ],
            ],

            'hosting' => [
                'badge_label' => 'Enterprise-Grade Uptime',
                'cta_label' => 'Get a Hosting Quote',
                'full_description' => 'Managed hosting that just works -- we handle server configuration, security patching, backups, and monitoring so you\'re not the one getting paged at 2am. Whether it\'s a system we built or one you brought to us, we treat your uptime like it\'s our own.',
                'features' => [
                    ['title' => 'Daily Automated Backups', 'description' => 'Encrypted, tested backups -- not just files sitting untested on a drive.'],
                    ['title' => 'SSL & Security Hardening', 'description' => 'Certificates, firewall rules, and security patches kept current automatically.'],
                    ['title' => 'Uptime Monitoring', 'description' => 'Continuous checks with instant alerts if something goes down.'],
                    ['title' => 'Scalable Resources', 'description' => 'Upgrade CPU/RAM/storage as you grow without a full migration.'],
                ],
                'benefits' => [
                    ['title' => 'One Less Thing to Worry About', 'description' => 'Server maintenance is handled so your team can focus on the product, not the infrastructure.'],
                    ['title' => 'Fast Incident Response', 'description' => 'Real people monitoring real alerts, not a ticket queue that takes days.'],
                    ['title' => 'No Surprise Bills', 'description' => 'Clear monthly pricing tied to your actual usage tier.'],
                ],
                'process_steps' => [
                    ['step' => 1, 'title' => 'Technical Review', 'description' => 'We assess your system\'s current resource needs and traffic patterns.'],
                    ['step' => 2, 'title' => 'Server Setup', 'description' => 'Provisioned, secured, and configured before your data ever touches it.'],
                    ['step' => 3, 'title' => 'Migration', 'description' => 'If moving from another host, we plan for minimal downtime.'],
                    ['step' => 4, 'title' => 'Ongoing Monitoring', 'description' => 'Uptime checks, backups, and patching run continuously from day one.'],
                ],
                'tech_stack' => [
                    ['name' => 'Nginx / Apache', 'category' => 'Web Server'],
                    ['name' => "Let's Encrypt", 'category' => 'SSL'],
                    ['name' => 'UptimeRobot / custom monitoring', 'category' => 'Monitoring'],
                    ['name' => 'Automated backup pipelines', 'category' => 'Backup'],
                ],
                'faqs' => [
                    ['question' => 'Do you host systems you didn\'t build?', 'answer' => 'Yes -- we review the codebase first to make sure we can support it safely.'],
                    ['question' => 'What happens if the server goes down?', 'answer' => 'Monitoring alerts our team immediately, with response times defined by your plan tier.'],
                    ['question' => 'How often are backups taken?', 'answer' => 'Daily by default, with weekly options on lighter plans -- see our Pricing page for details.'],
                ],
            ],

            'desktop' => [
                'badge_label' => 'Desktop Software Engineering',
                'cta_label' => 'Discuss Your Desktop App',
                'full_description' => 'We build desktop applications for Windows, macOS, and Linux using modern frameworks like Electron and Tauri -- ideal for POS systems, offline-first tools, and internal software that needs to run reliably without a constant internet connection.',
                'features' => [
                    ['title' => 'Cross-Platform', 'description' => 'One codebase runs on Windows, macOS, and Linux.'],
                    ['title' => 'Offline-First Option', 'description' => 'Local data storage with sync to the server once a connection is available.'],
                    ['title' => 'Auto-Update', 'description' => 'New versions roll out to installed machines without manual reinstalls.'],
                    ['title' => 'Native OS Integration', 'description' => 'File system access, printers, and hardware peripherals (barcode scanners, receipt printers) supported.'],
                ],
                'benefits' => [
                    ['title' => 'Works Without Internet', 'description' => 'Critical for POS and shop-floor tools where connectivity can\'t be guaranteed.'],
                    ['title' => 'Lower Cost Than Native Per-OS', 'description' => 'One build instead of separate Windows and Mac development.'],
                    ['title' => 'Familiar to Staff', 'description' => 'Runs like a normal installed application, no browser tab to lose track of.'],
                ],
                'process_steps' => [
                    ['step' => 1, 'title' => 'Requirements & Hardware Check', 'description' => 'We confirm what peripherals (printers, scanners) and offline needs the app must support.'],
                    ['step' => 2, 'title' => 'UI Design', 'description' => 'Desktop-appropriate layouts, not a resized mobile screen.'],
                    ['step' => 3, 'title' => 'Development', 'description' => 'Built with sync logic if offline mode is required.'],
                    ['step' => 4, 'title' => 'Packaging & Distribution', 'description' => 'Installers built for each target OS, with auto-update configured.'],
                ],
                'tech_stack' => [
                    ['name' => 'Electron', 'category' => 'Framework'],
                    ['name' => 'Tauri', 'category' => 'Framework'],
                    ['name' => 'SQLite', 'category' => 'Local Storage'],
                    ['name' => 'REST API sync', 'category' => 'Integration'],
                ],
                'faqs' => [
                    ['question' => 'Can it work completely offline?', 'answer' => 'Yes, with local storage and sync-when-connected logic -- common for POS and multi-branch systems.'],
                    ['question' => 'Does it support receipt printers and barcode scanners?', 'answer' => 'Yes, standard peripherals are supported; unusual hardware is scoped case by case.'],
                    ['question' => 'How do updates get to installed machines?', 'answer' => 'Through a built-in auto-update mechanism -- no manual reinstall needed.'],
                ],
            ],

            'api' => [
                'badge_label' => 'APIs That Scale',
                'cta_label' => 'Plan Your Integration',
                'full_description' => 'We design and build REST and GraphQL APIs that other systems can actually rely on -- documented, versioned, rate-limited, and built to handle growth. Whether it\'s connecting your web app to a mobile client or integrating a third-party payment gateway, we make sure the contract between systems stays stable.',
                'features' => [
                    ['title' => 'RESTful & GraphQL', 'description' => 'Built with the right approach for your use case, not a one-size-fits-all default.'],
                    ['title' => 'Full Documentation', 'description' => 'OpenAPI specs so your team (or a third party) can integrate without guesswork.'],
                    ['title' => 'Authentication & Rate Limiting', 'description' => 'Token-based auth and usage limits built in to protect against abuse.'],
                    ['title' => 'Versioning Strategy', 'description' => 'Breaking changes don\'t break existing integrations.'],
                ],
                'benefits' => [
                    ['title' => 'Reliable Integrations', 'description' => 'Well-documented, versioned APIs mean fewer "it broke and we don\'t know why" moments.'],
                    ['title' => 'Faster Partner Onboarding', 'description' => 'Clear docs mean third parties can integrate without back-and-forth support tickets.'],
                    ['title' => 'Future-Proof', 'description' => 'Versioning means you can evolve the API without breaking every client at once.'],
                ],
                'process_steps' => [
                    ['step' => 1, 'title' => 'API Design', 'description' => 'Endpoints, data shapes, and auth strategy planned before implementation.'],
                    ['step' => 2, 'title' => 'Build', 'description' => 'Implemented with validation, error handling, and rate limiting from the start.'],
                    ['step' => 3, 'title' => 'Documentation', 'description' => 'OpenAPI/Swagger docs generated alongside the code, not written after the fact.'],
                    ['step' => 4, 'title' => 'Testing & Handoff', 'description' => 'Automated tests plus example requests your team can run immediately.'],
                ],
                'tech_stack' => [
                    ['name' => 'Laravel / Node.js', 'category' => 'Backend'],
                    ['name' => 'REST / GraphQL', 'category' => 'API Style'],
                    ['name' => 'OpenAPI / Swagger', 'category' => 'Documentation'],
                    ['name' => 'OAuth2 / Sanctum', 'category' => 'Authentication'],
                ],
                'faqs' => [
                    ['question' => 'Do you provide API documentation?', 'answer' => 'Yes, always -- OpenAPI/Swagger docs are part of every API project, not an optional extra.'],
                    ['question' => 'Can you integrate with third-party services (payments, SMS, etc.)?', 'answer' => 'Yes, this is one of our most common requests -- payment gateways, SMS providers, and CRMs.'],
                    ['question' => 'What about rate limiting and abuse protection?', 'answer' => 'Built in by default, tuned to your expected traffic.'],
                ],
            ],

            'seo' => [
                'badge_label' => 'Technical SEO & Content Strategy',
                'cta_label' => 'Get an SEO Audit',
                'full_description' => 'SEO that starts with the technical foundation, not just keyword stuffing. We fix what\'s actually holding your site back in search results -- site speed, crawlability, structured data -- then build a content strategy around what your real customers are searching for.',
                'features' => [
                    ['title' => 'Technical SEO Audit', 'description' => 'Site speed, mobile-friendliness, crawl errors, and structured data reviewed in detail.'],
                    ['title' => 'Keyword & Content Strategy', 'description' => 'Content planned around what your actual target customers search for, not generic volume.'],
                    ['title' => 'On-Page Optimization', 'description' => 'Meta tags, headings, internal linking structured for both users and search engines.'],
                    ['title' => 'Monthly Reporting', 'description' => 'Clear rankings and traffic reports, not a wall of jargon.'],
                ],
                'benefits' => [
                    ['title' => 'Sustainable Traffic Growth', 'description' => 'Organic search traffic that compounds over months, not a one-time spike.'],
                    ['title' => 'Better Conversion, Not Just Traffic', 'description' => 'We target searches with buying intent, not just high volume.'],
                    ['title' => 'No Black-Hat Risk', 'description' => 'Fully compliant with search engine guidelines -- no shortcuts that risk a penalty later.'],
                ],
                'process_steps' => [
                    ['step' => 1, 'title' => 'Audit', 'description' => 'Full technical and content review of the current site.'],
                    ['step' => 2, 'title' => 'Strategy & Roadmap', 'description' => 'Prioritized action plan based on what will actually move rankings.'],
                    ['step' => 3, 'title' => 'Implementation', 'description' => 'Technical fixes and content published on a regular cadence.'],
                    ['step' => 4, 'title' => 'Monthly Reporting', 'description' => 'Rankings, traffic, and next steps reviewed together every month.'],
                ],
                'tech_stack' => [
                    ['name' => 'Google Search Console', 'category' => 'Tooling'],
                    ['name' => 'Google Analytics', 'category' => 'Tooling'],
                    ['name' => 'Schema.org structured data', 'category' => 'Technical'],
                    ['name' => 'Core Web Vitals optimization', 'category' => 'Technical'],
                ],
                'faqs' => [
                    ['question' => 'How long until we see results?', 'answer' => 'Technical fixes can show impact within weeks; meaningful ranking growth typically takes 3-6 months.'],
                    ['question' => 'Do you write the content yourselves?', 'answer' => 'Yes, or we can work with your existing writers using our keyword and structure strategy.'],
                    ['question' => 'Is this a one-time service or ongoing?', 'answer' => 'SEO works best as an ongoing monthly engagement -- rankings need maintenance, not just a one-time fix.'],
                ],
            ],

            'marketing' => [
                'badge_label' => 'Digital Performance Marketing',
                'cta_label' => 'Plan Your Campaign',
                'full_description' => 'Paid ads and content marketing built around one goal: leads that actually convert. We manage campaigns across Facebook, Instagram, and LinkedIn, track cost-per-lead obsessively, and report in plain numbers -- not vanity metrics.',
                'features' => [
                    ['title' => 'Paid Campaign Management', 'description' => 'Facebook, Instagram, LinkedIn, and Google Ads set up, tested, and optimized.'],
                    ['title' => 'Content Calendar', 'description' => 'Organic social content planned and scheduled, not thrown together last minute.'],
                    ['title' => 'Lead Tracking & Attribution', 'description' => 'Every lead tagged with its source so you know exactly what\'s working.'],
                    ['title' => 'Transparent Reporting', 'description' => 'Cost-per-lead, conversion rate, and spend reported in plain numbers.'],
                ],
                'benefits' => [
                    ['title' => 'Lower Cost Per Lead Over Time', 'description' => 'Continuous testing and optimization instead of a "set it and forget it" campaign.'],
                    ['title' => 'Full Visibility', 'description' => 'You see exactly what\'s spent and what it generated, no black-box reporting.'],
                    ['title' => 'Aligned With Sales', 'description' => 'Campaigns built around leads your sales team can actually close.'],
                ],
                'process_steps' => [
                    ['step' => 1, 'title' => 'Audience & Goal Definition', 'description' => 'Who we\'re targeting and what counts as a successful lead, defined upfront.'],
                    ['step' => 2, 'title' => 'Campaign Setup', 'description' => 'Ad creative, targeting, and budget structured for testing before scaling.'],
                    ['step' => 3, 'title' => 'Launch & Optimize', 'description' => 'Live campaigns monitored daily in the first weeks, adjusted based on real data.'],
                    ['step' => 4, 'title' => 'Monthly Review', 'description' => 'Performance reviewed together, budget reallocated toward what\'s working.'],
                ],
                'tech_stack' => [
                    ['name' => 'Meta Ads Manager', 'category' => 'Platform'],
                    ['name' => 'LinkedIn Campaign Manager', 'category' => 'Platform'],
                    ['name' => 'Google Ads', 'category' => 'Platform'],
                    ['name' => 'UTM tracking + CRM integration', 'category' => 'Attribution'],
                ],
                'faqs' => [
                    ['question' => 'What\'s a realistic starting budget?', 'answer' => 'We typically recommend starting at 100-150 EGP/day per platform to gather enough data to optimize.'],
                    ['question' => 'Do leads go straight into our CRM?', 'answer' => 'Yes -- if we built your system, leads flow directly into CRM > Leads with source attribution.'],
                    ['question' => 'How is success measured?', 'answer' => 'Primarily cost-per-lead and lead-to-client conversion rate, not just clicks or impressions.'],
                ],
            ],

            'branding' => [
                'badge_label' => 'Branding & Visual Identity',
                'cta_label' => 'Start Your Brand Project',
                'full_description' => 'A logo isn\'t a brand. We build complete visual identity systems -- logo, color palette, typography, and usage guidelines -- so everything from your website to your social posts looks like it came from the same company, on purpose.',
                'features' => [
                    ['title' => 'Logo & Mark Design', 'description' => 'Multiple concepts explored before landing on a final direction you\'re confident in.'],
                    ['title' => 'Full Brand Guidelines', 'description' => 'Color, typography, spacing, and usage rules documented so consistency doesn\'t depend on memory.'],
                    ['title' => 'Marketing Templates', 'description' => 'Social media, presentation, and document templates that match the brand out of the box.'],
                    ['title' => 'Digital-Ready Assets', 'description' => 'Every file format you\'ll actually need -- web, print, social -- delivered together.'],
                ],
                'benefits' => [
                    ['title' => 'Looks Established from Day One', 'description' => 'A consistent identity signals credibility before a customer reads a single word.'],
                    ['title' => 'Faster Content Creation', 'description' => 'Templates mean your team doesn\'t redesign from scratch for every post.'],
                    ['title' => 'Easy to Hand to Anyone', 'description' => 'Clear guidelines mean any designer or agency you work with later stays on-brand.'],
                ],
                'process_steps' => [
                    ['step' => 1, 'title' => 'Discovery', 'description' => 'Understanding your business, audience, and how you want to be perceived.'],
                    ['step' => 2, 'title' => 'Concept Exploration', 'description' => 'Multiple distinct directions presented, not one logo with color variations.'],
                    ['step' => 3, 'title' => 'Refinement', 'description' => 'Your chosen direction refined based on feedback until it\'s right.'],
                    ['step' => 4, 'title' => 'Guidelines & Handoff', 'description' => 'Full brand guide plus every file format delivered in an organized package.'],
                ],
                'tech_stack' => [
                    ['name' => 'Figma', 'category' => 'Design Tool'],
                    ['name' => 'Adobe Illustrator', 'category' => 'Design Tool'],
                    ['name' => 'Brand guideline documentation', 'category' => 'Deliverable'],
                ],
                'faqs' => [
                    ['question' => 'How many logo concepts do we get to choose from?', 'answer' => 'Typically 3 distinct directions in the first round, refined based on your feedback.'],
                    ['question' => 'What file formats do we receive?', 'answer' => 'Vector (SVG/AI), print-ready (PDF), and web-ready (PNG) formats, plus the full guidelines document.'],
                    ['question' => 'Can you redesign an existing brand instead of starting fresh?', 'answer' => 'Yes -- we can evolve an existing identity rather than replace it entirely, if that\'s the better fit.'],
                ],
            ],

        ];
    }
}
