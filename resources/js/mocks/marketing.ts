// Marketing content — all copy for the public site lives here.
export type MarketingId = string;

export interface Industry { slug: string; name: string; icon: string; summary: string; highlights: string[] }
export interface Product { slug: string; name: string; tagline: string; description: string; features: string[]; category: string }
export interface Service { slug: string; name: string; tagline: string; description: string; deliverables: string[]; icon: string }
export interface PortfolioItem { slug: string; title: string; category: string; client: string; year: number; cover: string; summary: string; stack: string[] }
export interface CaseStudy { slug: string; title: string; client: string; industry: string; challenge: string; solution: string; result: string[]; stack: string[] }
export interface Job { slug: string; title: string; department: string; location: string; type: string; level: string; summary: string; requirements: string[]; benefits: string[] }
export interface BlogPost { slug: string; title: string; excerpt: string; category: string; author: string; date: string; readTime: string; body: string[] }
export interface DocPage { slug: string; title: string; group: string; body: string[] }
export interface Testimonial { name: string; role: string; company: string; quote: string; avatar: string }
export interface TeamMember { name: string; role: string; department: string; bio: string; avatar: string }
export interface Partner { name: string; tier: string; category: string }
export interface Event { slug: string; title: string; date: string; location: string; type: string; summary: string }
export interface PressItem { slug: string; title: string; source: string; date: string; excerpt: string }
export interface FaqItem { q: string; a: string; group: string }
export interface Plan { name: string; price: { monthly: number; yearly: number }; blurb: string; features: string[]; highlight?: boolean; cta?: string }

export const stats = [
  { value: "500+", label: "Projects delivered" },
  { value: "150+", label: "Clients worldwide" },
  { value: "20+", label: "Countries served" },
  { value: "99.9%", label: "Platform uptime" },
];

export const industries: Industry[] = [
  { slug: "healthcare", name: "Healthcare", icon: "HeartPulse", summary: "HIPAA-ready platforms for clinics, hospitals and telehealth.", highlights: ["Patient portals", "EMR integrations", "Telemedicine"] },
  { slug: "education", name: "Education", icon: "GraduationCap", summary: "LMS, student portals and school ERP.", highlights: ["LMS", "Student information systems", "Assessment engines"] },
  { slug: "retail", name: "Retail", icon: "ShoppingBag", summary: "Omnichannel commerce with inventory and POS.", highlights: ["Headless commerce", "POS", "Loyalty"] },
  { slug: "real-estate", name: "Real Estate", icon: "Building2", summary: "Listing portals, CRM and property management.", highlights: ["Listings", "Lead scoring", "Contracts"] },
  { slug: "government", name: "Government", icon: "Landmark", summary: "Citizen services, e-gov portals and secure workflows.", highlights: ["e-Services", "Case management", "Identity"] },
  { slug: "restaurants", name: "Restaurants", icon: "Utensils", summary: "POS, KDS, online ordering and delivery.", highlights: ["Online ordering", "KDS", "Loyalty"] },
  { slug: "pharmacy", name: "Pharmacy", icon: "Pill", summary: "Dispensing, inventory and insurance workflows.", highlights: ["Inventory", "Insurance claims", "e-Prescriptions"] },
  { slug: "hotels", name: "Hotels", icon: "Hotel", summary: "PMS, channel manager and guest experience.", highlights: ["PMS", "Channel manager", "Guest app"] },
  { slug: "factories", name: "Factories", icon: "Factory", summary: "MES, quality and shop-floor visibility.", highlights: ["MES", "Quality", "OEE"] },
  { slug: "construction", name: "Construction", icon: "HardHat", summary: "Project controls, BIM and site operations.", highlights: ["Project controls", "Site ops", "BOQ"] },
  { slug: "ngos", name: "NGOs", icon: "HandHeart", summary: "Donation platforms, beneficiary tracking and CRM.", highlights: ["Donations", "Case tracking", "Grants"] },
];

export const products: Product[] = [
  { slug: "crm", name: "The Knower CRM", tagline: "Close more, faster.", description: "A modern sales CRM built for services businesses. Pipelines, quotes, contracts and AI-assisted follow-up.", features: ["Kanban pipelines", "Quote & contract generation", "AI email drafts", "WhatsApp & email inbox", "Forecasting"], category: "Sales" },
  { slug: "erp", name: "The Knower ERP", tagline: "Run the whole company.", description: "Finance, projects, HR and inventory unified with a single audit trail.", features: ["Multi-currency finance", "Project accounting", "HR & payroll", "Inventory & POs", "Approvals"], category: "Operations" },
  { slug: "hr", name: "The Knower HR", tagline: "People operations on autopilot.", description: "Onboarding, attendance, leaves and payroll for global teams.", features: ["Attendance & shifts", "Leave workflows", "Payroll", "Performance reviews", "Org charts"], category: "People" },
  { slug: "pos", name: "The Knower POS", tagline: "Retail-grade point of sale.", description: "Fast checkout, offline mode, integrated payments and loyalty.", features: ["Offline first", "Split payments", "Loyalty & gift cards", "Multi-store", "Kitchen display"], category: "Retail" },
  { slug: "ai", name: "The Knower AI", tagline: "Your operations copilot.", description: "Natural-language search, summaries and automations across your data.", features: ["Ask-your-data", "Doc automation", "OCR pipelines", "Voice agents", "Predictive analytics"], category: "AI" },
  { slug: "cms", name: "The Knower CMS", tagline: "Publishing without the pain.", description: "Multi-site, multi-language content platform with visual editing.", features: ["Multi-language", "Visual editor", "Scheduled publishing", "Media library", "API-first"], category: "Content" },
];

export const services: Service[] = [
  { slug: "web-development", name: "Web Development", tagline: "High-performance web apps.", description: "From marketing sites to enterprise platforms with modern stacks.", deliverables: ["Design system", "Full-stack build", "SEO & analytics", "12-month warranty"], icon: "Globe" },
  { slug: "mobile-apps", name: "Mobile Apps", tagline: "iOS & Android, one codebase.", description: "React Native and Flutter apps with native performance.", deliverables: ["UX design", "iOS/Android build", "App store launch", "OTA updates"], icon: "Smartphone" },
  { slug: "desktop", name: "Desktop Software", tagline: "Windows, macOS, Linux.", description: "Electron and Tauri desktop apps for demanding workflows.", deliverables: ["Installer", "Auto-update", "Offline support"], icon: "Monitor" },
  { slug: "cloud", name: "Cloud & DevOps", tagline: "Ship faster, sleep better.", description: "Kubernetes, IaC and 24/7 observability.", deliverables: ["Cloud architecture", "CI/CD", "Monitoring", "SRE on retainer"], icon: "Cloud" },
  { slug: "api", name: "API Engineering", tagline: "APIs that scale.", description: "REST, GraphQL and event-driven services.", deliverables: ["API design", "OpenAPI spec", "SDKs", "Rate limiting"], icon: "Code" },
  { slug: "hosting", name: "Managed Hosting", tagline: "Enterprise-grade uptime.", description: "Fully managed hosting with SLAs and 24/7 support.", deliverables: ["Managed servers", "Daily backups", "Monitoring", "SLA support"], icon: "Server" },
  { slug: "seo", name: "SEO", tagline: "Rank where it matters.", description: "Technical SEO, content and link strategy.", deliverables: ["Audit", "Roadmap", "Content plan", "Monthly reporting"], icon: "Search" },
  { slug: "marketing", name: "Digital Marketing", tagline: "Growth that compounds.", description: "Performance ads, lifecycle and content marketing.", deliverables: ["Strategy", "Campaign ops", "Creative", "Reporting"], icon: "Megaphone" },
  { slug: "branding", name: "Branding & Identity", tagline: "Brands people remember.", description: "Identity systems, guidelines and launch assets.", deliverables: ["Logo & marks", "Brand guidelines", "Templates"], icon: "Palette" },
  { slug: "consulting", name: "Consulting", tagline: "Strategic guidance.", description: "Advisory for CTOs, product leaders and founders.", deliverables: ["Discovery", "Roadmap", "Team coaching"], icon: "Compass" },
  { slug: "maintenance", name: "Maintenance", tagline: "Keep it running.", description: "Patching, monitoring and continuous improvement.", deliverables: ["SLA support", "Security patches", "Feature increments"], icon: "Wrench" },
];

export const plans: Plan[] = [];

export const hostingPlans: Plan[] = [];

export const maintenancePlans: Plan[] = [];

export const portfolio: PortfolioItem[] = [
  { slug: "medcare-portal", title: "MedCare Patient Portal", category: "Healthcare", client: "MedCare Group", year: 2025, cover: "hero-med", summary: "Unified patient portal serving 40 clinics across the GCC.", stack: ["React", "Laravel", "MySQL", "AWS"] },
  { slug: "shelfsmart-pos", title: "ShelfSmart POS", category: "Retail", client: "ShelfSmart", year: 2024, cover: "hero-retail", summary: "Cloud POS with offline-first architecture across 220 stores.", stack: ["Flutter", "Node.js", "Postgres"] },
  { slug: "edunova-lms", title: "EduNova LMS", category: "Education", client: "EduNova", year: 2025, cover: "hero-edu", summary: "Blended-learning LMS with 80k students.", stack: ["React", "Django", "AWS"] },
  { slug: "buildplan", title: "BuildPlan Site Ops", category: "Construction", client: "Al Bunyan", year: 2024, cover: "hero-build", summary: "Mobile site ops app for 5,000 field engineers.", stack: ["React Native", "GraphQL", "Azure"] },
  { slug: "citypay", title: "CityPay e-Gov", category: "Government", client: "City of Riyadh", year: 2023, cover: "hero-gov", summary: "Citizen payments portal handling $200M+ annually.", stack: ["Vue", "Laravel", "Oracle"] },
  { slug: "fitfuel", title: "FitFuel Nutrition App", category: "Consumer", client: "FitFuel", year: 2025, cover: "hero-fit", summary: "AI meal-planning app with 500k active users.", stack: ["React Native", "Python", "OpenAI"] },
  { slug: "logiroute", title: "LogiRoute Fleet TMS", category: "Logistics", client: "LogiRoute", year: 2024, cover: "hero-log", summary: "Real-time fleet TMS for 12,000 vehicles.", stack: ["React", "Go", "Kafka"] },
  { slug: "vaultbank", title: "VaultBank Onboarding", category: "Fintech", client: "VaultBank", year: 2025, cover: "hero-fin", summary: "Digital onboarding cutting KYC from 5 days to 8 minutes.", stack: ["Next.js", "Node.js", "AWS"] },
  { slug: "farmly", title: "Farmly IoT", category: "AgriTech", client: "Farmly", year: 2023, cover: "hero-farm", summary: "IoT platform managing 900 hectares of farmland.", stack: ["React", "MQTT", "TimescaleDB"] },
];

export const caseStudies: CaseStudy[] = [
  { slug: "medcare", title: "MedCare cut patient wait times by 63%", client: "MedCare Group", industry: "Healthcare", challenge: "Manual paper intake across 40 clinics caused 45-minute wait times and lost records.", solution: "Unified patient portal with digital intake, EMR integration and SMS/WhatsApp appointment reminders.", result: ["63% shorter wait times", "40 clinics onboarded in 4 months", "98% patient satisfaction"], stack: ["React", "Laravel", "MySQL", "AWS"] },
  { slug: "shelfsmart", title: "ShelfSmart scaled POS to 220 stores", client: "ShelfSmart", industry: "Retail", challenge: "Legacy POS crashed during peak hours and had no offline mode.", solution: "Offline-first Flutter POS with real-time sync and centralized reporting.", result: ["220 stores migrated", "Zero downtime holiday season", "$14M in additional revenue"], stack: ["Flutter", "Node.js", "Postgres"] },
  { slug: "edunova", title: "EduNova launched to 80k students in 12 weeks", client: "EduNova", industry: "Education", challenge: "COVID demanded a full LMS launch in one term.", solution: "Modular LMS with live classes, assessments and parent portals.", result: ["80k students onboarded", "12-week launch", "4.7/5 teacher rating"], stack: ["React", "Django", "AWS"] },
];

export const technologies = [
  { name: "React", category: "Frontend" }, { name: "Vue", category: "Frontend" }, { name: "Angular", category: "Frontend" },
  { name: "Next.js", category: "Frontend" }, { name: "TypeScript", category: "Language" },
  { name: "Laravel", category: "Backend" }, { name: "Node.js", category: "Backend" }, { name: "Django", category: "Backend" },
  { name: "Ruby on Rails", category: "Backend" }, { name: "Go", category: "Backend" }, { name: "Python", category: "Language" },
  { name: "Flutter", category: "Mobile" }, { name: "React Native", category: "Mobile" }, { name: "Swift", category: "Mobile" }, { name: "Kotlin", category: "Mobile" },
  { name: "PostgreSQL", category: "Database" }, { name: "MySQL", category: "Database" }, { name: "MongoDB", category: "Database" }, { name: "Redis", category: "Database" },
  { name: "AWS", category: "Cloud" }, { name: "Azure", category: "Cloud" }, { name: "Google Cloud", category: "Cloud" }, { name: "Cloudflare", category: "Cloud" },
  { name: "Docker", category: "DevOps" }, { name: "Kubernetes", category: "DevOps" }, { name: "Terraform", category: "DevOps" },
  { name: "OpenAI", category: "AI" }, { name: "TensorFlow", category: "AI" }, { name: "PyTorch", category: "AI" },
];

export const aiSolutions = [
  { icon: "MessageSquare", title: "AI Chatbots", desc: "24/7 customer support agents fluent in your products." },
  { icon: "Zap", title: "Process Automation", desc: "Automate approvals, data entry and repetitive workflows." },
  { icon: "FileText", title: "OCR & Document AI", desc: "Extract structured data from invoices, IDs and forms." },
  { icon: "Eye", title: "Computer Vision", desc: "Detect defects, count SKUs and monitor sites in real time." },
  { icon: "Mic", title: "Voice Agents", desc: "Multilingual voice bots for inbound & outbound calls." },
  { icon: "TrendingUp", title: "Predictive Analytics", desc: "Forecast demand, churn and revenue with your data." },
  { icon: "Search", title: "Semantic Search", desc: "Natural-language search across your entire knowledge base." },
  { icon: "BarChart3", title: "AI Analytics", desc: "Ask your data questions and get instant answers." },
];

export const testimonials: Testimonial[] = [
  { name: "Sarah Al-Khouri", role: "CTO", company: "MedCare Group", quote: "The Knower shipped in months what our previous vendor couldn't in years. Rare to find a team this senior.", avatar: "SA" },
  { name: "James O'Connor", role: "CEO", company: "ShelfSmart", quote: "We migrated 220 stores without a single hour of downtime. That doesn't happen by accident.", avatar: "JO" },
  { name: "Fatima Al-Zahra", role: "VP Product", company: "EduNova", quote: "They think like product people, not contractors. That's why we've renewed three years running.", avatar: "FZ" },
  { name: "Michael Chen", role: "Head of Digital", company: "VaultBank", quote: "Cut our KYC from five days to eight minutes. Regulators loved it.", avatar: "MC" },
  { name: "Layla Haddad", role: "COO", company: "LogiRoute", quote: "The dashboards alone paid for the entire project in the first quarter.", avatar: "LH" },
  { name: "David Park", role: "Founder", company: "FitFuel", quote: "Half a million users, zero major incidents. Best engineering team we've worked with.", avatar: "DP" },
];

export const trustedBy = ["MedCare", "ShelfSmart", "EduNova", "VaultBank", "LogiRoute", "FitFuel", "Al Bunyan", "City of Riyadh", "Farmly", "Northwind", "Contoso", "Fabrikam"];

export const team: TeamMember[] = [
  { name: "Omar Al-Farsi", role: "Chief Executive Officer", department: "Leadership", bio: "Two decades scaling software companies across MENA and beyond.", avatar: "OF" },
  { name: "Nadia Rahman", role: "Chief Technology Officer", department: "Leadership", bio: "Ex-AWS principal engineer. Cloud-native evangelist.", avatar: "NR" },
  { name: "Yusuf Kamal", role: "Chief Product Officer", department: "Leadership", bio: "Built products used by 50M+ people.", avatar: "YK" },
  { name: "Amira Saleh", role: "VP Engineering", department: "Engineering", bio: "Scaled engineering orgs from 5 to 500.", avatar: "AS" },
  { name: "Karim Hassan", role: "Head of Design", department: "Design", bio: "Award-winning brand and product designer.", avatar: "KH" },
  { name: "Lina Chen", role: "Head of Sales", department: "Sales", bio: "Enterprise SaaS sales leader.", avatar: "LC" },
  { name: "Priya Sharma", role: "Head of People", department: "HR", bio: "Culture builder and coach.", avatar: "PS" },
  { name: "Tariq Al-Mansouri", role: "Head of Marketing", department: "Marketing", bio: "Storyteller-turned-growth-marketer.", avatar: "TM" },
];

export const partners: Partner[] = [
  { name: "Microsoft", tier: "Gold Partner", category: "Cloud" },
  { name: "Amazon Web Services", tier: "Advanced Consulting", category: "Cloud" },
  { name: "Google Cloud", tier: "Premier Partner", category: "Cloud" },
  { name: "Meta", tier: "Business Partner", category: "Marketing" },
  { name: "GitHub", tier: "Verified Partner", category: "DevOps" },
  { name: "Laravel", tier: "Official Partner", category: "Framework" },
  { name: "OpenAI", tier: "Solutions Partner", category: "AI" },
  { name: "Cloudflare", tier: "Enterprise Partner", category: "Cloud" },
  { name: "Stripe", tier: "Verified Partner", category: "Payments" },
  { name: "Vercel", tier: "Agency Partner", category: "Cloud" },
];

export const clientLogos = ["MedCare", "ShelfSmart", "EduNova", "Al Bunyan", "City of Riyadh", "FitFuel", "LogiRoute", "VaultBank", "Farmly", "Northwind", "Contoso", "Fabrikam", "Globex", "Initech", "Umbrella", "Wayne Ent."];

export const jobs: Job[] = [
  { slug: "senior-fullstack", title: "Senior Full-Stack Engineer", department: "Engineering", location: "Remote / Riyadh", type: "Full-time", level: "Senior", summary: "Ship product across React and Laravel with a tight-knit team.", requirements: ["5+ years full-stack", "React + TypeScript", "Laravel or Node.js", "Strong system design"], benefits: ["Remote-first", "Stock options", "Learning budget", "Health insurance"] },
  { slug: "mobile-lead", title: "Mobile Engineering Lead", department: "Engineering", location: "Dubai", type: "Full-time", level: "Lead", summary: "Lead our React Native & Flutter practice.", requirements: ["7+ years mobile", "React Native or Flutter", "Team leadership"], benefits: ["Relocation support", "Stock options", "Health insurance"] },
  { slug: "ai-engineer", title: "AI/ML Engineer", department: "AI", location: "Remote", type: "Full-time", level: "Mid", summary: "Build production LLM and vision pipelines.", requirements: ["Python", "PyTorch/TensorFlow", "LLM/RAG experience"], benefits: ["Remote-first", "GPU budget", "Conference sponsorship"] },
  { slug: "product-designer", title: "Product Designer", department: "Design", location: "Cairo", type: "Full-time", level: "Mid", summary: "Design polished, delightful product experiences.", requirements: ["4+ years product design", "Figma mastery", "Design systems"], benefits: ["Remote-friendly", "Design tools budget"] },
  { slug: "devops-engineer", title: "DevOps Engineer", department: "Platform", location: "Remote", type: "Full-time", level: "Senior", summary: "Own our multi-cloud platform and CI/CD.", requirements: ["Kubernetes", "Terraform", "AWS or GCP"], benefits: ["Remote-first", "On-call bonus"] },
  { slug: "qa-engineer", title: "QA Automation Engineer", department: "Quality", location: "Remote", type: "Full-time", level: "Mid", summary: "Grow our automated test coverage.", requirements: ["Cypress/Playwright", "API testing"], benefits: ["Remote-first", "Learning budget"] },
  { slug: "sales-lead", title: "Enterprise Sales Lead", department: "Sales", location: "Riyadh", type: "Full-time", level: "Senior", summary: "Own our enterprise sales in the GCC.", requirements: ["7+ years enterprise SaaS sales", "Arabic + English"], benefits: ["Uncapped commission", "Stock options"] },
  { slug: "intern-frontend", title: "Frontend Engineering Intern", department: "Engineering", location: "Remote", type: "Internship", level: "Intern", summary: "Learn on real projects with a senior mentor.", requirements: ["JavaScript basics", "Curiosity"], benefits: ["Paid", "Mentorship", "Potential to convert"] },
];

export const blog: BlogPost[] = [
  { slug: "shipping-fast-without-breaking-things", title: "Shipping fast without breaking things", excerpt: "A pragmatic guide to keeping deploys boring while moving quickly.", category: "Engineering", author: "Nadia Rahman", date: "2026-07-01", readTime: "8 min", body: ["Ship small. Ship often. Instrument everything. This is the mantra we live by across every client engagement.", "In this article we'll walk through the practices that let us deploy dozens of times per day with high confidence.", "Feature flags, progressive rollouts, and automated rollback are the three pillars of modern deployment."] },
  { slug: "ai-in-enterprise-what-actually-works", title: "AI in the enterprise: what actually works", excerpt: "Beyond the hype — where LLMs create real ROI today.", category: "AI", author: "Yusuf Kamal", date: "2026-06-18", readTime: "10 min", body: ["We've deployed AI to production for dozens of enterprises. Here's what actually works and what doesn't.", "Document extraction, semantic search, and internal copilots are the three highest-ROI use cases.", "Beware of shiny demos that don't survive contact with real data."] },
  { slug: "designing-for-arabic-and-english", title: "Designing for Arabic and English", excerpt: "RTL is not a checkbox — it's a design system decision.", category: "Design", author: "Karim Hassan", date: "2026-05-30", readTime: "6 min", body: ["Bilingual design is more than mirroring layouts. Typography, iconography, and even color meaning shift.", "Start with a bilingual type ramp. Space Grotesk and IBM Plex are our default pair for this exact reason."] },
  { slug: "hiring-senior-engineers-in-2026", title: "Hiring senior engineers in 2026", excerpt: "The playbook we use to hire and keep the best.", category: "People", author: "Priya Sharma", date: "2026-05-15", readTime: "7 min", body: ["Great engineers don't respond to job boards. They respond to interesting problems.", "Our funnel is 80% inbound, 20% sourcing, and 100% relationship-driven."] },
  { slug: "the-cost-of-bad-hosting", title: "The hidden cost of bad hosting", excerpt: "Why cheap hosting always ends up expensive.", category: "Cloud", author: "Nadia Rahman", date: "2026-04-28", readTime: "5 min", body: ["A missed hour of uptime costs an average e-commerce site $18,000.", "Managed hosting isn't a luxury — it's insurance."] },
  { slug: "scaling-postgres-to-a-billion-rows", title: "Scaling Postgres to a billion rows", excerpt: "Practical partitioning and indexing techniques.", category: "Engineering", author: "Amira Saleh", date: "2026-04-10", readTime: "12 min", body: ["Postgres will happily hold a billion rows if you set it up right.", "Partition early. Index selectively. Vacuum religiously."] },
];

export const docs: DocPage[] = [
  { slug: "getting-started", title: "Getting started", group: "Basics", body: ["Welcome to The Knower OS documentation.", "This guide walks you through installation, initial setup, and your first project."] },
  { slug: "installation", title: "Installation", group: "Basics", body: ["Install The Knower OS via Docker or on bare metal.", "Docker is the recommended path for most teams."] },
  { slug: "authentication", title: "Authentication", group: "Basics", body: ["The Knower OS supports SSO via SAML and OIDC, plus native email/password."] },
  { slug: "api-reference", title: "API reference", group: "Developer", body: ["Our REST API follows OpenAPI 3.1.", "Base URL: https://api.theknower.io/v1"] },
  { slug: "webhooks", title: "Webhooks", group: "Developer", body: ["Subscribe to platform events via HTTPS webhooks."] },
  { slug: "sdks", title: "SDKs", group: "Developer", body: ["Official SDKs for JavaScript, Python, PHP, and Go."] },
  { slug: "security", title: "Security", group: "Compliance", body: ["We follow SOC 2 Type II controls and ISO 27001 practices."] },
  { slug: "backups", title: "Backups & recovery", group: "Compliance", body: ["Daily encrypted backups with 30-day retention."] },
];

export const resources = [
  { title: "The Software House Operating Manual", type: "Whitepaper", desc: "How top agencies structure their operations." },
  { title: "AI ROI Calculator", type: "Template", desc: "Estimate the ROI of automating your workflows." },
  { title: "Cloud Migration Playbook", type: "E-book", desc: "A step-by-step guide to moving legacy systems to cloud." },
  { title: "REST API Design Guide", type: "Guide", desc: "Principles for building APIs teams love to use." },
  { title: "Product Discovery Kit", type: "Template", desc: "Interview scripts, personas and JTBD templates." },
  { title: "Security Compliance Checklist", type: "Guide", desc: "SOC 2 and ISO 27001 readiness in 30 days." },
];

export const downloads = [
  { name: "Company Profile 2026", format: "PDF", size: "3.2 MB" },
  { name: "The Knower Brochure", format: "PDF", size: "5.8 MB" },
  { name: "Portfolio 2026", format: "PDF", size: "12.4 MB" },
  { name: "Product Catalog", format: "PDF", size: "4.1 MB" },
  { name: "Brand Assets", format: "ZIP", size: "22.7 MB" },
];

export const events: Event[] = [
  { slug: "gitex-2026", title: "GITEX Global 2026", date: "2026-10-14", location: "Dubai World Trade Centre", type: "Conference", summary: "Visit us at Hall 7, booth C-42 for live demos of The Knower AI." },
  { slug: "leap-2026", title: "LEAP 2026", date: "2026-03-04", location: "Riyadh", type: "Conference", summary: "Our CTO keynotes on AI in enterprise operations." },
  { slug: "webinar-ai-ops", title: "Webinar: AI in operations", date: "2026-08-22", location: "Online", type: "Webinar", summary: "60-minute session with live Q&A." },
  { slug: "knower-summit", title: "The Knower Customer Summit", date: "2026-11-05", location: "Cairo", type: "Summit", summary: "Our annual customer-only gathering." },
];

export const press: PressItem[] = [
  { slug: "series-b", title: "The Knower raises $40M Series B", source: "TechCrunch", date: "2026-06-01", excerpt: "Funding will accelerate global expansion and AI investment." },
  { slug: "gartner-cool-vendor", title: "Named Gartner Cool Vendor 2026", source: "Gartner", date: "2026-05-12", excerpt: "Recognized in enterprise operations software." },
  { slug: "microsoft-partner", title: "Awarded Microsoft Gold Partner", source: "Microsoft News", date: "2026-04-08", excerpt: "For excellence in cloud solution delivery." },
];

export const faqs: FaqItem[] = [
  { group: "General", q: "What does The Knower do?", a: "We build custom software and ship a suite of products (CRM, ERP, HR, POS, AI, CMS) for growing businesses." },
  { group: "General", q: "Where are you based?", a: "Our HQ is in Riyadh with delivery hubs in Dubai, Cairo, and remote engineers across three continents." },
  { group: "General", q: "Do you work with startups?", a: "Yes — we work with everything from pre-seed startups to global enterprises." },
  { group: "Pricing", q: "How is pricing structured?", a: "Products are per-seat monthly or yearly. Services are fixed-fee or T&M depending on scope." },
  { group: "Pricing", q: "Do you offer discounts?", a: "Yes — 20% off for annual plans, plus non-profit and startup discounts." },
  { group: "Pricing", q: "Can I cancel anytime?", a: "Yes, monthly plans cancel anytime. Yearly plans renew at the end of term." },
  { group: "Support", q: "What are your support hours?", a: "Business plans get business-hour support. Professional and Enterprise get 24/7." },
  { group: "Support", q: "Do you offer SLAs?", a: "Yes, from 99.9% on Business to 99.99% with 1-hour response on Enterprise." },
  { group: "Security", q: "Is my data secure?", a: "We're SOC 2 Type II audited and follow ISO 27001 controls. Data is encrypted at rest and in transit." },
  { group: "Security", q: "Where is data hosted?", a: "You choose your region: EU, US, GCC, or on-premise for Enterprise." },
];

export const branches = [
  { city: " Alexandria", country: "Egypt", address: "Borj Al Arab, Alexandria", phone: "+20 2 0000 0000", email: "[EMAIL_ADDRESS]" },
];

export const systemStatus = [
  { service: "API", status: "operational", uptime: "99.99%" },
  { service: "Web app", status: "operational", uptime: "99.98%" },
  { service: "AI Gateway", status: "operational", uptime: "99.95%" },
  { service: "Hosting (EU)", status: "operational", uptime: "99.99%" },
  { service: "Hosting (US)", status: "operational", uptime: "99.99%" },
  { service: "Hosting (GCC)", status: "operational", uptime: "99.97%" },
  { service: "Email delivery", status: "operational", uptime: "99.96%" },
  { service: "Payments", status: "operational", uptime: "99.99%" },
];
