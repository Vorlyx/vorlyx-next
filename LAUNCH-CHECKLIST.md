# 🚀 Vorlyx — Launch Checklist

Complete pre-launch and post-launch checklist. Check off each item as you complete it. This is a living document — update it as you discover new tasks.

---

## 📖 Legend

- 🔴 **CRITICAL** — Must be done before public launch
- 🟡 **IMPORTANT** — Do within first week of launch
- 🟢 **NICE TO HAVE** — Post-launch improvements
- 🔵 **ONGOING** — Continuous maintenance tasks

---

## 🔴 CRITICAL — Before Public Launch

### 1. Domain & URLs

Global find-and-replace: `vorlyx.com` if the final production domain differs.

- [ ] Confirm final production domain
- [ ] Update all `https://vorlyx.com` references in `components/seo/Schema.tsx`
- [ ] Update `canonical` URLs in every `data/*.json` `seo` block:
  - [ ] `data/luminelle.json`
  - [ ] `data/rhexo.json`
  - [ ] `data/eclavie.json`
  - [ ] `data/nexara.json`
  - [ ] `data/echov.json`
- [ ] Update `openGraph.url` in every project `page.tsx`
- [ ] Update `openGraph.images[].url` (should point to your OG images)
- [ ] Update `twitter.images` in every `page.tsx`
- [ ] Verify `alternates.canonical` in every `page.tsx`
- [ ] Update domain in `data/agency.json` `seo` block
- [ ] Update domain in `data/services.json` `seo` block
- [ ] Update domain in `data/news.json` `seo` block
- [ ] Update domain in `data/contact.json` `seo` block
- [ ] Update domain in `data/home.json` `seo` block
- [ ] Update domain in `data/work.json` `seo` block

**Optional refactor:** Move all domain references to an env variable:

```ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vorlyx.com";

Then reference SITE_URL everywhere. Cleaner for staging/production/local dev.

2. Project Publish Dates
Replace placeholder dates with actual project launch dates.

 data/luminelle.json → seo.datePublished
 data/rhexo.json → seo.datePublished
 data/eclavie.json → seo.datePublished
 data/nexara.json → seo.datePublished
 data/echov.json → seo.datePublished

3. Open Graph Images (1200×630px)
Create/save these images in public/og/. Each project + main page needs one.

Project pages:

 public/og/luminelle-og.jpg
 public/og/rhexo-og.jpg
 public/og/eclavie-og.jpg
 public/og/nexara-og.jpg
 public/og/echov-og.jpg

Main pages:

 public/og/home-og.jpg
 public/og/work-og.jpg
 public/og/agency-og.jpg
 public/og/services-og.jpg
 public/og/news.png (referenced in /news/page.tsx)
 public/og/contact-og.jpg

Design guidelines:

Exact size: 1200×630 pixels (mandatory for LinkedIn, Facebook, Twitter cards)
Format: JPG (or PNG if transparency needed)
Include: project/page name, Vorlyx logo, key visual
File size: keep under 300KB for fast social preview loading
Test each image with all social preview tools (see section 12)

4. Organization Schema — Real Business Info
Edit components/seo/Schema.tsx → organizationSchema():

 Real business email (currently placeholder hello@vorlyx.com)
 Real logo URL (currently https://vorlyx.com/logo.png — confirm file exists)
 Confirm business description matches your final brand copy
 Real Instagram URL (currently https://instagram.com/vorlyx)
 Real LinkedIn URL (currently https://linkedin.com/company/vorlyx)
 Add Facebook URL (if applicable)
 Add X / Twitter URL (if applicable)
 Add YouTube channel URL (if applicable)
 Add Behance profile URL (if applicable)
 Add Dribbble profile URL (if applicable)
 Add Vimeo profile URL (if applicable)
 Add TikTok URL (if applicable)
 Add Pinterest URL (if applicable)

5. Contact Info — Real Business Details
Edit data/contact.json:

 Real business inquiries email
 Real careers email
 Real phone number (optional but improves local SEO)
 Physical address (optional but adds structured data for local SEO)
 Business hours (optional)

6. SEO Copy Review
Refine before launch — placeholder copy exists but must match your brand voice.

Per project data /.json → seo block:

 title — under 60 characters, includes project name + Vorlyx
 description — 150-160 characters, compelling and natural
 keywords — relevant, non-spammy, 5-10 items
 category — matches actual industry/vertical
Per main page:

 Home page SEO copy reviewed
 Work page SEO copy reviewed
 Agency page SEO copy reviewed
 Services page SEO copy reviewed
 News page SEO copy reviewed
 Contact page SEO copy reviewed

7. Alt Text Audit
Every <Image> and <img> should have descriptive alt text (accessibility + SEO).

 HeroSection and all landing sections
 WorkGrid project cards
 StickyCardsSection project media
 All project detail pages:
 LuminelleHero, ProjectMediaGrid, NextProjectNav
 RhexoHero, RhexoProjectMediaGrid, RhexoNextProjectNav
 EclavieHero, EclavieProjectMediaGrid, EclavieNextProjectNav
 NexaraHero, NexaraProjectMediaGrid, NexaraNextProjectNav
 EchovHero, EchovProjectMediaGrid, EchovNextProjectNav
 Footer logo
 Header logo
 AgencyHero, TeamSection, VorlyxDoctrine, CreativeStrategists
 ServicesHero, ServicesStickyCards, WhatWeDoSection, WorkShowcase
 ContactHero, ContactDetails, ContactIntro
 NewsHero, NewsGrid article thumbnails
 Decorative icons should use alt="" (empty string) if purely visual

8. Performance Audit
Test before deploying to production.

 Run https://pagespeed.web.dev/ against every major page:
 Home
 Work
 Each project detail page
 Agency
 Services
 News
 Contact
 Target: Green scores on Core Web Vitals:
 LCP (Largest Contentful Paint) < 2.5s
 FID (First Input Delay) < 100ms
 CLS (Cumulative Layout Shift) < 0.1
 INP (Interaction to Next Paint) < 200ms
 Optimize any images over 500KB (use WebP or AVIF)
 Verify priority prop is set on above-the-fold <Image> components
 Check that videos have preload="metadata" if not immediately visible
 Check bundle size with npm run build — investigate any warnings
 Test on real 3G/4G network throttling

9. Legal & Compliance
 Privacy Policy page (/privacy-policy)
 Terms of Service page (/terms)
 Cookie Policy page (if using cookies/tracking)
 Cookie consent banner (if targeting EU / using analytics)
 GDPR compliance review (if targeting EU visitors)
 CCPA compliance review (if targeting California visitors)
 Add footer links to legal pages
 Ensure contact form has appropriate consent checkbox

10. Testing Across Devices & Browsers
 iPhone Safari (latest)
 iPhone Safari (one version back)
 Android Chrome (latest)
 iPad Safari
 Desktop Chrome
 Desktop Safari
 Desktop Firefox
 Desktop Edge
 Test dark mode (if implemented)
 Test with screen reader (VoiceOver on Mac, NVDA on Windows)
 Test keyboard navigation (Tab through all interactive elements)
 Test with 200% browser zoom
 Test with reduced motion preference enabled

🟡 IMPORTANT — Within First Week of Launch
11. Search Engine Setup
 Create Google Search Console account
 Add and verify property (via DNS record or meta tag)
 Submit sitemap.xml
 Request indexing for homepage
 Request indexing for /work
 Request indexing for each project detail page
 Request indexing for /services, /agency, /news, /contact
 Create Bing Webmaster Tools account
 Verify Bing property
 Submit sitemap to Bing
 Set up DuckDuckGo (uses Bing index automatically once Bing is set up)
12. Social Media Preview Verification
Test every project page + main page share on these platforms:

 LinkedIn — https://www.linkedin.com/post-inspector/
 Twitter/X — https://cards-dev.twitter.com/validator
 Facebook — https://developers.facebook.com/tools/debug/
 WhatsApp (send yourself the link, verify preview loads)
 iMessage (send yourself the link)
 Slack (paste in a channel)
 Discord (paste in a channel)
 Telegram (paste in a chat)
If any preview looks wrong, use the debugger's "Scrape Again" or "Refresh Cache" option.

13. Schema Validation
Test every page type with Google Rich Results Test:

 Homepage (/)
 Work collection (/work)
 Luminelle project (/work/luminelle)
 Rhexo project (/work/rhexo)
 Éclavie project (/work/eclavie)
 Nexara project (/work/nexara)
 Echov project (/work/echov)
 Services page (/services)
 News page (/news)
 Contact page (/contact)
 Agency page (/agency)
Tools:

https://search.google.com/test/rich-results
https://validator.schema.org/
14. Analytics Setup
Choose one platform and install:

 Choose platform: Google Analytics 4 / Plausible / Fathom / Umami
 Install tracking code
 Configure conversion goals:
 Contact form submission
 Email link click (mailto:)
 Project page visit
 Time on site > 2 minutes
 Set up event tracking for CTAs:
 "Let's Talk" button clicks
 "View Work" button clicks
 Social media link clicks
 Newsletter signup submissions
 Enable Core Web Vitals reporting
 Set up email alerts for major traffic changes
🟢 NICE TO HAVE — Post-Launch Improvements
15. Sitemap & Robots
 Create app/sitemap.ts (auto-generates sitemap from routes)
 Create app/robots.ts (controls crawler access)
 Submit sitemap URL to Google Search Console
 Confirm robots.txt allows indexing of public pages
 Block internal/admin routes from crawlers if any exist
Example sitemap.ts:

TypeScript

export default function sitemap() {
  const baseUrl = "https://vorlyx.com";
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/work`, lastModified: new Date() },
    // ... etc
  ];
}

16. Advanced SEO
 Add JSON-LD FAQ schema on pages with FAQs
 Add JSON-LD Review schema if client testimonials exist
 Add JSON-LD VideoObject schema for hero videos
 Implement hreflang tags if adding multi-language support
 Add visual breadcrumb navigation UI (currently only in schema)
 Add LocalBusiness schema if targeting local clients
 Add Person schema for team members on Agency page
 Consider AMP versions for news articles (if traffic warrants)

17. Content Enhancements
 Add project categories/filters on /work page
 Add "Related projects" section on detail pages
 Add estimated read time on news articles
 Add publication + updated dates visually on news articles
 Consider adding a blog/insights section for content SEO
 Add case study PDFs downloadable per project (optional B2B lead magnet)
 Add client logo wall (with permission)

18. Advanced Features
 Search functionality across projects/news
 Newsletter integration (Mailchimp / ConvertKit / Buttondown)
 Contact form with backend (currently unknown if working end-to-end)
 Email notifications for form submissions
 Consider adding a live chat widget (Intercom, Crisp)
 Add project inquiry form on each detail page

🔵 ONGOING — Continuous Maintenance

19. Monitoring
 Set up uptime monitoring (UptimeRobot / BetterStack / Pingdom)
 Set up error tracking (Sentry / Rollbar / LogRocket)
 Schedule monthly Lighthouse audits
 Schedule quarterly SEO content review
 Monitor Google Search Console weekly for:
 Coverage errors
 Manual actions
 Core Web Vitals issues
 Mobile usability issues
 Monitor analytics for traffic drops
 Set up backup schedule for content (if adding CMS later)

20. Content Updates
 Publish new project case studies as they complete
 Update news section regularly (aim for monthly minimum)
 Refresh OG images seasonally or on rebrand
 Update team/agency section as company grows
 Update SEO descriptions if brand messaging evolves
 Update publish dates on refreshed case studies (dateModified in schema)

21. Version Control & Documentation
 Ensure Git repo has proper .gitignore
 Document deployment process in README.md
 Keep this checklist updated as you launch and iterate
 Document any custom Tailwind config
 Document any custom components/hooks
 Keep dependencies updated (monthly npm outdated review)
 Test major dependency updates in a branch before merging

🔧 Quick Reference: Files That Need Attention Before Launch
File	                        What needs updating
components/seo/Schema.tsx	    Domain, email, social URLs, logo URL
data/luminelle.json	            Full seo block, publish date
data/rhexo.json 	            Full seo block, publish date
data/eclavie.json	            Full seo block, publish date
data/nexara.json	            Full seo block, publish date
data/echov.json 	            Full seo block, publish date
data/contact.json	            Real emails, phone, address
data/agency.json	            SEO copy, team info
data/services.json	            SEO copy, what we do
data/news.json	                SEO copy, article dates
data/home.json	                SEO copy
data/work.json	                SEO copy
app/work/*/page.tsx	            Metadata + Schema imports
app/*/page.tsx	                Verify all metadata exports
public/og/.jpg	                Create all social share images

✅ Final Pre-Launch Sanity Check
Right before hitting deploy, verify:

 All datePublished values reflect reality (no 2024-11-15 placeholders)
 All URLs use production domain (not localhost or staging)
 All OG images exist at /public/og/ and load correctly
 All contact info is real and monitored
 All social profile links work and lead to real branded accounts
 Privacy policy and terms are published
 Cookie banner (if applicable) shows correctly
 Google Search Console verified
 Analytics installed and firing (test with GA Debugger extension)
 favicon.ico exists and shows in browser tab
 apple-touch-icon.png exists for iOS home screen add
 manifest.json configured if PWA features desired
 Tested on real mobile devices (iPhone + Android)
 Tested on Safari, Chrome, Firefox, Edge
 Tested with slow 3G network throttling
 Tested dark mode (if applicable)
 Tested with screen reader (VoiceOver/NVDA)
 All console errors resolved (npm run build shows no warnings)
 All 404s handled (custom not-found.tsx exists)
 All errors handled (custom error.tsx exists)
 Redirects configured for any old URLs (if migrating from existing site)

📅 Project-Specific Client Data to Collect
For each project, you'll need to gather from your client before final SEO copy:

Luminelle
 Actual launch date
 Approved public description
 Approved OG imagery
 Any keywords the client wants to rank for
 Any keywords/topics to AVOID

Rhexo
 Actual launch date
 Approved public description
 Approved OG imagery
 Any keywords the client wants to rank for
 Any keywords/topics to AVOID

Éclavie
 Actual launch date
 Approved public description
 Approved OG imagery
 Any keywords the client wants to rank for
 Any keywords/topics to AVOID

Nexara
 Actual launch date
 Approved public description
 Approved OG imagery
 Any keywords the client wants to rank for
 Any keywords/topics to AVOID

Echov
 Actual launch date
 Approved public description
 Approved OG imagery
 Any keywords the client wants to rank for
 Any keywords/topics to AVOID

📝 Notes & Custom Reminders
Use this section to add your own notes, client feedback, or last-minute reminders as you work through launch.

Checklist version: 1.0
Last updated: Add date when reviewing
Maintained by: Your name

This is a living document. Update it as the project evolves.


---

## 🎯 What to do next

1. **Save this file** to your project root as `LAUNCH-CHECKLIST.md`
2. **Commit it to Git** — this belongs in version control so you and any collaborators always have the latest version
3. **Bookmark it** in your editor for quick access
4. **Check items as you complete them** — the more discipline here, the smoother your launch

---

## 🚀 Ready for the next project?

Now let's continue with **Rhexo**. Please share:

1. **`app/work/rhexo/page.tsx`**
2. **`data/rhexo.json`**

I'll deliver the same treatment: updated JSON with `seo` block (drafted from actual project content), updated `page.tsx` with `metadata` + `<Schema />` + module-level pre-computed schema, and any project-specific optimizations I spot.


```
