const fs = require("fs");
const C = require("./lib/chrome.js");

const AUTHOR = { name: "The SEO Atlanta GA team", role: "Search strategists, Atlanta GA", initials: "SA" };

const POSTS = [
  {
    slug: "seo-roi-what-ranking-first-is-worth",
    art: "post-seo-roi",
    artAlt: "Bar chart of click-through rate by search position, and the arithmetic turning it into monthly gross profit",
    cat: "Strategy",
    catKey: "strategy",
    date: "2026-02-11",
    dateText: "11 February 2026",
    read: "9 min read",
    title: "SEO ROI: What Ranking First Is Actually Worth",
    metaTitle: "SEO ROI: What Ranking First Is Actually Worth — SEO Atlanta GA",
    desc: "How to calculate the real revenue value of a ranking improvement — the click-through model, the assumptions that break it, and how to build a defensible SEO business case.",
    lede: "Everyone knows position one is worth more than position eight. Very few marketers can put a number on the gap — which is why SEO budgets are the first thing cut when someone asks what it returns.",
    takeaways: [
      "Rank value comes from three multiplied numbers: search volume, click-through rate at position, and the revenue per visitor behind it.",
      "Published CTR curves are directional averages, not facts about your SERP. Use your own Search Console data whenever you have it.",
      "The honest model subtracts your existing traffic — you are buying the delta between where you rank now and where you would rank.",
      "Payback period matters more than annual return, because it is what determines whether the programme survives long enough to work."
    ],
    toc: [
      ["the-formula", "The formula, in one line"],
      ["ctr", "Step one: click-through rate by position"],
      ["volume", "Step two: the volume that actually applies to you"],
      ["value", "Step three: what a visitor is worth"],
      ["delta", "Step four: subtract what you already have"],
      ["worked", "A worked example"],
      ["wrong", "Four ways this model goes wrong"],
      ["case", "Turning the number into a business case"]
    ],
    html: `
<h2 id="the-formula">The formula, in one line</h2>
<p>Strip away the dashboards and every SEO business case reduces to the same multiplication:</p>
<blockquote><b>Monthly value = monthly searches × (CTR at target position − CTR at current position) × conversion rate × value per conversion</b></blockquote>
<p>Four inputs. Each one is estimable, each one is arguable, and the credibility of your whole business case rests on how honestly you handle the arguable parts. Let's take them one at a time.</p>

<h2 id="ctr">Step one: click-through rate by position</h2>
<p>This is the number everyone quotes and almost nobody sources properly. Published click-through-rate curves — the ones showing position one taking roughly a third of clicks and position five taking a twentieth — come from large aggregate studies across millions of queries. They are directionally useful and specifically wrong for your site.</p>
<p>The model behind our <a href="/#roi">ROI calculator</a> uses a curve in that shape:</p>
<div class="prose-scroll"><table>
<tr><th>Position</th><th>Approximate share of clicks</th></tr>
<tr><td>1</td><td>~32%</td></tr>
<tr><td>2</td><td>~16%</td></tr>
<tr><td>3</td><td>~10%</td></tr>
<tr><td>4</td><td>~7%</td></tr>
<tr><td>5</td><td>~5%</td></tr>
<tr><td>6–10</td><td>~3% each</td></tr>
<tr><td>11–20</td><td>~1% each</td></tr>
</table></div>
<p>Treat that as a starting point you replace as soon as possible. The real curve for any given query depends on how much of the page the organic results still own. A SERP with four ads, a map pack, a shopping carousel and an AI Overview above the first organic result behaves nothing like a clean ten-blue-links page, and the gap between them is far larger than the gap between position one and position three.</p>
<div class="tip"><b>Better input:</b> open Search Console, filter to queries where you already rank in a given position band, and read your own average CTR. That number carries your brand, your title tags and your actual SERP layout inside it. It beats any published study.</div>

<h3>Branded versus unbranded</h3>
<p>Keep them apart. Branded queries convert several times better and click through at rates no unbranded curve will ever match, because the searcher already decided. Mixing them into one average inflates the model and hides the fact that your unbranded acquisition may be flat.</p>

<h2 id="volume">Step two: the volume that actually applies to you</h2>
<p>Keyword tools report national or metro-level volume. If you are a service business in Atlanta, the number you care about is the slice of that volume inside your service area with intent you can serve.</p>
<ul>
<li><b>Geography.</b> A tool reporting 8,000 monthly searches for a term across the US might represent a few hundred in metro Atlanta.</li>
<li><b>Intent.</b> "How does a heat pump work" and "heat pump installation Atlanta" may sit in the same cluster and have wildly different commercial value. Value them separately.</li>
<li><b>Seasonality.</b> Annual averages hide the fact that half of some categories' demand lands in two months. Model the shape, not the mean.</li>
<li><b>The long tail.</b> Your head term is a fraction of the traffic a well-built page earns. A page ranking for one target keyword typically picks up dozens of related queries, and leaving those out is the most common reason a model undershoots reality.</li>
</ul>

<h2 id="value">Step three: what a visitor is worth</h2>
<p>Two numbers: what share of visitors convert, and what a conversion is worth.</p>
<p>The conversion rate should come from your analytics, segmented to organic landing pages — not a site-wide average diluted by branded and direct traffic. If your tracking cannot tell you that, fixing measurement is a higher-priority project than any ranking work, because you are about to make budget decisions on numbers you cannot verify.</p>
<p>For value per conversion, use gross profit rather than revenue, and use lifetime value rather than first-transaction value where you have retention data. A $400 first job at a business with a 40% margin and three repeat visits is not a $400 conversion in either direction — it is $160 today and considerably more over the relationship.</p>
<div class="tip"><b>If a lead is not a sale:</b> multiply through your close rate. A hundred leads at a 20% close rate and a $2,000 average deal is $40,000, not $200,000. Skipping this step is how SEO proposals lose credibility in the first five minutes of a finance review.</div>

<h2 id="delta">Step four: subtract what you already have</h2>
<p>Here is where most agency projections quietly cheat. They calculate the value of the traffic at position one and present it as the return, when what you are actually buying is the <em>difference</em> between your current position and your target.</p>
<p>If you sit at position six today, moving to position two does not deliver the value of position two — it delivers the value of position two minus the value of position six. On a 2,000-search term that is a meaningful business case. Presented the other way, it is roughly double, and the first time reality lands it costs you the client's trust in every number that follows.</p>

<figure class="fig"><div class="hero-art"><img src="/assets/img/growth.svg" alt="A line chart of organic sessions compounding over twelve months" width="1000" height="700" loading="lazy" decoding="async"></div>
<figcaption>Returns arrive late and then compound — which is why payback period matters more than annual return.</figcaption></figure>
<h2 id="worked">A worked example</h2>
<p>An Atlanta commercial cleaning company, one term, honest inputs:</p>
<div class="prose-scroll"><table>
<tr><th>Input</th><th>Value</th><th>Where it came from</th></tr>
<tr><td>Monthly local searches</td><td>1,200</td><td>Keyword tool, filtered to metro</td></tr>
<tr><td>Current position</td><td>8</td><td>Rank tracker, 90-day average</td></tr>
<tr><td>Target position</td><td>3</td><td>Realistic given competitor authority</td></tr>
<tr><td>CTR delta (3% → 10%)</td><td>+7 pts</td><td>Own Search Console bands</td></tr>
<tr><td>Extra monthly visits</td><td>84</td><td>1,200 × 7%</td></tr>
<tr><td>Organic landing page conversion</td><td>4%</td><td>GA4, organic segment only</td></tr>
<tr><td>Leads per month</td><td>3.4</td><td>84 × 4%</td></tr>
<tr><td>Close rate</td><td>25%</td><td>CRM</td></tr>
<tr><td>Average contract gross profit</td><td>$3,400</td><td>Finance, annualised, margin-adjusted</td></tr>
</table></div>
<p>That is roughly <b>0.85 new customers a month, worth about $2,890 in gross profit</b> — from a single keyword. Around $34,700 a year, against an engagement in the $1,500–$3,000 a month range. It pays back, but not in month one, and the model is only defensible because every input traces to a source.</p>
<p>Now do the same arithmetic across a cluster of thirty related terms, which is what an actual content programme targets, and you have a business case rather than a hopeful chart.</p>

<h2 id="wrong">Four ways this model goes wrong</h2>
<h3>1. It assumes you reach the target position</h3>
<p>Nothing in the formula accounts for the probability of getting there. A term where the top three results are national directories with thousands of referring domains is not a three-to-six-month project for a local business, and pretending otherwise is the single most common failure in SEO forecasting. Weight each term by a realistic difficulty-adjusted probability, or model a range instead of a point.</p>
<h3>2. It ignores the time cost of money</h3>
<p>SEO returns arrive late. Content published in March may not reach its ranking until August. A model showing annual return without showing the monthly curve hides the six months of spend before anything appears — which is the number that actually determines whether the programme gets cancelled.</p>
<h3>3. It treats the SERP as static</h3>
<p>The share of searches ending without a click has been rising for years, and AI Overviews accelerate it in informational categories. If your target terms are the kind an AI answers directly, discount the CTR curve accordingly and shift weight toward <a href="/services/answer-engine-optimization">being cited in the answer</a> rather than ranking beneath it.</p>
<h3>4. It counts rankings instead of revenue</h3>
<p>Rankings are a proxy. If your <a href="/services/seo-reporting">measurement setup</a> cannot follow an organic session through to a closed deal, every number above is an estimate stacked on an estimate. Fix attribution first; it costs less than a month of content and it makes every subsequent decision cheaper.</p>

<h2 id="case">Turning the number into a business case</h2>
<p>A credible SEO business case has four parts, and the model above is only the first:</p>
<ol>
<li><b>The estimate</b>, with every input sourced and a stated range rather than a single number.</li>
<li><b>The payback period</b>, month by month, including the months at zero.</li>
<li><b>The comparison</b>, against what the same budget buys in paid search — including the fact that paid stops the day you stop paying and organic does not.</li>
<li><b>The kill criteria</b>, agreed up front: what you expect to see by month three, and what you will do if you do not see it.</li>
</ol>
<p>That fourth point is the one that separates an SEO programme that survives a budget review from one that does not. Committing in advance to what failure looks like is what earns the room to keep going when the early months look flat — which, if the work is being done properly, they will.</p>
<p>You can run the arithmetic on your own numbers with our <a href="/#roi">SEO ROI calculator</a>, or <a href="/contact">send us your site</a> and we will build the model with you.</p>`
  },
  {
    slug: "local-seo-atlanta-map-pack",
    art: "post-map-pack",
    artAlt: "A grid heat map showing local search rank varying street by street across Atlanta",
    cat: "Local SEO",
    catKey: "local",
    date: "2026-03-04",
    dateText: "4 March 2026",
    read: "11 min read",
    title: "How to Rank in the Atlanta Map Pack",
    metaTitle: "How to Rank in the Atlanta Map Pack — A Practical Guide — SEO Atlanta GA",
    desc: "A practical, step-by-step guide to ranking in Google's local three-pack in Atlanta: proximity, prominence and relevance, Google Business Profile, citations, reviews and location pages.",
    lede: "Three results sit above the organic listings on every local search. Getting into them is a different job from ranking a webpage, and most businesses are losing on details they have never looked at.",
    takeaways: [
      "Local rankings run on proximity, relevance and prominence. You cannot change proximity, so the work concentrates on the other two.",
      "Your Google Business Profile is the highest-leverage asset you own and the one most often left half-filled.",
      "Rank varies street by street. A single rank number for “Atlanta” hides where your visibility actually stops.",
      "Reviews influence rankings through volume, velocity and recency — not just star average."
    ],
    toc: [
      ["how", "How Google picks the three"],
      ["gbp", "Your Google Business Profile is the product"],
      ["grid", "Measure by grid, not by number"],
      ["nap", "Citations and NAP consistency"],
      ["reviews", "Reviews: velocity beats average"],
      ["pages", "Location pages that are not templates"],
      ["schema", "Schema and on-site signals"],
      ["mistakes", "Mistakes that cost Atlanta businesses rankings"],
      ["order", "The order to do this in"]
    ],
    html: `
<h2 id="how">How Google picks the three</h2>
<p>Google is explicit about the local ranking factors: <b>relevance</b>, <b>distance</b> and <b>prominence</b>. Understanding what each one means in practice tells you where your effort belongs.</p>
<ul>
<li><b>Distance (proximity)</b> is how far you are from the searcher — or from the location implied by the query. You cannot change it. It is also why a business in Decatur will struggle to appear for a searcher standing in Vinings no matter how good the SEO is.</li>
<li><b>Relevance</b> is how well your profile and website match the query. This is highly controllable and routinely under-worked.</li>
<li><b>Prominence</b> is how well known and well regarded you are — reviews, links, mentions, and offline reputation reflected online. Slow to build, hard for a competitor to copy.</li>
</ul>
<p>Because proximity is fixed, local SEO is really the discipline of maximising relevance and prominence hard enough to extend the radius over which you can win. That radius is the number to optimise, and almost nobody measures it.</p>

<h2 id="gbp">Your Google Business Profile is the product</h2>
<p>For map pack purposes, your profile matters more than your website. Treat it as a page you are optimising, not a form you filled in once.</p>
<h3>Primary category is the single biggest lever</h3>
<p>Your primary category does more to determine which searches you are eligible for than anything else on the profile. "Contractor" and "HVAC contractor" produce entirely different eligibility. Look at what the businesses currently ranking for your target search have chosen — their categories are visible — and be specific rather than broad.</p>
<h3>Fill in everything</h3>
<p>Services with descriptions, products, attributes, opening hours including holiday hours, service areas, the booking link, the full business description. Sparse profiles under-perform complete ones, and completeness is free.</p>
<h3>The business name field is not a keyword field</h3>
<p>"Atlanta's Best Roofing &amp; Gutters | Roof Repair Atlanta" is a policy violation. It sometimes works until a competitor reports it, and then you lose the listing. Use your real business name.</p>
<h3>Post, and answer questions</h3>
<p>Google Posts and the Q&amp;A section are both public surfaces on your profile. You can ask and answer your own questions — that is allowed and is a good way to get accurate answers in front of people instead of letting a stranger guess for you.</p>
<div class="tip"><b>Photos matter more than they should.</b> Recent, geotagged-in-spirit, genuinely-of-your-business photos correlate with engagement, and engagement correlates with rankings. Storefront, interior, team, work in progress, finished work. Add them monthly rather than in one batch.</div>

<figure class="fig"><div class="hero-art"><img src="/assets/img/phone.svg" alt="A phone showing the local three-pack for a plumber near me search" width="760" height="900" loading="lazy" decoding="async" style="max-height:520px;object-fit:contain;background:#060F26"></div>
<figcaption>The three results that take the calls, on the device most local searches happen on.</figcaption></figure>
<h2 id="grid">Measure by grid, not by number</h2>
<p>"We rank #4 in Atlanta" is close to meaningless. Local rank changes street by street: you might be first in Grant Park, fourth in Old Fourth Ward, and absent in Sandy Springs — all for the same keyword at the same moment.</p>
<p>Grid-based rank tracking samples your position at dozens of points across a map and renders the result as a heat map. It converts a meaningless average into an operational picture: you can see exactly where your visibility ends, and watch that boundary move as the work lands. It also settles arguments about whether a campaign is working, because the map either grew or it did not.</p>

<h2 id="nap">Citations and NAP consistency</h2>
<p>Your Name, Address and Phone number appear across directories, data aggregators, social profiles and industry sites. When those copies disagree — an old suite number, a tracking phone number, a former trading name — Google's confidence in your location data drops, and confidence is part of prominence.</p>
<ol>
<li><b>Decide the canonical format</b> once. Exact street abbreviation, exact suite formatting, one phone number. Write it down.</li>
<li><b>Fix the big aggregators first</b>, because they propagate to the long tail automatically.</li>
<li><b>Clean up duplicates.</b> Duplicate listings split your signals and occasionally outrank your real one.</li>
<li><b>Then go local.</b> Atlanta chambers of commerce, neighbourhood associations, BeltLine business directories, industry bodies. These carry relevance that a national directory does not.</li>
</ol>
<p>Citation building has diminishing returns — the hundredth directory does nothing. Consistency across the significant ones is the goal, not volume.</p>

<h2 id="reviews">Reviews: velocity beats average</h2>
<p>Businesses obsess over star average and ignore the two factors that move rankings more.</p>
<ul>
<li><b>Velocity.</b> A steady arrival of new reviews signals an active business. Forty reviews collected in one week two years ago is a worse signal than two a week for the last year — and the burst pattern is exactly what review filters look for.</li>
<li><b>Recency.</b> Reviews decay in influence. A profile whose most recent review is from 2023 reads as dormant to both algorithms and humans.</li>
<li><b>Content.</b> Reviews mentioning the specific service and the neighbourhood add relevance signals your own copy cannot supply. You cannot script this, but you can ask a question that invites it: "what did we do for you?" rather than "please leave a review."</li>
</ul>
<h3>Respond to all of them</h3>
<p>Every review, positive and negative, within a couple of days. Responses are public, indexed, and read by prospects who are deciding between you and the business below you. A calm, specific reply to a bad review does more for conversion than the review costs you.</p>
<h3>What not to do</h3>
<p>Do not gate reviews by screening for happy customers first — it violates Google's policies. Do not buy reviews. Do not offer discounts in exchange. Enforcement is inconsistent right up until it is not, and the penalty is losing the asset the whole strategy rests on.</p>

<h2 id="pages">Location pages that are not templates</h2>
<p>If you serve multiple Atlanta neighbourhoods, you probably want a page per area. The mistake is generating them from one template with the place name substituted, which produces near-duplicate pages that rank for nothing and can drag down the rest of the site.</p>
<p>A location page earns its place when it contains things that are only true of that location:</p>
<ul>
<li>Work you have actually done there, with specifics</li>
<li>Local constraints that change the job — permit rules, HOA requirements, housing stock, typical building age</li>
<li>Reviews from customers in that area</li>
<li>Genuinely relevant landmarks and boundaries, used naturally rather than stuffed</li>
<li>Directions, parking, service-radius detail, and area-specific hours if they differ</li>
</ul>
<p>Ten thin neighbourhood pages are worse than three real ones. Build the three, see them work, then extend.</p>

<h2 id="schema">Schema and on-site signals</h2>
<p><code>LocalBusiness</code> structured data — or the more specific subtype that fits you, such as <code>Plumber</code>, <code>Dentist</code> or <code>Restaurant</code> — states your name, address, phone, hours, service area and geographic coordinates in a form machines read without ambiguity. Add it to your homepage and each location page, and keep it identical to your canonical NAP.</p>
<p>Beyond schema, the on-site basics still apply: the city in title tags where it is natural, an embedded map on the contact page, a clickable phone number, and a site fast enough on mobile that a searcher on 5G outside your building does not bounce before it loads. <a href="/services/technical-seo">Technical problems</a> suppress local rankings the same way they suppress everything else.</p>

<h2 id="mistakes">Mistakes that cost Atlanta businesses rankings</h2>
<ul>
<li><b>A virtual office or coworking address.</b> Google removes these, and a competitor will report it.</li>
<li><b>A tracking number on the profile without the real number listed on-site.</b> Use dynamic number insertion on the website and keep the profile number consistent with your citations.</li>
<li><b>One profile for multiple practitioners at one address</b>, or several profiles for one business. Both create duplicate and eligibility problems.</li>
<li><b>Setting a service area of "Georgia."</b> An enormous, unfocused service area dilutes relevance. Be realistic about where you actually go.</li>
<li><b>Letting the profile go stale</b> after the initial setup. It is a living asset; hours, photos, services and posts all need maintenance.</li>
</ul>

<h2 id="order">The order to do this in</h2>
<ol>
<li><b>Weeks 1–2:</b> Profile audit and completion, category correction, canonical NAP defined, duplicates found.</li>
<li><b>Weeks 2–4:</b> Aggregator and major citation cleanup. Grid tracking switched on so you have a real baseline.</li>
<li><b>Month 2:</b> LocalBusiness schema, the first two or three genuine location pages, review request flow live.</li>
<li><b>Month 3 onward:</b> Review velocity, local links and sponsorships, neighbourhood content, monthly profile maintenance. Watch the grid, not the average.</li>
</ol>
<p>Foundation work often moves rankings within weeks, because it is correcting data Google already holds about you. The compounding part — reviews, links, prominence — is the part that takes months and is also the part competitors find hardest to copy.</p>
<p>If you want the grid baseline without doing the setup yourself, that is where our <a href="/services/local-seo">local SEO engagements</a> start. <a href="/contact">Send us your profile</a> and we will tell you what is wrong with it.</p>`
  },
  {
    slug: "ai-overviews-answer-engine-optimization",
    art: "post-ai-overviews",
    artAlt: "A search results page where a generated AI answer with citations sits above the organic links",
    cat: "AI Search",
    catKey: "ai",
    date: "2026-04-22",
    dateText: "22 April 2026",
    read: "10 min read",
    title: "AI Overviews and the Rise of Answer Engine Optimization",
    metaTitle: "AI Overviews & Answer Engine Optimization: A Practical Guide — SEO Atlanta GA",
    desc: "What AI Overviews, ChatGPT and Perplexity changed about search, and the concrete work that gets your business cited inside AI-generated answers.",
    lede: "Search is being answered rather than listed. That does not make SEO obsolete — but it does change what winning looks like, and it introduces a channel where most businesses have never checked whether they are even eligible.",
    takeaways: [
      "AI answers are built by retrieving passages, so the unit of optimization is the passage, not the page.",
      "If your robots rules block AI crawlers, you have opted out of the channel — usually without deciding to.",
      "Citation share is the metric. No rank tracker reports it; you have to prompt the engines and record who gets named.",
      "The underlying requirements — clear, credible, well-structured, corroborated content — are the same ones good SEO always had."
    ],
    toc: [
      ["what", "What actually changed"],
      ["retrieval", "How an answer engine picks its sources"],
      ["access", "Step one: check you are not blocked"],
      ["passage", "Step two: write for passage retrieval"],
      ["entity", "Step three: make your entity unambiguous"],
      ["corroborate", "Step four: get corroborated elsewhere"],
      ["measure", "Measuring citation share"],
      ["traffic", "What this does to your traffic"],
      ["do", "What to do on Monday"]
    ],
    html: `
<h2 id="what">What actually changed</h2>
<p>For twenty-five years a search engine's job was to hand you a list and let you choose. Now a growing share of queries return a composed answer — Google's AI Overviews, ChatGPT's search mode, Perplexity, Gemini, Copilot — assembled from sources the system selected and, usually, cited.</p>
<p>Two consequences follow, and they pull in opposite directions:</p>
<ul>
<li><b>Fewer clicks.</b> If the answer is on the results page, a meaningful share of searchers never leave it. Informational queries take this hardest.</li>
<li><b>Higher-value clicks.</b> The people who do click through from a cited source have already had your business described to them favourably by a system they trust. They arrive further down the funnel than a blue-link visitor.</li>
</ul>
<p>Answer engine optimization — AEO, sometimes generative engine optimization or GEO — is the work of being the source those answers are built from. It is not a replacement for SEO. It is a specialism inside it, with a different unit of optimization and a different success metric.</p>

<h2 id="retrieval">How an answer engine picks its sources</h2>
<p>The pattern across current systems is broadly retrieval-augmented generation. Simplified:</p>
<ol>
<li>The user's question is interpreted and often broken into several sub-queries.</li>
<li>The system retrieves candidate <em>passages</em> — chunks of pages, not whole pages — from a search index or its own crawl.</li>
<li>It ranks those passages for how well they answer the specific sub-question.</li>
<li>It synthesises an answer from the top passages and attributes the ones it leaned on.</li>
</ol>
<p>Step two is the one that changes your job. The system is not asking "is this a good page about roofing?" It is asking "does this chunk of text answer *how much does a roof replacement cost in Atlanta* on its own?" A passage that only makes sense with three paragraphs of preceding context loses to a weaker but self-contained one.</p>

<h2 id="access">Step one: check you are not blocked</h2>
<p>This takes ten minutes and it is the most common reason a business is invisible to AI search. Open your <code>robots.txt</code> and look for these user agents:</p>
<div class="prose-scroll"><table>
<tr><th>User agent</th><th>Belongs to</th><th>What it does</th></tr>
<tr><td><code>GPTBot</code></td><td>OpenAI</td><td>Crawls for training and retrieval</td></tr>
<tr><td><code>OAI-SearchBot</code></td><td>OpenAI</td><td>Search/browsing retrieval</td></tr>
<tr><td><code>ClaudeBot</code></td><td>Anthropic</td><td>Crawls for Claude</td></tr>
<tr><td><code>PerplexityBot</code></td><td>Perplexity</td><td>Indexes for Perplexity answers</td></tr>
<tr><td><code>Google-Extended</code></td><td>Google</td><td>Controls Gemini/Vertex use, not Search ranking</td></tr>
<tr><td><code>Bingbot</code></td><td>Microsoft</td><td>Feeds Copilot as well as Bing</td></tr>
</table></div>
<p>Plenty of sites picked up blanket blocks from a template, a plugin default, or a decision made in 2023 when the question looked different. Decide deliberately instead. Publishers monetising pageviews have a real argument for blocking. A service business whose content exists to win customers almost certainly wants to be cited — an AI answer naming your business is an endorsement you did not have to buy.</p>
<div class="tip"><b>Worth knowing:</b> blocking <code>Google-Extended</code> does not remove you from AI Overviews, which are built from Google's ordinary search index. The two controls are separate, and conflating them is a common and expensive mistake.</div>

<h2 id="passage">Step two: write for passage retrieval</h2>
<p>The structural changes are unglamorous and they work.</p>
<h3>Answer first, elaborate after</h3>
<p>Open every section with a direct, complete answer in one or two sentences, then expand. The lead sentence is what gets retrieved; the elaboration is what convinces the human who clicks through.</p>
<h3>Make headings the questions people ask</h3>
<p>A heading reading "Pricing" tells a retrieval system very little. "How much does commercial cleaning cost in Atlanta?" matches the query almost exactly and scopes the passage beneath it.</p>
<h3>Keep passages self-contained</h3>
<p>Avoid "as mentioned above," "this approach" and other references that only resolve with surrounding context. Assume every section will be read alone, because that is how it will be retrieved.</p>
<h3>Use structure machines can parse</h3>
<p>Comparison tables, numbered steps, definition lists and short bulleted criteria are all easy to lift cleanly. Long undifferentiated prose is not.</p>
<h3>Be specific and attributable</h3>
<p>Numbers, dates, named methods and stated sources make a passage more useful to cite and easier to verify. Vague, hedged writing gets passed over in favour of something concrete — which is a good reason to stop hedging in general.</p>

<figure class="fig"><div class="hero-art"><img src="/assets/img/ai.svg" alt="A network diagram resolving signals into an AI answer that cites the site" width="1000" height="760" loading="lazy" decoding="async"></div>
<figcaption>Retrieval resolves entities, not just strings. Ambiguity about who you are costs you the citation.</figcaption></figure>
<h2 id="entity">Step three: make your entity unambiguous</h2>
<p>Answer engines reason about entities — a business, a person, a product — not just strings of text. If a system cannot confidently resolve who "SEO Atlanta GA" is, it will not put your name in an answer.</p>
<ul>
<li><b>Schema markup</b> defining your organisation, its identifiers and its relationships, consistently across the site.</li>
<li><b>An about page that states plain facts</b>: what you do, where, since when, for whom, by whom. Marketing language is not a substitute for facts.</li>
<li><b>Consistent naming, address and description</b> everywhere you appear.</li>
<li><b>Named authors</b> with real credentials, connected to their work.</li>
</ul>
<p>This is the same entity-clarity work that has quietly underpinned E-E-A-T for years. AEO raises the stakes rather than changing the task.</p>

<h3>What about llms.txt?</h3>
<p>It is a proposed convention: a markdown file at your site root giving models a clean summary of the site and links to the pages worth reading. No major engine currently guarantees it uses one, so treat it as inexpensive insurance rather than a ranking factor. It costs an hour. Publish it, and do not expect it to do the heavy lifting.</p>

<h2 id="corroborate">Step four: get corroborated elsewhere</h2>
<p>Here is the part on-page work cannot solve. Language models weight facts that appear consistently across independent sources. A claim that exists only on your own website is weakly supported; the same claim reflected in a trade publication, a local news story, a community forum and a supplier's site is something a model will repeat.</p>
<p>Practically, that means the boring old work matters more, not less: <a href="/services/link-building">digital PR, local partnerships, industry mentions</a>, and being genuinely present in the places your category is discussed. Forums and community sites carry unusual weight in AI answers for subjective and recommendation-shaped queries — which is worth knowing, and worth participating in honestly rather than gaming.</p>

<h2 id="measure">Measuring citation share</h2>
<p>No rank tracker reports this natively, so build the measurement yourself:</p>
<ol>
<li><b>Write your prompt set.</b> Twenty to fifty questions your buyers actually ask, phrased the way they phrase them to a chatbot — longer and more conversational than a Google query.</li>
<li><b>Run them across the engines</b> on a fixed schedule, and record which domains get cited and in what position.</li>
<li><b>Track your share over time</b>, alongside your competitors'. The trend is the metric; any single run is noisy, because these systems are non-deterministic.</li>
<li><b>Watch referral traffic</b> from <code>chatgpt.com</code>, <code>perplexity.ai</code> and Copilot in analytics. Low volume, high intent, and it is the only part of this that shows up in a standard report.</li>
</ol>
<p>AI Overview impressions are the hard case: they fold into ordinary Search Console data with no separate breakout, so direct prompt monitoring remains the honest measurement.</p>

<h2 id="traffic">What this does to your traffic</h2>
<p>Expect the mix to shift rather than the total to collapse — and expect the shift to be uneven.</p>
<ul>
<li><b>Definitional and informational queries</b> lose the most clicks. "What is X" is exactly what an AI answers in place.</li>
<li><b>Transactional and local queries</b> hold up far better. People still want to click through to book, buy and call.</li>
<li><b>Comparison and recommendation queries</b> are where citation matters most, because being named is effectively a recommendation.</li>
</ul>
<p>The strategic read: top-of-funnel content increasingly earns visibility rather than sessions, and you need <a href="/services/seo-reporting">measurement that can value a citation</a> and not only a click. If your reporting only counts sessions, this channel will look like a loss even while it is working.</p>

<h2 id="do">What to do on Monday</h2>
<ol>
<li>Read your <code>robots.txt</code> and make a deliberate decision about each AI crawler.</li>
<li>Ask ChatGPT and Perplexity the ten questions your best customers ask. Write down who gets cited.</li>
<li>Take your three highest-value pages and restructure the top of each section: question as heading, complete answer in the first two sentences.</li>
<li>Check your organisation schema resolves cleanly and your about page states verifiable facts.</li>
<li>Set a monthly reminder to re-run the prompt set. The trend is the only number that means anything.</li>
</ol>
<p>None of this is exotic, and that is the point. Answer engines reward content that is clear, specific, structured, credible and corroborated — which is what search engines have been claiming to reward for a decade. What changed is that vagueness now costs you the citation outright rather than a couple of ranking positions.</p>
<p>We do this work as a standalone engagement or as part of a broader programme — see <a href="/services/answer-engine-optimization">answer engine optimization</a>, or <a href="/contact">send us your site</a> and we will run the prompt set for you.</p>`
  }
];

function articleBody(p) {
  const url = `/blog/${p.slug}`;
  const trail = [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }, { name: p.title, url }];
  const rel = POSTS.filter((x) => x.slug !== p.slug);
  const tocLinks = p.toc.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join("");
  return `
<div class="readbar" id="readbar" aria-hidden="true"></div>

<div class="page-hero">
  <div class="mesh2" aria-hidden="true"></div>
  <div class="wrap">
    ${C.crumbHtml(trail)}
    <span class="eyebrow">${p.cat}</span>
    <h1 style="max-width:20ch">${p.title}</h1>
    <p class="sub" style="max-width:56ch">${p.lede}</p>
    <div class="art-meta">
      <span class="cat">${p.cat}</span>
      <time datetime="${p.date}">${p.dateText}</time>
      <span>${p.read}</span>
    </div>
  </div>
</div>

<section style="padding-top:52px">
  <div class="wrap">
    <div class="article-grid">
      <div class="article-main">
        <div class="article-hero photo-frame reveal in">
          <img src="/assets/img/${p.art}.svg" alt="${p.artAlt}" width="1400" height="560" fetchpriority="high" decoding="async">
        </div>

        <details class="toc-mobile">
          <summary>On this page</summary>
          <ol>${tocLinks}</ol>
        </details>

        <article class="prose" id="articleBody">
          <div class="key-take">
            <h4>Key takeaways</h4>
            <ul>${p.takeaways.map((t) => `<li>${t}</li>`).join("")}</ul>
          </div>
          ${p.html}
          <div class="author">
            <div style="display:flex;gap:14px;align-items:center">
              <div class="av">${AUTHOR.initials}</div>
              <div><div class="n">${AUTHOR.name}</div><div class="r">${AUTHOR.role}</div></div>
            </div>
          </div>
        </article>
      </div>

      <aside class="article-side">
        <nav class="toc-nav" id="tocNav" aria-label="On this page">
          <h4>On this page</h4>
          <ol>${tocLinks}</ol>
        </nav>
        <div class="side-cta">
          <p>Want this done on your site? Send us the URL and we'll reply with what we'd change first.</p>
          <a class="btn btn-primary" href="#start" data-cta="article_side_${p.slug}">Get a free review →</a>
        </div>
      </aside>
    </div>
  </div>
</section>

<section style="padding-top:44px;padding-bottom:20px">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Keep reading</span><h2>More from the blog</h2></div>
    <div class="related reveal d1">
      ${rel.map((r) => `<a class="post-card" href="/blog/${r.slug}"><div class="photo-frame post-photo"><img src="/assets/img/${r.art}.svg" alt="${r.artAlt}" width="1400" height="560" loading="lazy" decoding="async"></div><div class="post-body"><div class="post-meta"><span class="cat">${r.cat}</span><time datetime="${r.date}">${r.dateText}</time></div><h3>${r.title}</h3><p>${r.lede}</p><span class="more">Read →</span></div></a>`).join("\n      ")}
    </div>
  </div>
</section>

<div id="start"></div>
${C.formSection({
    id: `post-${p.slug}`,
    name: `blog-${p.slug}`,
    heading: "Want this done on your site?",
    sub: "Send us the URL. We'll reply with the specific things we'd change, whether or not you ever hire us."
  })}`;
}

POSTS.forEach((p) => {
  const url = `/blog/${p.slug}`;
  const trail = [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }, { name: p.title, url }];
  const article = {
    "@type": "BlogPosting",
    "@id": C.SITE + url + "#article",
    headline: p.title,
    description: p.desc,
    datePublished: p.date,
    dateModified: p.date,
    url: C.SITE + url,
    mainEntityOfPage: C.SITE + url,
    image: C.SITE + "/assets/img/" + p.art + ".svg",
    author: { "@type": "Organization", name: "SEO Atlanta GA", url: C.SITE + "/" },
    publisher: { "@id": C.SITE + "/#business" },
    articleSection: p.cat,
    inLanguage: "en-US"
  };
  fs.writeFileSync(`blog/${p.slug}.html`, C.page({
    url, title: p.metaTitle, desc: p.desc, active: "/blog", ogType: "article",
    graph: [article, C.breadcrumbs(trail)],
    body: articleBody(p)
  }));
  console.log("wrote blog/" + p.slug + ".html");
});

/* ── blog index ────────────────────────────────────────────────────────── */
const cats = [["all", "All posts"], ["strategy", "Strategy"], ["local", "Local SEO"], ["ai", "AI Search"]];
const indexTrail = [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }];
const indexBody = `
<div class="page-hero">
  <div class="mesh2" aria-hidden="true"></div>
  <div class="wrap">
    ${C.crumbHtml(indexTrail)}
    <span class="eyebrow">Blog</span>
    <h1>Atlanta SEO, <span class="blue">written plainly</span></h1>
    <p class="sub" style="max-width:54ch">Practical guides on local search, technical SEO and AI answer engines. No listicles, no recycled advice, no gated PDFs.</p>
  </div>
</div>

<section style="padding-top:52px">
  <div class="wrap">
    <div class="chips reveal">
      ${cats.map(([k, l], i) => `<button class="chip${i === 0 ? " active" : ""}" data-cat="${k}" type="button">${l}</button>`).join("\n      ")}
    </div>
    <div class="blog-grid reveal d1">
      ${POSTS.map((p) => `<a class="post-card" data-cat="${p.catKey}" href="/blog/${p.slug}"><div class="photo-frame post-photo"><img src="/assets/img/${p.art}.svg" alt="${p.artAlt}" width="1400" height="560" loading="lazy" decoding="async"></div><div class="post-body"><div class="post-meta"><span class="cat">${p.cat}</span><time datetime="${p.date}">${p.dateText}</time><span>${p.read}</span></div><h3>${p.title}</h3><p>${p.lede}</p><span class="more">Read the guide →</span></div></a>`).join("\n      ")}
    </div>
    <p class="empty-note">Nothing published in that category yet — more on the way.</p>
  </div>
</section>

${C.formSection({
  id: "blog-index",
  name: "blog-index",
  heading: "Rather we just looked at your site?",
  sub: "Reading is slower than asking. Send us the URL and we'll tell you what we'd fix first."
})}`;

fs.writeFileSync("blog/index.html", C.page({
  url: "/blog",
  title: "SEO Blog | Local Search, Technical SEO & AI Answer Engines — SEO Atlanta GA",
  desc: "Practical SEO guides for Atlanta businesses: map pack rankings, SEO ROI modelling, technical audits and answer engine optimization.",
  active: "/blog",
  graph: [
    { "@type": "Blog", "@id": C.SITE + "/blog#blog", name: "SEO Atlanta GA Blog", url: C.SITE + "/blog", publisher: { "@id": C.SITE + "/#business" },
      blogPost: POSTS.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: C.SITE + "/blog/" + p.slug, datePublished: p.date })) },
    C.breadcrumbs(indexTrail)
  ],
  body: indexBody
}));
console.log("wrote blog/index.html");

module.exports = { POSTS };
