const fs = require("fs");
const C = require("./lib/chrome.js");

const SVC = [
  {
    slug: "local-seo",
    lower: "local SEO",
    name: "Local SEO",
    title: "Local SEO Atlanta | Google Maps &amp; Map Pack SEO Services",
    desc: "Local SEO Atlanta services: Google Business Profile optimization, Google Maps SEO, map pack rankings, local citations and reviews. Local SEO for small business.",
    h1: ['Local SEO Atlanta that puts you in the ', '<span class="blue">map pack</span>'],
    sub: "Three results sit above everything else when someone searches “near me” in Atlanta. We do the work that gets you into them — and keeps you there.",
    intro: [
      "We are a local SEO company in Atlanta, and the whole job comes down to one thing: being one of the three businesses Google shows on the map. Everything below is how that is actually done.",
      "Most local searches never reach a classic blue link. Someone types “emergency plumber Buckhead,” Google shows a map with three businesses, and that is where the calls go. If you are not in those three, a first-page organic ranking is worth far less than it looks.",
      "Local SEO is a different discipline from national SEO. It runs on proximity, prominence and relevance — signals you influence through your Google Business Profile, the consistency of your name/address/phone across the web, the depth of your location pages, and the volume and recency of genuine reviews. We work all four, in that order of leverage."
    ],
    feats: [
      ["📍", "Google Business Profile overhaul", "Categories, services, attributes, service areas, products, hours and Q&amp;A — filled in completely and correctly, then kept current."],
      ["🗺️", "Map pack ranking strategy", "Grid-based rank tracking across Atlanta neighbourhoods so you can see exactly where your radius of visibility ends."],
      ["🏷️", "Citation cleanup &amp; building", "One canonical NAP, pushed consistently to the aggregators and directories that Google actually reads."],
      ["⭐", "Review engine", "A request flow that asks the right customers at the right moment, plus response templates that read like a human wrote them."],
      ["📄", "Location &amp; service-area pages", "Genuinely distinct pages per neighbourhood or service — not one template with the city name swapped out."],
      ["🧩", "LocalBusiness schema", "Structured data that tells Google precisely what you do, where, when and for whom."]
    ],
    steps: [
      ["Audit &amp; baseline", "We map your current visibility on a geographic grid, pull your citation footprint, and benchmark the businesses already ranking where you want to be."],
      ["Fix the foundation", "Profile, NAP consistency, schema and on-site location pages. This is where most of the movement comes from, and it is usually the part nobody has done properly."],
      ["Compound", "Reviews, local content, and links from Atlanta-relevant sources. Local rankings are a flywheel — the first three months build the wheel, the rest keep it spinning."]
    ],
    forWho: [
      "Multi-location businesses whose branch pages all read the same",
      "Service-area businesses with no storefront to anchor to",
      "Practices, trades and restaurants competing on “near me” intent",
      "Anyone ranking on page one organically but invisible in the map"
    ],
    faqs: [
      ["How long does it take to rank in the Atlanta map pack?", "Profile and citation fixes can move rankings within weeks because they correct data Google already has. Competitive categories in dense areas like Midtown or Buckhead usually take three to six months of sustained review and content work. We give you a grid snapshot every month so you can see the radius growing rather than guessing."],
      ["Do I need a physical address in Atlanta to rank locally?", "You need a real address Google can verify, but service-area businesses can hide it and still rank across a defined radius. What you cannot do is rent a mailbox and expect it to hold — Google actively removes listings at virtual offices and coworking addresses."],
      ["Will you write fake reviews?", "No. We build a system that asks real customers at the moment they are happiest, which is what actually moves review velocity. Review gating and paid reviews violate Google's policies and get listings suspended."],
      ["What is the difference between local SEO and regular SEO?", "Regular SEO competes on relevance and authority. Local SEO adds proximity — how close the searcher is to you — which you cannot change, so you compensate with prominence and relevance signals. The tactics, tools and success metrics are different enough that treating them as one project is why most local campaigns underperform."],
      ["Can you help if my listing was suspended?", "Yes. Suspensions usually trace back to an address issue, a category that does not match your actual business, or keyword stuffing in the business name. We diagnose the cause, fix it, and handle the reinstatement appeal."]
    ]
  },
  {
    slug: "ai-content",
    lower: "AI content",
    name: "AI Content Engine",
    title: "SEO Content Writing Atlanta | AI Content &amp; Copywriting",
    desc: "SEO content writing services in Atlanta: topic clusters, SEO copywriting, website content and AI content creation — every page edited and fact-checked by a person.",
    h1: ['SEO content writing in Atlanta, ', '<span class="blue">edited by people</span>'],
    sub: "AI writes fast and knows nothing about your business. We use it for the parts it is good at — research, structure, first drafts — and put an editor on everything that reaches your site.",
    intro: [
      "SEO content writing in Atlanta has a credibility problem, and AI made it worse. Here is how we use the technology without producing the thing everyone now recognises and skips.",
      "The failure mode of AI content is not that it reads badly. It is that it reads plausibly while being generic, unsourced and indistinguishable from what your competitors published the same week. Search engines have gotten good at spotting that, and so have readers.",
      "Our process treats AI as a research and drafting accelerant inside a human editorial pipeline. Every piece starts from a keyword and intent brief built on real SERP data, gets drafted with a model, then goes through a human pass for accuracy, specificity, first-hand detail and voice. What ships has something in it that only your business could have said."
    ],
    feats: [
      ["🕸️", "Topic cluster mapping", "A pillar-and-cluster architecture built from real search demand, so pages support each other instead of competing."],
      ["📝", "Data-backed briefs", "Every brief carries the target intent, the questions the SERP is actually answering, entities to cover, and internal links to earn."],
      ["⚡", "Accelerated drafting", "Models handle the structural first draft. This is the step that turns a six-week content calendar into a two-week one."],
      ["🔍", "Human edit &amp; fact pass", "An editor removes hedging, adds specifics, checks every claim, and makes it sound like you rather than like a model."],
      ["🔗", "Internal linking", "New pages get wired into the existing site on publish, which is the cheapest ranking lift most sites are leaving on the table."],
      ["♻️", "Refresh cycles", "Existing pages that have slipped get updated on a schedule. Refreshing usually beats publishing for near-term traffic."]
    ],
    steps: [
      ["Map the demand", "Keyword research, SERP analysis and a gap check against competitors produces a ranked backlog — not a list of ideas, a list of pages with expected value attached."],
      ["Brief, draft, edit", "Each page runs the full pipeline. Nothing publishes on a model's word alone; an editor signs off on accuracy and voice before it goes live."],
      ["Measure and refresh", "We track each page against its target query, and pages that stall get reworked rather than abandoned."]
    ],
    forWho: [
      "Sites publishing nothing because the process is too slow",
      "Sites publishing plenty that ranks for nothing",
      "Teams with subject-matter expertise but no writing bandwidth",
      "Anyone who tried pure AI content and watched it flatline"
    ],
    faqs: [
      ["Does Google penalise AI-generated content?", "Google's guidance targets content produced primarily to manipulate rankings, regardless of how it was made. AI assistance is not itself a violation. What gets penalised is thin, unoriginal, unhelpful content — which is what unedited AI output tends to be, and which is exactly what the editing pass exists to prevent."],
      ["Who actually writes the content?", "A model produces a structured first draft from a human-built brief. A human editor then rewrites, adds first-hand specifics, verifies claims and adjusts voice. The published page is a human-edited document, and we will tell you plainly which parts of the process are automated."],
      ["How much content do I need?", "Fewer, better pages nearly always beat volume. A typical engagement produces four to eight substantial pages a month plus refreshes of existing ones. If someone is quoting you fifty posts a month, ask what they expect any single one to rank for."],
      ["Will it sound like my business?", "That is what the brief and the edit are for. We start from your existing material, your customers' actual language, and interviews with whoever knows the subject best. If a draft could have been written about any company in your category, it does not ship."],
      ["Can you work with my in-house writers?", "Yes, and it is often the best setup. We handle research, briefs and the SEO architecture; your team supplies the expertise and voice. We can run the whole pipeline or just the parts you are missing."]
    ]
  },
  {
    slug: "technical-seo",
    lower: "technical SEO",
    name: "Technical SEO",
    title: "Technical SEO Atlanta | SEO Audit, Core Web Vitals &amp; Schema",
    desc: "Technical SEO services in Atlanta: technical SEO audits, Core Web Vitals and site speed optimization, schema markup, indexing and website migration SEO.",
    h1: ['Technical SEO in Atlanta for the problems ', '<span class="blue">you cannot see</span>'],
    sub: "Great content on a site Google struggles to crawl, render or index is content nobody reads. Technical SEO removes the ceiling everything else is pressing against.",
    intro: [
      "Technical SEO in Atlanta is the least visible work we do and reliably the highest-leverage. It is the ceiling every other effort is pressing against.",
      "Technical SEO is unglamorous and it is usually where the biggest single wins are hiding. A canonical tag pointing at the wrong URL, a robots rule blocking a template, a JavaScript route that renders empty to a crawler — any one of these can quietly suppress an entire section of a site while every report looks normal.",
      "We audit against what search engines actually do: crawl, render, index, rank. Then we fix in order of impact, and we hand your developers specific, implementable tickets rather than a 90-page PDF that nobody opens twice."
    ],
    feats: [
      ["🕷️", "Crawl &amp; index audit", "Full crawl against log files and Search Console: what gets requested, what gets indexed, and everything falling into the gap."],
      ["⚡", "Core Web Vitals", "LCP, CLS and INP diagnosed to the specific element and script causing them, with fixes ranked by effort against effect."],
      ["🧭", "Site architecture", "URL structure, internal link depth and pagination reworked so authority reaches the pages that need it."],
      ["⚙️", "JavaScript rendering", "What a crawler sees after render versus what a browser sees — the most common cause of pages that mysteriously will not index."],
      ["🧩", "Structured data", "Valid, non-spammy schema for the entity types your pages actually represent, monitored for the errors Google reports later."],
      ["🔁", "Redirects &amp; migrations", "Redirect map design and post-launch monitoring for replatforms, so a site move does not cost you a year of rankings."]
    ],
    steps: [
      ["Diagnose", "Crawl, render check, log analysis, Search Console and field CWV data. We separate the things that are broken from the things that are merely untidy."],
      ["Prioritise", "Every issue gets an impact-versus-effort score and a written ticket. You always know why an item is above another one on the list."],
      ["Fix and verify", "We implement directly or work alongside your developers, then confirm each fix in the index rather than declaring victory at deploy."]
    ],
    forWho: [
      "Sites where traffic dropped with no content or link change",
      "Large catalogues where most pages have never been indexed",
      "JavaScript frameworks with rendering problems",
      "Anyone planning a replatform or domain migration"
    ],
    faqs: [
      ["What is INP and why does it matter now?", "Interaction to Next Paint replaced First Input Delay as a Core Web Vitals metric in March 2024. It measures how long the page takes to visually respond to a click or tap across the whole visit, not just the first interaction — so heavy JavaScript that was invisible under FID now shows up clearly."],
      ["How long does a technical audit take?", "Two to three weeks for the audit itself on most sites, longer for large catalogues where log analysis matters. Implementation depends on your development cycle; we usually ship the highest-impact fixes inside the first month."],
      ["Do you implement the fixes or just hand over a report?", "We implement wherever we have access, and write developer-ready tickets where we do not. A report you cannot act on is not a deliverable."],
      ["My pages are indexed. Do I still need technical SEO?", "Indexed is the floor, not the goal. The questions that follow are whether the right pages are indexed, whether crawl budget is being spent on them, whether they render completely, and whether the internal link graph sends authority anywhere useful. Those are usually where the ceiling is."],
      ["Will fixing Core Web Vitals improve my rankings?", "Directly, it is a modest signal and it will not rescue weak content. Indirectly, it moves conversion and engagement, and it removes an excuse Google has to prefer a competitor when everything else is close. We treat it as a tiebreaker worth winning, not a silver bullet."]
    ]
  },
  {
    slug: "answer-engine-optimization",
    lower: "answer engine optimization",
    name: "Answer Engine Optimization",
    title: "Answer Engine Optimization Atlanta | AEO &amp; GEO Services",
    desc: "Answer engine optimization in Atlanta — AEO and GEO services that get you cited by AI Overviews, ChatGPT, Perplexity and Gemini. AI search optimization and LLM SEO.",
    h1: ['Answer engine optimization for Atlanta brands ', '<span class="blue">AI should be citing</span>'],
    sub: "A growing share of searches end in a generated answer instead of a click. AEO is the work of being the source that answer is built from.",
    intro: [
      "Answer engine optimization — AEO, and the generative engine optimization or GEO you will see it called elsewhere — is the work of being the source an AI names when it answers your customer\u2019s question.",
      "AI Overviews, ChatGPT, Perplexity, Gemini and Copilot all answer questions by retrieving passages from pages and synthesising them. That changes what winning looks like. The prize is no longer only a ranking position — it is being the source cited inside the answer, with your name attached.",
      "The mechanics reward different things than classic SEO. Retrieval works at the passage level, so a self-contained, clearly-scoped answer near the top of a section beats a brilliant argument buried on page four of a guide. Machines also need to be able to reach you: if your robots rules block AI crawlers, you are opted out of the entire channel without knowing it."
    ],
    feats: [
      ["🤖", "AI crawler access audit", "Whether GPTBot, ClaudeBot, PerplexityBot, Google-Extended and the rest can reach your content — and a deliberate decision about each."],
      ["💬", "Passage-level rewriting", "Answers restructured so a single retrievable chunk fully answers one question without needing surrounding context."],
      ["📊", "Citation monitoring", "Tracking where you are cited across AI answer engines for the prompts your buyers actually type."],
      ["🏛️", "Entity &amp; brand signals", "Consistent, corroborated facts about your business across the web, so models have something stable to attach your name to."],
      ["🧾", "llms.txt &amp; machine docs", "A clean, machine-readable summary of what you do and where the authoritative pages live."],
      ["❓", "Question coverage", "Systematic mapping of the questions in your category, and a page or section that owns each one."]
    ],
    steps: [
      ["Measure the baseline", "We prompt the major answer engines with your real buyer questions and record who gets cited today. Usually it is a competitor, a directory, or Reddit."],
      ["Make the content retrievable", "Restructure for passage retrieval, add the schema that clarifies entities, and open up crawler access where you want the visibility."],
      ["Build the corroboration", "Models trust facts that appear consistently in multiple independent places. That is a mentions-and-citations problem, and it is slower than on-page work."]
    ],
    forWho: [
      "Businesses watching informational traffic fall while rankings hold",
      "Categories where buyers research through ChatGPT before Google",
      "Anyone whose competitors keep appearing in AI Overviews",
      "Brands with strong expertise that machines cannot currently see"
    ],
    faqs: [
      ["Is AEO different from SEO?", "It overlaps heavily and then diverges. Both need crawlable, credible, well-structured content. AEO adds passage-level formatting, explicit entity signals, machine crawler access, and a success metric — citation share — that no rank tracker measures. Treat it as a specialism inside SEO, not a replacement for it."],
      ["Should I block AI crawlers or allow them?", "It is a genuine trade-off and it depends on your model. Publishers monetising pageviews often block. Businesses whose content is marketing for a service almost always want to be cited. What you should not do is leave it to chance in a robots.txt nobody has read in two years."],
      ["What is llms.txt?", "A proposed plain-text file at your site root that gives language models a clean, structured summary of your site and links to the pages worth reading. Adoption is early and no major engine guarantees it is used, so we treat it as cheap insurance rather than a ranking factor."],
      ["How do I know if AI search is sending me anything?", "Referral traffic from ChatGPT, Perplexity and Copilot appears in analytics under their own domains, and it is usually low-volume but high-intent. AI Overview impressions are harder — they fold into ordinary Search Console data, so the honest read comes from tracking citations directly by prompting the engines."],
      ["Does schema markup help me get cited?", "It helps machines resolve what your page is about and which entity it belongs to, which improves retrieval and eligibility for rich results. It is not a citation switch. Clear, self-contained, verifiable prose does more of the work than markup does."]
    ]
  },
  {
    slug: "link-building",
    lower: "link building",
    name: "Link Building",
    title: "Link Building Atlanta | White Hat Backlinks &amp; Digital PR",
    desc: "Link building services in Atlanta: white hat backlinks, digital PR, local link building, unlinked mention reclamation and toxic backlink audits. No PBNs, no paid links.",
    h1: ['Link building in Atlanta you would be ', '<span class="blue">happy to explain</span>'],
    sub: "Authority is still the hardest ranking factor to fake and the most durable one to earn. We build it in ways that survive an algorithm update and an audit.",
    intro: [
      "Link building in Atlanta is where SEO budgets go to die, usually because someone bought the cheap version. Authority is still the hardest ranking factor to fake and the most durable one to earn.",
      "Cheap links are cheap because they do not work for long. Private blog networks, paid placements on sites that exist only to sell placements, and mass guest-post outreach all leave the same footprint, and that footprint is what gets devalued in updates.",
      "Real link building is slower and closer to public relations than to SEO. It means creating something worth referencing, then getting it in front of people with a reason to reference it — journalists, local organisations, industry publications, partners and suppliers. We do that, and we show you every link we earn."
    ],
    feats: [
      ["📰", "Digital PR", "Data, surveys and commentary built to give reporters something they can actually use, pitched to relevant beats."],
      ["🤝", "Local partnerships", "Atlanta chambers, associations, sponsorships, universities and community organisations — the links national competitors cannot copy."],
      ["🔎", "Unlinked mention reclamation", "Places already talking about you without linking. The fastest wins in the programme, and the ones most agencies skip."],
      ["📚", "Resource &amp; citation placements", "Genuinely useful assets placed on pages that curate resources for your audience."],
      ["🧹", "Toxic backlink review", "An audit of what is already pointing at you, and a disavow only where there is a real reason for one."],
      ["📈", "Transparent reporting", "Every live link, its source, its context and its authority. No “placements delivered” with no URLs."]
    ],
    steps: [
      ["Audit and target", "We map your link gap against the sites ranking above you, then build a target list of domains that would plausibly link to a business like yours."],
      ["Build the reason", "Outreach without an asset is spam. We create the study, tool, guide or story that gives someone a reason to link."],
      ["Earn and report", "Pitching, follow-up, placement — and a monthly list of exactly what landed, so you can judge quality yourself."]
    ],
    forWho: [
      "Sites with strong content that will not crack page one",
      "Businesses whose competitors have visibly stronger backlink profiles",
      "Anyone recovering from a cheap link-building campaign",
      "Local businesses competing with national aggregators"
    ],
    faqs: [
      ["Do you buy links?", "No. Paid links that pass ranking signals violate Google's spam policies, and the risk sits with you rather than with the agency that sold them. We earn links through PR, partnerships and assets worth referencing."],
      ["How many links will I get per month?", "We do not sell link quotas, because a quota is exactly the incentive that produces bad links. A realistic programme earns a handful of genuinely relevant links a month, weighted toward quality. One link from a regional publication can outweigh fifty directory listings."],
      ["How long before links affect rankings?", "Individual links can register within weeks. The compounding effect on domain-level authority takes months, and it is not linear — you often see nothing for a quarter and then movement across many pages at once."],
      ["What about the links I already have?", "We audit them. Most sites carry some junk, and most of it is ignored rather than penalised, so a disavow is rarely the first answer. We only recommend one when there is a specific, identifiable problem."],
      ["Can you get me links from Atlanta sites specifically?", "That is one of the strongest plays available to a local business. Local sponsorships, chamber memberships, neighbourhood associations, event coverage and university partnerships produce links that are relevant, defensible and effectively impossible for an out-of-state competitor to replicate."]
    ]
  },
  {
    slug: "seo-reporting",
    lower: "reporting and analytics",
    name: "Reporting & Analytics",
    title: "SEO Reporting Services Atlanta | GA4, Analytics &amp; Attribution",
    desc: "SEO reporting and analytics services in Atlanta: GA4 setup, conversion tracking, call tracking, Looker Studio dashboards and marketing attribution tied to revenue.",
    h1: ['SEO reporting services in Atlanta that answer ', '<span class="blue">“did it make money?”</span>'],
    sub: "Impressions are not revenue. We instrument the whole path — search to session to lead to close — so every SEO decision has a number behind it.",
    intro: [
      "SEO reporting services exist because rankings are not revenue. We instrument the whole path \u2014 search to session to lead to closed deal \u2014 so every decision has a number behind it.",
      "Most SEO reports measure the things that are easy to measure. Rankings went up, impressions went up, here is a chart. None of it answers the only question that matters at renewal time, which is whether the work produced customers.",
      "We start by fixing measurement, because almost every account we inherit has broken or missing conversion tracking. Then we build a dashboard that runs from query through to closed revenue, and we write a monthly review in plain English that says what happened, what we think caused it, and what we are doing next."
    ],
    feats: [
      ["📐", "GA4 &amp; tracking setup", "Events, conversions and consent configured properly — including the ones that silently stopped working after a site change."],
      ["📞", "Call &amp; form attribution", "Dynamic number insertion and form capture, so phone-driven businesses stop being invisible in their own analytics."],
      ["📊", "Live dashboards", "Search Console, GA4, rank tracking and your CRM in one view, updated continuously rather than assembled monthly."],
      ["🎯", "Keyword-to-revenue mapping", "Which queries produce leads that close, not just clicks. This is what changes where the content budget goes."],
      ["🔔", "Anomaly alerts", "Traffic drops, indexation changes and Core Web Vitals regressions surface within days, not at the next monthly call."],
      ["🗒️", "Plain-English reviews", "A monthly written analysis with a recommendation attached. No 40-slide deck of screenshots."]
    ],
    steps: [
      ["Fix measurement", "A tracking audit first. There is no point reporting on numbers we cannot trust, and we usually find at least one conversion that has been broken for months."],
      ["Connect the sources", "Search Console, GA4, rank data, call tracking and CRM outcomes joined into a single dashboard you can open any day of the week."],
      ["Review and decide", "Monthly analysis focused on decisions: what to double down on, what to stop, and what we need from you to unblock the next thing."]
    ],
    forWho: [
      "Anyone who cannot say what SEO earned them last quarter",
      "Phone-heavy businesses with no call attribution",
      "Teams inheriting an account with unknown tracking history",
      "Marketers who need to defend a budget with real numbers"
    ],
    faqs: [
      ["What do you actually report on?", "Organic sessions and conversions by landing page, keyword-level visibility for tracked terms, map pack position where local matters, leads and calls attributed to organic, and revenue where your CRM exposes it. Plus what we did, what it cost, and what we recommend next."],
      ["How often will I hear from you?", "Dashboards are live and yours to open any time. A written review lands monthly, and anything urgent — a traffic drop, an indexation problem — reaches you the week it happens rather than waiting for the report."],
      ["Do I own the data and the accounts?", "Yes, always. GA4, Search Console, tag manager, call tracking and the dashboard are set up under your ownership. If you leave, you keep everything, including the historical data."],
      ["Can you fix our existing GA4 setup?", "It is usually the first thing we do. Broken GA4 migrations, conversions that count page views, duplicate tags and missing consent configuration are close to universal, and every one of them makes the rest of the reporting untrustworthy."],
      ["How do you attribute a phone call to SEO?", "Dynamic number insertion swaps the displayed phone number based on the visitor's source, so a call from an organic session is recorded as one. It pairs with form and chat tracking to give a complete picture for businesses where most conversions never touch a submit button."]
    ]
  }
];

const ALT = {
  "local-seo": "Map of Atlanta with a business ranking first in the local three-pack",
  "ai-content": "A page moving through a brief, a machine draft and a human edit",
  "technical-seo": "A site crawl tree beside Core Web Vitals and index coverage",
  "answer-engine-optimization": "An AI answer citing the site, with AI crawler access enabled",
  "link-building": "A network of referring domains linking to a central site",
  "seo-reporting": "A dashboard tying organic sessions through to pipeline value"
};
/* Secondary-keyword placement: section headings and extra FAQ questions, one
   block per page. Long-tail terms belong in questions people actually ask, so
   they land in the FAQ (which is also what feeds FAQPage schema) rather than
   being sprinkled through body copy. */
const SEO = {
  "local-seo": {
    introHead: "One job: be one of the three businesses Google shows on the map",
    tail: "We work as a local SEO agency for businesses that want the whole programme run, and as a local SEO expert on call for teams that only need the strategy. Either way the local search marketing plan is written for your radius, not a template.",
    h2Included: "What's included in our Atlanta local SEO services",
    h2Process: "How our local SEO company in Atlanta works",
    h2ForWho: "Local SEO for small business in Atlanta",
    h2Faq: "Local SEO Atlanta: frequently asked questions",
    faqs: [
      ["How much do local SEO services in Atlanta cost?", "Local SEO engagements start at $1,500 a month and scale with how competitive your category and radius are. A single-location service business in a quiet category costs less than a multi-location practice competing across Buckhead, Midtown and Sandy Springs at once. The free review tells you which one you are before you commit to anything."],
      ["What does a local SEO consultant in Atlanta actually do?", "Audits your Google Business Profile and citation footprint, corrects the data Google already holds about you, builds location pages that are genuinely distinct, sets up a review request flow, then earns local links and mentions. The first two usually produce the earliest movement because they are fixing errors rather than building something new."],
      ["How do I choose the best local SEO company in Atlanta?", "Ask for grid-based rank tracking rather than a single rank number, ask what they will do in the first 30 days, and ask them to name something they would refuse to do. Anyone promising a specific map pack position on a fixed timeline is guessing — proximity is a ranking factor nobody controls."],
      ["Do you offer Google Business Profile management in Atlanta?", "Yes. Profile optimization and ongoing management are part of every local SEO engagement — categories, services, products, attributes, hours, photos, posts and Q&A, kept current rather than filled in once and forgotten."],
      ["Can you help with Google Maps SEO specifically?", "Google Maps ranking and map pack ranking are the same problem: relevance, distance and prominence. We work all three levers you can actually influence, and report on a geographic grid so you can see the radius where you win rather than a single averaged number."]
    ]
  },
  "ai-content": {
    introHead: "Content that ranks is edited, not just generated",
    tail: "SEO content creation services here cover the full pipeline — research, brief, draft, edit — and an in-house SEO copywriter can plug into any part of it rather than the whole thing.",
    h2Included: "What's included in our Atlanta SEO content services",
    h2Process: "How our SEO content agency works",
    h2ForWho: "Who our SEO copywriting services suit",
    h2Faq: "SEO content writing in Atlanta: frequently asked questions",
    faqs: [
      ["What do SEO content writing services in Atlanta cost?", "Content engagements start at $1,500 a month, which typically covers four to eight substantial pages plus refreshes of existing ones. Cost tracks research depth and subject complexity far more than word count — a technical piece needing an expert interview costs more than a straightforward service page."],
      ["Do you offer SEO copywriting as well as blog content?", "Yes. Service pages, landing pages, location pages and homepage copy are often higher-value work than blog posts, because they sit closer to the transaction. Most engagements do both: conversion copy for the money pages, and supporting content that earns the visibility."],
      ["Can you act as our content marketing agency rather than just a writer?", "Yes. That means owning the strategy — topic clusters, the publishing calendar, internal linking, refresh cycles and measurement — not just filling a brief. If you already have writers, we can run the strategy and briefs and leave the drafting with your team."],
      ["Will AI content writing hurt my rankings?", "Unedited model output usually does, because it is thin and unoriginal — which is what search engines act on, not the tool that produced it. Our process uses AI for research and first drafts inside a human editorial pipeline; every page gets a fact pass and a voice pass before it ships."]
    ]
  },
  "technical-seo": {
    introHead: "The rankings ceiling is usually technical",
    tail: "We work as a technical SEO agency when you want the fixes shipped, and as a technical SEO expert alongside your developers when you do not. Indexing SEO services — getting the right pages into the index and the wrong ones out — are part of both.",
    h2Included: "What's included in our Atlanta technical SEO services",
    h2Process: "How a technical SEO audit in Atlanta runs",
    h2ForWho: "When you need a technical SEO consultant",
    h2Faq: "Technical SEO in Atlanta: frequently asked questions",
    faqs: [
      ["What does a technical SEO audit in Atlanta include?", "A full crawl checked against your log files and Search Console, a render comparison, Core Web Vitals from field data, an internal link and architecture review, and a structured data validation pass. You get every issue scored on impact against effort, written as tickets your developers can pick up."],
      ["Do you offer schema markup and structured data services?", "Yes. We implement and validate schema for the entity types your pages actually represent, and monitor for the errors Google reports weeks later. We do not add markup for things a page is not, which is the fastest way to lose rich result eligibility."],
      ["Can you handle an SEO website migration?", "Yes. Migration work means redirect map design before launch, not a rescue afterwards. We map every URL, define the redirect rules, test them on staging, then monitor indexation and rankings daily through the first weeks post-launch."],
      ["Do you work on enterprise technical SEO?", "Yes. Large catalogues are where technical work pays most, because crawl budget and template-level issues multiply across thousands of URLs. Log file analysis matters much more at that scale, and it is part of the audit rather than an add-on."],
      ["How much do site speed and Core Web Vitals optimization cost?", "It depends entirely on what is slow. A render-blocking script or unsized images is a day of work; a heavy JavaScript framework rebuilding on every interaction is a project. The audit tells you which you have before anyone quotes you."]
    ]
  },
  "answer-engine-optimization": {
    introHead: "Search is being answered, not just listed",
    tail: "As an AEO agency we run the whole programme; as an AI search agency on retainer we handle just the monitoring and the passage work. Either way, what you are buying from a generative AI SEO agency is citation share, and we will show you the baseline before you commit.",
    h2Included: "What's included in our Atlanta AEO services",
    h2Process: "How answer engine optimization works",
    h2ForWho: "Who needs AI search optimization",
    h2Faq: "Answer engine optimization in Atlanta: frequently asked questions",
    faqs: [
      ["Is generative engine optimization (GEO) the same as answer engine optimization?", "In practice the terms are used interchangeably, and AEO, GEO and LLM SEO all describe the same work: making your content retrievable, credible and corroborated enough that an AI system cites it. We use AEO because the goal is being the answer, whichever engine generates it."],
      ["Do you offer ChatGPT SEO services?", "Yes, as part of AEO. It means making sure OpenAI's crawlers can reach you, structuring passages so they answer a question on their own, clarifying your entity so a model can resolve who you are, and then tracking whether you actually get cited for the prompts your buyers use."],
      ["What is LLM SEO?", "Optimising for how large language models retrieve and cite sources rather than how a search engine ranks pages. The unit is the passage, not the page, and the metric is citation share, not position. It overlaps heavily with good SEO and then diverges on formatting, entity clarity and crawler access."],
      ["How do you measure AI visibility?", "We build a prompt set from the questions your buyers actually ask, run it across the major answer engines on a schedule, and record which domains get cited and where you sit against competitors. The trend is the metric — these systems are non-deterministic, so any single run is noise."],
      ["How do I choose the best AEO agency in Atlanta?", "Ask to see a citation baseline before you sign — the prompts they would track, and who gets cited for them today. Any agency that cannot show you where you currently stand is not measuring the channel, and an AEO programme you cannot measure is indistinguishable from doing nothing."],
      ["Can you get us into Google AI Overviews?", "Nobody can guarantee it, and treat anyone who does with suspicion. AI Overviews are built from Google's ordinary index, so the work is making your passages the most citable answer available: self-contained, specific, verifiable, and corroborated elsewhere on the web."]
    ]
  },
  "link-building": {
    introHead: "Authority is the hardest ranking factor to fake",
    tail: "Choosing the best link building agency comes down to one question: can they show you every live link and its context? Ours are listed in full every month, with the source and the reason it was earned.",
    h2Included: "What's included in our Atlanta link building services",
    h2Process: "How our link building agency works",
    h2ForWho: "When you need backlink services",
    h2Faq: "Link building in Atlanta: frequently asked questions",
    faqs: [
      ["What do link building services in Atlanta cost?", "Link programmes start at $1,500 a month. That funds the asset creation and outreach, not a quota of placements — which is deliberate, because paying per link is exactly the incentive that produces links you would rather not explain."],
      ["Do you offer digital PR as well as link building?", "Digital PR is most of how we earn links. Data, surveys, local stories and expert commentary give journalists something usable, and the coverage brings links that a direct outreach email never will."],
      ["Can you run a toxic backlink audit?", "Yes. We review everything pointing at your domain and tell you plainly what is junk. Most junk links are simply ignored by Google rather than penalised, so a disavow is rarely the first answer — we only recommend one when there is a specific, identifiable problem."],
      ["What is white hat link building?", "Earning links because something is worth referencing, rather than buying or manufacturing them. No private blog networks, no paid placements that pass ranking signals, no link exchanges at scale. The test we apply: would you be comfortable showing this link to Google and to your customers?"]
    ]
  },
  "seo-reporting": {
    introHead: "Reporting should answer one question: did it make money?",
    tail: "SEO performance reporting is the deliverable; Google Analytics consulting, GA4 consultant work and broader digital analytics consulting are how we get the numbers trustworthy enough to report on in the first place.",
    h2Included: "What's included in our Atlanta SEO reporting services",
    h2Process: "How our SEO analytics agency works",
    h2ForWho: "When you need SEO analytics services",
    h2Faq: "SEO reporting in Atlanta: frequently asked questions",
    faqs: [
      ["Do you offer GA4 setup services in Atlanta?", "Yes, and it is usually the first thing we do. Broken GA4 migrations, conversions that count page views, duplicate tags and missing consent configuration are close to universal, and every one of them makes the rest of your reporting untrustworthy."],
      ["Can you build a Looker Studio dashboard?", "Yes. Search Console, GA4, rank tracking, call tracking and your CRM joined into one live view you can open any day rather than a deck assembled monthly. It is built under your ownership, so it stays yours."],
      ["Do you offer call tracking services?", "Yes. Dynamic number insertion swaps the displayed number based on the visitor's source, so a call from an organic session is recorded as one. For phone-heavy businesses this is the difference between SEO looking like it does nothing and seeing what it actually produces."],
      ["What is marketing attribution and do I need it?", "Attribution connects a closed deal back to the channel that started it. You need it the moment you are spending on more than one channel, because otherwise budget decisions come down to whoever tells the best story rather than what actually produced revenue."],
      ["Do we own the analytics accounts and data?", "Always. GA4, Search Console, tag manager, call tracking and the dashboard are all set up under your ownership. If you leave, you keep everything, including the historical data."]
    ]
  }
};

const REL = (slug) => SVC.filter((s) => s.slug !== slug).slice(0, 3);

SVC.forEach((s) => {
  const seo = SEO[s.slug];
  s.faqs = seo.faqs.concat(s.faqs);   /* keyword questions first — they are what people search */
  const url = `/services/${s.slug}`;
  const trail = [{ name: "Home", url: "/" }, { name: "Services", url: "/#services" }, { name: s.name, url }];
  const serviceNode = {
    "@type": "Service",
    "@id": C.SITE + url + "#service",
    name: s.name,
    serviceType: s.name,
    url: C.SITE + url,
    description: s.desc,
    provider: { "@id": C.SITE + "/#business" },
    areaServed: { "@type": "City", name: "Atlanta" }
  };

  const mapCard = `
      <div class="map-visual" aria-hidden="true">
        <div class="map-card">
          <div class="map-tag">MAP PACK · TOP 3</div>
          <div class="searchbar"><i></i>emergency plumber buckhead — near me</div>
          <div class="map-zone">
            <span class="road r1"></span><span class="road r2"></span><span class="road r3"></span>
            <span class="ring"></span><span class="ring g2"></span>
            <span class="pin p1"><svg viewBox="0 0 24 24"><path fill="#1B72F0" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.6" fill="#fff"/></svg></span>
            <span class="pin p2"><svg viewBox="0 0 24 24"><path fill="#8FB4E8" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.6" fill="#fff"/></svg></span>
            <span class="pin p3"><svg viewBox="0 0 24 24"><path fill="#8FB4E8" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.6" fill="#fff"/></svg></span>
          </div>
          ${[1,2,3].map((n) => `<div class="res ${n===1?"you ":""}k${n}">
            <span class="rank">${n}</span>
            <span class="bars"><span class="b long"></span><span class="b short"></span></span>
            <span class="stars">${"<svg viewBox=\"0 0 24 24\"><path d=\"M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.8 5.5 21l2-7.5L2 9h7z\"/></svg>".repeat(n===2?4:5)}</span>
          </div>`).join("")}
          <div class="coords">33.7490° N · 84.3880° W — ATLANTA, GA</div>
        </div>
      </div>`;

  const heroFigure = `
      <div class="hero-figure">
        <img src="/assets/img/svc-${s.slug}.svg" alt="${ALT[s.slug]}" width="1200" height="750" fetchpriority="high" decoding="async">
      </div>`;

  const heatGrid = `
      <div class="grid-wrap">
        <div class="rank-grid" id="svcHeat" aria-hidden="true">
          ${[[1,"g"],[1,"g"],[2,"g"],[3,"b"],[4,"b"],[7,""],[9,""],[1,"g"],[1,"g"],[1,"g"],[2,"g"],[3,"b"],[5,"b"],[8,""],[1,"g"],[1,"g"],[1,"g"],[1,"g"],[2,"g"],[4,"b"],[7,""],[2,"g"],[1,"g"],[1,"g"],[1,"g"],[2,"g"],[3,"b"],[6,""],[3,"b"],[2,"g"],[1,"g"],[2,"g"],[3,"b"],[5,"b"],[9,""],[6,""],[4,"b"],[3,"b"],[4,"b"],[6,""],[8,""],["10+",""]].map(([v,cls],i)=>`<div class="c ${cls}" style="--i:${i}">${v}</div>`).join("")}
        </div>
        <div class="legend rv"><span><i class="g"></i>Map pack</span><span><i class="b"></i>Close</span><span><i class="n"></i>Out of range</span></div>
      </div>`;

  const body = `
<div class="progress" id="svcProg"></div>
<div class="svcx">

<section class="hero dk">
  <div class="mesh"></div><div class="aura"></div>
  <div class="wrap">
    <div>
      <div class="crumb fade-up fu-0">${C.crumbHtml(trail).replace(/^<div class="crumb">/, "").replace(/<\/div>$/, "")}</div>
      <div class="eyebrow fade-up fu-0">${s.name} Atlanta</div>
      <h1 class="fade-up fu-1">${s.h1.join("")}</h1>
      <p class="sub fade-up fu-1">${s.sub}</p>
      <div class="cta-row fade-up fu-2">
        <a class="btn btn-primary" href="#start" data-cta="svc_hero_${s.slug}">Get a free ${s.lower} review <span class="arr">→</span></a>
        <a class="btn btn-ghost" href="/#audit" data-cta="svc_hero_audit_${s.slug}">Run the instant audit</a>
      </div>
    </div>
    ${s.slug === "local-seo" ? mapCard : heroFigure}
  </div>
</section>

<section>
  <div class="wrap intro-in">
    <h2 class="rv">${seo.introHead}</h2>
    <div class="intro-copy">
      ${s.intro.map((p, i) => `<p class="${i === 0 ? "first " : ""}rv${i ? " d" + i : ""}">${p}</p>`).join("\n      ")}
    </div>
  </div>
</section>

<section style="padding-top:20px">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow rv">The scope</div>
      <h2 class="sec rv">${seo.h2Included}</h2>
      <p class="rv d1">No tiers where the useful work sits behind the top one. This is the scope.</p>
    </div>
    <div class="cards">
      ${s.feats.map(([ic, h, p], i) => `<div class="card rv${i % 3 ? " d" + (i % 3) : ""}"><div class="ic">${ic}</div><h3>${h}</h3><p>${p}</p></div>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="dk">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow rv">The sequence</div>
      <h2 class="sec rv">${seo.h2Process}</h2>
      <p class="rv d1">The sequence matters. Doing phase three first is how budgets get burned.</p>
    </div>
    <div class="steps3" id="svcSteps">
      <div class="proc-line"><span class="fill"></span></div>
      ${s.steps.map(([h, p], i) => `<div class="step3 rv${i ? " d" + (i * 2) : ""}"><div class="sn">${i + 1}</div><h3>${h}</h3><p>${p}</p></div>`).join("\n      ")}
    </div>
    ${s.slug === "local-seo" ? heatGrid : ""}
  </div>
</section>

<section>
  <div class="wrap">
    <div class="who-in">
      <div>
        <div class="eyebrow rv">Who this is for</div>
        <h2 class="sec rv">${seo.h2ForWho}</h2>
        <ul class="fit">
          ${s.forWho.map((w, i) => `<li class="rv${i ? " d" + i : ""}"><span class="pinico"><svg viewBox="0 0 24 24"><path fill="#1B72F0" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.6" fill="#fff"/></svg></span>${w}</li>`).join("\n          ")}
        </ul>
      </div>
      <div class="who-copy">
        <p class="rv d1">${seo.tail}</p>
        <p class="rv d2">Not sure this is the right starting point? Tell us the problem and we will say so — including when the answer is a different service, or none of them yet.</p>
        <a class="textlink rv d3" href="#start" data-cta="svc_mid_${s.slug}">Ask us about your site <span class="arr">→</span></a>
      </div>
    </div>
    <div class="stats rv d1">
      <div class="stat"><div class="n">1</div><div class="t">Business day to a reply, every time</div></div>
      <div class="stat"><div class="n">0</div><div class="t">Long-term contracts required</div></div>
      <div class="stat"><div class="n">100%</div><div class="t">Account and data ownership stays yours</div></div>
      <div class="stat"><div class="n">Mo.</div><div class="t">Written review, in plain English</div></div>
    </div>
  </div>
</section>

<section style="background:var(--bg-2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
  <div class="wrap">
    <div class="sec-head" style="text-align:center;margin:0 auto 46px">
      <div class="eyebrow rv" style="justify-content:center">Straight answers</div>
      <h2 class="sec rv">${seo.h2Faq}</h2>
    </div>
    <div class="faq rv d1">
      ${s.faqs.map(([q, a], i) => `<details class="faq-item"><summary><span class="qn">${String(i + 1).padStart(2, "0")}</span>${q}<span class="ic"></span></summary><p class="faq-a">${a}</p></details>`).join("\n      ")}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow rv">Related services</div>
      <h2 class="sec rv">Works well alongside</h2>
    </div>
    <div class="cards">
      ${REL(s.slug).map((r, i) => `<a class="al-card rv${i ? " d" + i : ""}" href="/services/${r.slug}"><div class="al-art"><img src="/assets/img/card-${r.slug}.svg" alt="${ALT[r.slug]}" width="900" height="300" loading="lazy" decoding="async"></div><div class="al-body"><div class="num">0${i + 1}</div><h3>${r.name}</h3><p>${r.sub}</p><span class="textlink">Explore ${r.name} <span class="arr">→</span></span></div></a>`).join("\n      ")}
    </div>
  </div>
</section>

<div id="start"></div>
${C.formSection({
    id: `svc-${s.slug}`,
    name: `service-${s.slug}`,
    service: s.name,
    heading: `Let's look at your ${s.lower}`,
    sub: `Send us your site. We'll come back with what we'd actually do first — specific to your pages, not a template.`
  })}

</div>`;

  const html = C.page({
    url,
    title: s.title,
    desc: s.desc,
    active: url,
    graph: [serviceNode, C.breadcrumbs(trail), C.faqNode(url, s.faqs)],
    head: '<link rel="stylesheet" href="/assets/css/service.css">',
    bodyEnd: '<script src="/assets/js/service.js"></script>',
    body
  });
  fs.writeFileSync(`services/${s.slug}.html`, html);
  console.log("wrote services/" + s.slug + ".html");
});
