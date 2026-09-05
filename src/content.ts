export const site = {
  name: "Vaishali Media Productions LLC",
  shortName: "VMPL",
  tagline: "Growth Systems. That's Vaishali Media.",
  email: "info@vaishalimediaproductionsllc.com",
  bookingLink: "#solutions",
  socials: {
    linkedin: "https://www.linkedin.com/in/vaishali-joshi-milliondollarmedia/",
    facebook: "https://www.facebook.com/vaishali.joshi.658637",
  },
} as const;

/** Order matches page sections top → bottom */
export const navItems = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "capabilities", label: "What You Get" },
  { id: "testimonials", label: "Clients" },
  { id: "solutions", label: "Solutions" },
  { id: "team", label: "Team" },
  { id: "connect", label: "Connect" },
  { id: "faq", label: "FAQ" },
] as const;

export const navSectionIds = navItems.map((n) => n.id);

export const hero = {
  eyebrow: site.tagline,
  headline: "We Build What Businesses Need To Grow.",
  subheadline: "Leads. Funnels. Advertising. Creative. Growth Systems.",
  positioning:
    "Vaishali Media Productions LLC is the company behind a growing ecosystem of brands built to help ambitious businesses solve their biggest growth challenges.",
  primaryCta: { label: "Find My Solution", href: "#solutions" },
  secondaryCta: { label: "View Projects", href: "#projects" },
  stats: [
    { value: "50", suffix: "M+", label: "Spent In Meta Ads" },
    { value: 12, suffix: "+", label: "Years of Experience" },
  ],
  traits: ["Leads", "Funnels", "Ads", "Creative", "Scale"],
  bgText: "VAISHALI",
  headlineLines: ["We Build What", "Businesses Need", "To Grow."],
  scrollHeadline: "Need To Grow.",
} as const;

export const growthBrands = [
  {
    name: "Million Dollar Media",
    href: "https://milliondollarmedia.us/",
    logo: "/projects-logo/milliondollarmedia.webp",
    image: "/projects/milliondollarmedia.webp",
    bg: "/projects/bg/milliondollarmedia.svg",
    video: "/videos/milliondollarmedia.mp4",
    badge: "Creative Systems",
    description: "Creative built to get attention.",
    caseDescription:
      "AI-powered video and creative production for high-ticket B2B growth.",
    tags: ["Creative", "Media", "Brand"] as const,
  },
  {
    name: "Scale With Ads",
    href: "https://scalewithads.us/",
    logo: "/projects-logo/scalewithads.webp",
    image: "/projects/scalewithads.webp",
    bg: "/projects/bg/scalewithads.svg",
    video: "/videos/scalewithads.mp4",
    badge: "Paid Acquisition",
    description: "Scale what works.",
    caseDescription:
      "Done-for-you Meta ad systems built to double revenue in 90 days.",
    tags: ["Ads", "Scale", "ROAS"] as const,
  },
  {
    name: "Million Dollar Funnels",
    href: "https://milliondollarfunnels.us/",
    logo: "/projects-logo/milliondollarfunnel.webp",
    image: "/projects/milliondollarfunnel.webp",
    bg: "/projects/bg/milliondollarfunnel.svg",
    video: "/videos/milliondollarfunnel.mp4",
    badge: "Conversion Architecture",
    description: "Turn attention into action.",
    caseDescription:
      "High-ticket client acquisition systems that turn cold traffic into booked calls.",
    tags: ["Funnels", "Conversion", "CRO"] as const,
  },
  {
    name: "Contractor Leads",
    href: "https://www.contractorleads.us/",
    logo: "/projects-logo/contractorleads.webp",
    image: "/projects/contractorleads.webp",
    bg: "/projects/bg/contractorleads.svg",
    video: "/videos/contractorleads.mp4",
    badge: "Leads & Pipeline",
    description: "Find opportunities before your competitors do.",
    caseDescription:
      "Verified contractor leads, scored and dial-ready for agencies selling to home-service businesses.",
    tags: ["Leads", "Pipeline", "Growth"] as const,
  },
] as const;

const brandHref = (name: string) =>
  growthBrands.find((b) => b.name === name)?.href ?? "#projects";

export const solutions = {
  label: "Start Here",
  heading: "What Are You Looking To Solve?",
  description:
    "Choose the challenge closest to where you are — we'll connect you to the right growth brand.",
  items: [
    {
      title: "I Need More Leads",
      description:
        "Verified contractor opportunities, scored and dial-ready — so your team stops chasing cold lists.",
      outcomes: ["Verified leads", "Scored pipeline", "Outreach-ready"] as const,
      cta: "Explore Contractor Leads",
      href: brandHref("Contractor Leads"),
      brand: "Contractor Leads",
      logo: "/projects-logo/contractorleads.webp",
      image: "/projects/contractorleads.webp",
      bg: "/projects/bg/contractorleads.svg",
    },
    {
      title: "I Need More Conversions",
      description:
        "Funnel, CRM, and follow-up systems that turn attention into booked calls and paying clients.",
      outcomes: ["High-ticket funnels", "CRM + automation", "Booked calls"] as const,
      cta: "Explore Million Dollar Funnels",
      href: brandHref("Million Dollar Funnels"),
      brand: "Million Dollar Funnels",
      logo: "/projects-logo/milliondollarfunnel.webp",
      image: "/projects/milliondollarfunnel.webp",
      bg: "/projects/bg/milliondollarfunnel.svg",
    },
    {
      title: "I Want To Scale With Ads",
      description:
        "Done-for-you Meta systems built to scale what already works — with creative and buying in sync.",
      outcomes: ["Meta ads", "Creative testing", "Predictable ROAS"] as const,
      cta: "Explore Scale With Ads",
      href: brandHref("Scale With Ads"),
      brand: "Scale With Ads",
      logo: "/projects-logo/scalewithads.webp",
      image: "/projects/scalewithads.webp",
      bg: "/projects/bg/scalewithads.svg",
    },
    {
      title: "I Need Better Creative",
      description:
        "AI-powered video and creative production that stops the scroll and drives high-ticket action.",
      outcomes: ["AI video", "Ad creatives", "Fast turnaround"] as const,
      cta: "Explore Million Dollar Media",
      href: brandHref("Million Dollar Media"),
      brand: "Million Dollar Media",
      logo: "/projects-logo/milliondollarmedia.webp",
      image: "/projects/milliondollarmedia.webp",
      bg: "/projects/bg/milliondollarmedia.svg",
    },
  ],
} as const;

export const about = {
  label: "Our Journey",
  heading: "We Never Planned To Build An Ecosystem",
  headingLines: ["We Never Planned", "To Build An Ecosystem"] as const,
  intro:
    "It happened one problem at a time. Every new brand began with a client saying, “We need help with this too”—and us realizing the industry was leaving another important gap unsolved.",
  closingTitle: "Built From Real Problems",
  closing:
    "None of these brands began as a business expansion plan. Each one started with a real conversation, a recurring frustration, and a problem we could no longer ignore. What began as an attempt to improve the industry has grown into one connected ecosystem—built to own the entire journey, not just one small piece of it.",
  workedWithLabel: "We've had the opportunity to work alongside:",
  workedWith: [
    "8 & 9 Figure Business Owners",
    "ClickFunnels Two Comma Club Award Winners",
    "Hollywood Personalities",
    "Top YouTube Creators",
  ],
  timeline: [
    {
      year: "14–19",
      fullYear: "2014–19",
      title: "The Problem I Couldn’t Ignore",
      teaser:
        "Five years across three agencies. Same lines every time: we only manage the ads, creatives aren’t included, we don’t handle funnels.",
      full:
        "Clients were left coordinating multiple teams, repeating the same brief, and still had no one responsible for the final result. I knew there had to be a better way—one team accountable for the outcome, not another handoff.",
      attribution: "@vaishalimedia",
      timeAgo: "the early years",
      side: "right" as const,
    },
    {
      year: "'19",
      fullYear: "2019",
      title: "Million Dollar Media Was Born",
      teaser:
        "The first problem was creative. Campaigns stalled without content—or got beautiful ads that simply didn’t sell.",
      full:
        "So we launched Million Dollar Media to create content with a purpose: stop the scroll, communicate value, and move people to act. Creative stopped being decoration and became the engine of the campaign.",
      attribution: "@vaishalimedia",
      timeAgo: "7 years ago",
      side: "left" as const,
    },
    {
      year: "'20",
      fullYear: "2020",
      title: "Clients Gave Us More Than Business",
      teaser:
        "Our first clients gave us their trust—and that trust came with responsibility.",
      full:
        "There were long nights, difficult lessons, and moments when giving up would have been easier. Every result strengthened our belief that businesses needed partners who cared about the complete outcome, not a single deliverable.",
      attribution: "@vaishalimedia",
      timeAgo: "6 years ago",
      side: "left" as const,
    },
    {
      year: "'21",
      fullYear: "2021",
      title: "Scale With Ads Was Born",
      teaser:
        "Creatives were ready—but who would run the campaigns and scale them?",
      full:
        "Sending clients to another agency would have recreated the same fragmented problem we set out to solve. Scale With Ads was launched to connect powerful creative with strategy, media buying, and measurable growth.",
      attribution: "@vaishalimedia",
      timeAgo: "5 years ago",
      side: "right" as const,
    },
    {
      year: "22–23",
      fullYear: "2022–23",
      title: "The Next Missing Piece",
      teaser:
        "Ads were generating clicks and leads—but weak pages and broken follow-ups were costing conversions.",
      full:
        "Traffic was arriving, yet disconnected customer journeys were leaking results. The campaign wasn’t always the problem. What happened after the click was—and that gap became impossible to ignore.",
      attribution: "@vaishalimedia",
      timeAgo: "3–4 years ago",
      side: "left" as const,
    },
    {
      year: "'24",
      fullYear: "2024",
      title: "Million Dollar Funnels Was Born",
      teaser:
        "We built conversion systems—not just pretty pages—that turn attention into customers.",
      full:
        "Million Dollar Funnels connected funnels, CRM, automation, follow-ups, and sales journeys into one path. The goal was simple: turn attention into qualified leads and paying customers, end to end.",
      attribution: "@vaishalimedia",
      timeAgo: "2 years ago",
      side: "left" as const,
    },
    {
      year: "'26",
      fullYear: "2026",
      title: "Contractor Leads Was Born",
      teaser:
        "We could advertise, create, and convert—but one question kept coming back: how do we find the right prospects?",
      full:
        "Contractor Leads was built to close that final gap—helping agencies discover, verify, and reach high-potential prospects through one AI-powered platform. The ecosystem finally covered the full journey.",
      attribution: "@vaishalimedia",
      timeAgo: "now",
      side: "left" as const,
    },
  ],
} as const;

export const experience = {
  label: "Our Story",
  heading: "Built Through Experience.",
  founded: "Founded In 2019.",
  intro:
    "What started as one unsolved problem has grown into a full ecosystem of growth solutions — each brand born from a real client gap we could no longer ignore.",
  timeline: about.timeline,
  workedWith: about.workedWith,
} as const;

export const projectsSection = {
  label: "Projects",
  heading: "One Ecosystem.\nMultiple Growth Solutions.",
  headingLines: ["One Ecosystem.", "Multiple Growth Solutions."] as const,
  description:
    "Explore the specialized engines driving predictable revenue, customer acquisition, and market leadership across the VMPL network.",
  cta: { label: "Explore Projects →", href: "#projects" },
  projects: growthBrands.map((brand, i) => ({
    index: String(i + 1).padStart(2, "0"),
    name: brand.name,
    description: brand.caseDescription,
    badge: brand.badge,
    tags: [...brand.tags],
    href: brand.href,
    logo: brand.logo,
    image: brand.image,
    bg: brand.bg,
    video: brand.video,
  })),
} as const;

export const capabilities = {
  label: "Capabilities Overview",
  headingLines: ["What", "You Get?"],
  /** Large lead copy - glass chips sit between these text segments */
  lead: [
    { type: "text", value: "Strategy, precision, and " },
    { type: "chip", id: "systems" },
    { type: "text", value: " development combined, turning " },
    { type: "chip", id: "strategy" },
    { type: "text", value: " your vision into a powerful " },
    { type: "chip", id: "creative" },
    { type: "text", value: " digital experience " },
    { type: "chip", id: "media" },
    { type: "text", value: " that feels effortless." },
    { type: "chip", id: "scale" },
  ],
  chips: [
    {
      id: "systems",
      label: "Systems",
      title: "Connected Growth Systems",
      copy: "An ecosystem of brands that plug into each other, so every lead, funnel, and creative piece compounds.",
    },
    {
      id: "strategy",
      label: "Strategy",
      title: "Clear Growth Strategy",
      copy: "Clear paths from attention to revenue. No disconnected vendors. One growth picture.",
    },
    {
      id: "creative",
      label: "Creative",
      title: "Creative That Converts",
      copy: "Attention-getting creative built to drive action, not just look good in a deck.",
    },
    {
      id: "media",
      label: "Media",
      title: "Paid Media & Acquisition",
      copy: "Meta ads and acquisition systems designed for predictable pipeline, not one-off spikes.",
    },
    {
      id: "scale",
      label: "Scale",
      title: "Built To Scale",
      copy: "Ads, creative, and conversion built to grow with you, not restart every quarter.",
    },
  ],
} as const;

export const testimonials = {
  label: "Testimonials",
  heading: "From People We've Worked With",
  description:
    "Real conversations from clients — tap any clip for sound.",
  items: [
    {
      id: "portrait-1",
      src: "/testimonials/portrait-1.mp4",
      width: 720,
      height: 1280,
      label: "Client story",
    },
    {
      id: "landscape-1",
      src: "/testimonials/landscape-1.mp4",
      width: 1280,
      height: 720,
      label: "Client story",
    },
    {
      id: "portrait-2",
      src: "/testimonials/portrait-2.mp4",
      width: 720,
      height: 1280,
      label: "Client story",
    },
    {
      id: "landscape-2",
      src: "/testimonials/landscape-2.mp4",
      width: 1280,
      height: 720,
      label: "Client story",
    },
    {
      id: "square-1",
      src: "/testimonials/square-1.mp4",
      width: 720,
      height: 720,
      label: "Client story",
    },
    {
      id: "landscape-3",
      src: "/testimonials/landscape-3.mp4",
      width: 1280,
      height: 720,
      label: "Client story",
    },
  ],
} as const;

export const team = {
  label: "Our People",
  heading: "The People Behind The Work.",
  description:
    "One connected team across creative, media, funnels, and growth — building the Vaishali Media ecosystem together.",
  cta: { label: "Work With Us →", href: "#solutions" },
  /** Hierarchy: founders together on top, then the rest of the team below */
  levels: [
    [
      {
        name: "Vaishali Kapoor",
        role: "Founder",
        image: "/vaishali-kapoor.png",
        bio: "Vision behind Vaishali Media and the full growth ecosystem.",
      },
      {
        name: "Gaurav Kapoor",
        role: "Co-Founder",
        image: "/team/gaurav.jpeg",
        bio: "Strategy, operations, and scaling across every brand.",
      },
    ],
    [
      {
        name: "Shourya Dahiya",
        role: "Business Development Lead",
        image: "/team/shourya-dahiya.png",
        bio: "Building relationships and opening doors for new growth partnerships.",
      },
      {
        name: "Daniel Brooks",
        role: "Partnership Development",
        image: "/team/daniel-brooks.png",
        bio: "Connecting prospects to the right solution across the VMPL ecosystem.",
      },
      {
        name: "Ethan Carter",
        role: "Client Acquisition",
        image: "/team/ethan-carter.png",
        bio: "Driving outreach and conversations that turn interest into clients.",
      },
    ],
    [
      {
        name: "Frank Miller",
        role: "Growth Partnerships",
        image: "/team/frank-miller.png",
        bio: "Guiding new opportunities from first touch to signed partnership.",
      },
      {
        name: "Jake Wilson",
        role: "Business Development",
        image: "/team/jake-wilson.png",
        bio: "Expanding the pipeline with focused business development.",
      },
      {
        name: "Ryan Cooper",
        role: "Sales Development",
        image: "/team/ryan-cooper.png",
        bio: "Finding and qualifying the next high-fit clients for the team.",
      },
    ],
    [
      {
        name: "Taqi Jafar",
        role: "Creative Lead",
        image: "/team/taqi.jpeg",
        bio: "Visual identity and creative that makes campaigns stand out.",
      },
      {
        name: "Ali Jawed",
        role: "Video Editor",
        image: "/team/ali.jpeg",
        bio: "Video that stops the scroll and drives action.",
      },
    ],
  ],
} as const;

export const statementSection = {
  id: "connect",
  solidLines: ["Transform Your", "Growth"] as const,
  ghostLines: ["Experience", "Journey"] as const,
  description:
    "From leads and funnels to ads and creative, Vaishali Media builds connected systems that turn attention into revenue, then keep compounding.",
  prompt: "Have something in mind?",
  cta: { label: "Let's Talk", href: "#solutions" },
  portrait: "/vaishali-kapoor.png",
  portraitAlt: "Vaishali Kapoor",
} as const;

/** Named clients from Million Dollar Media — photos + copy matched 1:1 from live site */
export const featuredClients = [
  {
    name: "Darrell Stern",
    role: "Webinar Scaling Coach",
    meta: "19K Followers",
    image: "/clients/client-darrell-stern.jpg",
  },
  {
    name: "Pierce Grimes",
    role: "7 Figure Agency Owner",
    meta: "Two Comma Club Winner",
    image: "/clients/client-pierce-grimes.webp",
  },
  {
    name: "Officer Baker",
    role: "Hollywood Celebrity",
    meta: "1.5M Followers",
    image: "/clients/client-officer-baker.jpg",
  },
  {
    name: "Jesse Rogers | Casper SMC",
    role: "Online Trading Coach",
    meta: "537K subscribers",
    image: "/clients/client-jesse-rogers-casper-smc.webp",
  },
  {
    name: "Tim Burd",
    role: "9 figure Agency Owner",
    meta: "101K Followers",
    image: "/clients/client-tim-burd.webp",
  },
  {
    name: "Dr. Amy",
    role: "Cancer Researcher",
    meta: "259K Subscribers",
    image: "/clients/client-dr-amy.webp",
  },
  {
    name: "Travis Stephenson",
    role: "9 Figure Agency Owner",
    meta: "114k Followers",
    image: "/clients/client-travis-stephenson.webp",
  },
  {
    name: "Dr. Bea. Kinderaerztin",
    role: "Pediatrician",
    meta: "144k Followers",
    image: "/clients/client-dr-bea-kinderaerztin.jpg",
  },
  {
    name: "Steven Juergensen",
    role: "Founder @ Vedgenutrition",
    meta: "87k Followers",
    image: "/clients/client-steven-juergensen.jpg",
  },
  {
    name: "Rafael Cintron",
    role: "E-commerce Coach",
    meta: "55.7K Subscribers",
    image: "/clients/client-rafael-cintron.jpg",
  },
  {
    name: "Sarah Grace Fitness",
    role: "NPC Figure Competitor",
    meta: "94K Followers",
    image: "/clients/client-sarah-grace-fitness.jpg",
  },
  {
    name: "Mark Shay",
    role: "Agency Owner & Coach",
    meta: "29.8k Followers",
    image: "/clients/client-mark-shay.jpg",
  },
  {
    name: "Jared Van Yperen",
    role: "Founder @ Vintage Muscle",
    meta: "21k Followers",
    image: "/clients/client-jared-van-yperen.jpg",
  },
  {
    name: "M Mahdi Syed",
    role: "Business Scaling Coach",
    meta: "Two Comma Club Winner",
    image: "/clients/client-m-mahdi-syed.jpg",
  },
  {
    name: "Aref Jomah",
    role: "7 Figure Agency Scaling Coach",
    meta: "Two Comma Club Winner",
    image: "/clients/client-aref-jomah.jpg",
  },
  {
    name: "Jimmy Rutkowsky",
    role: "7 Figure Agency Owner",
    meta: "7.2K Followers",
    image: "/clients/client-jimmy-rutkowsky.webp",
  },
  {
    name: "Marie Grace Berg",
    role: "Agency Owner",
    meta: "7K Followers",
    image: "/clients/client-marie-grace-berg.jpg",
  },
] as const;

export const faq = {
  displayText: "VMPL",
  label: "FAQ",
  heading: "Got any questions?",
  /** Client portraits used inside the giant VMPL letter mask */
  clientImages: featuredClients.map((c) => c.image),
  items: [
    {
      question: "What does Vaishali Media Productions actually do?",
      answer:
        "We build and run growth systems — leads, funnels, advertising, and creative — through a connected ecosystem of brands. VMPL is the parent company; each brand solves a specific growth challenge.",
    },
    {
      question: "Which brand in your ecosystem should I start with?",
      answer:
        "It depends on your biggest bottleneck. Need leads? Start with Contractor Leads. Need conversions? Million Dollar Funnels. Scaling ads? Scale With Ads. Not sure? Use Find My Solution and we'll point you the right way.",
    },
    {
      question: "Do you work with businesses outside your niche brands?",
      answer:
        "Yes. While each brand has a focus, the team behind VMPL works with ambitious businesses across industries — especially when growth needs leads, creative, ads, and funnels working together.",
    },
    {
      question: "What's the process from first conversation to launch?",
      answer:
        "We start by understanding your goal and matching you to the right solution in the ecosystem. From there, we scope the work, build or optimize your system, launch, and iterate based on real performance data.",
    },
    {
      question: "Do you handle creative, ads, and funnels together?",
      answer:
        "That's the point of the ecosystem. Creative lives under Million Dollar Media, funnels under Million Dollar Funnels, ads under Scale With Ads, and leads under Contractor Leads — all connected under one roof.",
    },
    {
      question: "What does ongoing support look like?",
      answer:
        "Support depends on the brand and scope — from done-for-you management to strategic guidance. Most clients stay long-term because the systems compound: better creative, better conversion, better scale.",
    },
    {
      question: "How do you measure results?",
      answer:
        "We track what matters for each engagement: lead volume and quality, cost per acquisition, conversion rates, booked calls, and revenue impact. Every project ties back to measurable business outcomes.",
    },
    {
      question: "Not sure where to start?",
      answer:
        "Reach out at info@vaishalimediaproductionsllc.com or use the Find My Solution button. Tell us where you want to grow — we'll help you identify the right entry point in the VMPL ecosystem.",
    },
  ],
} as const;

export const projectLogos = growthBrands.map((brand) => ({
  src: brand.logo,
  alt: brand.name,
  href: brand.href,
}));

/** Client logos for the sidebar marquee (`public/client-logo`) */
export const sidebarClientLogos = [
  "/client-logo/logo-01.png",
  "/client-logo/logo-02.png",
  "/client-logo/logo-03.png",
  "/client-logo/logo-04.png",
  "/client-logo/logo-05.png",
  "/client-logo/logo-06.png",
  "/client-logo/logo-07.png",
  "/client-logo/logo-08.png",
  "/client-logo/logo-10.png",
  "/client-logo/logo-11.png",
  "/client-logo/logo-12.png",
  "/client-logo/logo-13.png",
  "/client-logo/logo-15.png",
  "/client-logo/logo-16.png",
  "/client-logo/logo-17.png",
  "/client-logo/logo-18.png",
  "/client-logo/logo-19.png",
  "/client-logo/logo-20.png",
  "/client-logo/logo-21.png",
  "/client-logo/logo-22.png",
] as const;
