export const site = {
  name: "Vaishali Media Productions LLC",
  shortName: "VMPL",
  tagline: "Growth Systems. That's Vaishali Media.",
  email: "hello@vaishalimedia.com",
  bookingLink: "#solutions",
  socials: {
    linkedin: "https://www.linkedin.com/in/vaishali-joshi-milliondollarmedia/",
    facebook: "https://www.facebook.com/vaishali.joshi.658637",
  },
} as const;

export const navItems = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "capabilities", label: "What You Get" },
  { id: "testimonials", label: "Clients" },
  { id: "solutions", label: "Solutions" },
  { id: "team", label: "Team" },
  { id: "faq", label: "FAQ" },
] as const;

export const hero = {
  eyebrow: site.tagline,
  headline: "We Build What Businesses Need To Grow.",
  subheadline: "Leads. Funnels. Advertising. Creative. Growth Systems.",
  positioning:
    "Vaishali Media Productions LLC is the company behind a growing ecosystem of brands built to help ambitious businesses solve their biggest growth challenges.",
  primaryCta: { label: "Find My Solution →", href: "#solutions" },
  secondaryCta: { label: "View Our Projects ↓", href: "#projects" },
  stats: [
    { value: 5, suffix: "+", label: "Growth Brands" },
    { value: 7, suffix: "+", label: "Years Building" },
  ],
  traits: ["Leads", "Funnels", "Ads", "Creative", "Scale"],
  bgText: "VMPL",
  headlineLines: ["We Build What", "Businesses Need", "To Grow."],
  scrollHeadline: "Need To Grow.",
} as const;

export const growthBrands = [
  {
    name: "Contractor Leads",
    href: "https://www.contractorleads.us/",
    logo: "/projects-logo/contractorleads.webp",
    image: "/projects/contractorleads.webp",
    description: "Find opportunities before your competitors do.",
    caseDescription:
      "Verified contractor leads, scored and dial-ready for agencies selling to home-service businesses.",
    tags: ["Leads", "Pipeline", "Growth"] as const,
  },
  {
    name: "Million Dollar Funnels",
    href: "https://milliondollarfunnels.us/",
    logo: "/projects-logo/milliondollarfunnel.webp",
    image: "/projects/milliondollarfunnel.webp",
    description: "Turn attention into action.",
    caseDescription:
      "High-ticket client acquisition systems that turn cold traffic into booked calls.",
    tags: ["Funnels", "Conversion", "CRO"] as const,
  },
  {
    name: "Scale With Ads",
    href: "https://scalewithads.us/",
    logo: "/projects-logo/scalewithads.webp",
    image: "/projects/scalewithads.webp",
    description: "Scale what works.",
    caseDescription:
      "Done-for-you Meta ad systems built to double revenue in 90 days.",
    tags: ["Ads", "Scale", "ROAS"] as const,
  },
  {
    name: "Million Dollar Media",
    href: "https://milliondollarmedia.us/",
    logo: "/projects-logo/milliondollarmedia.webp",
    image: "/projects/milliondollarmedia.webp",
    description: "Creative built to get attention.",
    caseDescription:
      "AI-powered video and creative production for high-ticket B2B growth.",
    tags: ["Creative", "Media", "Brand"] as const,
  },
  {
    name: "Roofing Systems",
    href: "https://roofingsystems.co/",
    logo: "/projects-logo/roofingsystem.webp",
    image: "/projects/roofing.webp",
    description: "Growth systems built for roofing businesses.",
    caseDescription:
      "Complete roofing client acquisition — ads, funnels, CRM, and booked inspections.",
    tags: ["Roofing", "Leads", "Systems"] as const,
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
      description: "Find new opportunities and build a stronger pipeline.",
      cta: "Explore Contractor Leads",
      href: brandHref("Contractor Leads"),
      brand: "Contractor Leads",
      logo: "/projects-logo/contractorleads.webp",
    },
    {
      title: "I Need More Conversions",
      description: "Turn more attention into qualified leads and customers.",
      cta: "Explore Million Dollar Funnels",
      href: brandHref("Million Dollar Funnels"),
      brand: "Million Dollar Funnels",
      logo: "/projects-logo/milliondollarfunnel.webp",
    },
    {
      title: "I Want To Scale With Ads",
      description: "Build predictable customer acquisition.",
      cta: "Explore Scale With Ads",
      href: brandHref("Scale With Ads"),
      brand: "Scale With Ads",
      logo: "/projects-logo/scalewithads.webp",
    },
    {
      title: "I Need Better Creative",
      description: "Create attention that drives action.",
      cta: "Explore Million Dollar Media",
      href: brandHref("Million Dollar Media"),
      brand: "Million Dollar Media",
      logo: "/projects-logo/milliondollarmedia.webp",
    },
    {
      title: "I Run A Roofing Business",
      description: "Explore specialized growth systems built for roofing businesses.",
      cta: "Explore Roofing Systems",
      href: brandHref("Roofing Systems"),
      brand: "Roofing Systems",
      logo: "/projects-logo/roofingsystem.webp",
    },
  ],
} as const;

export const about = {
  label: "Start Small Grow Big",
  heading: "About Us (&) Our Journey",
  intro:
    "Seven years ago we started with one belief — growth only works when every piece connects. What happened after that is easier to show than explain.",
  workedWithLabel: "We've had the opportunity to work alongside:",
  workedWith: [
    "8 & 9 Figure Business Owners",
    "ClickFunnels Two Comma Club Award Winners",
    "Hollywood Personalities",
    "Top YouTube Creators",
  ],
  timeline: [
    {
      year: "'19",
      fullYear: "2019",
      title: "The Beginning",
      teaser:
        "Vaishali Media Productions LLC was founded with a simple belief: businesses deserve growth systems that actually work together.",
      full:
        "In 2019, we set out to build something different — not just another agency, but a company that understands how leads, creative, advertising, and funnels connect. The foundation was laid with a focus on delivering real results for ambitious businesses who were tired of disconnected vendors.",
      attribution: "@vaishalimedia",
      timeAgo: "7 years ago",
      side: "right" as const,
    },
    {
      year: "'20",
      fullYear: "2020",
      title: "First Real Clients",
      teaser:
        "The first projects that proved the model. Panic, late nights, and the kind of learning you only get when someone is counting on you.",
      full:
        "Practicing ideas was comfortable. Serving real businesses was not. That first year of client work taught us more than any playbook — because every pixel, every funnel step, and every ad dollar suddenly mattered to someone else's livelihood.",
      attribution: "@vaishalimedia",
      timeAgo: "6 years ago",
      side: "left" as const,
    },
    {
      year: "'21",
      fullYear: "2021",
      title: "First Growth Systems",
      teaser:
        "We launched our first specialized brands, learning what it takes to solve specific growth challenges at scale.",
      full:
        "By 2021, we had expanded beyond a single service into specialized growth systems. Each brand was built to solve one problem exceptionally well — because we learned that generic solutions don't scale businesses.",
      attribution: "@vaishalimedia",
      timeAgo: "5 years ago",
      side: "right" as const,
    },
    {
      year: "'22",
      fullYear: "2022",
      title: "Creative Meets Conversion",
      teaser:
        "Ads without creative die. Creative without a system waste attention. This was the year both became inseparable.",
      full:
        "We stopped treating media and funnels as separate lanes. Campaigns, creative, and conversion paths started living as one connected system — the seed of what would become Million Dollar Media and Million Dollar Funnels.",
      attribution: "@vaishalimedia",
      timeAgo: "4 years ago",
      side: "left" as const,
    },
    {
      year: "'23",
      fullYear: "2023",
      title: "The Ecosystem Takes Shape",
      teaser:
        "Multiple brands working together, serving businesses from lead generation to conversion and scale.",
      full:
        "The ecosystem model proved itself. Businesses no longer needed five different vendors — they could find the right solution within one connected network of growth brands, each built on years of hands-on experience.",
      attribution: "@vaishalimedia",
      timeAgo: "3 years ago",
      side: "right" as const,
    },
    {
      year: "'24",
      fullYear: "2024",
      title: "Trust Turns Into Referrals",
      teaser:
        "No pitch decks required. Clients started sending people our way with one line: work with Vaishali Media.",
      full:
        "That kind of trust isn't something you put in a case study. It's the outcome of showing up, connecting the pieces, and shipping results that speak louder than marketing claims.",
      attribution: "@vaishalimedia",
      timeAgo: "2 years ago",
      side: "left" as const,
    },
    {
      year: "'26",
      fullYear: "2026",
      title: "The Journey Continues",
      teaser:
        "Seven years in. Five brands. One mission — helping ambitious businesses grow with systems that connect.",
      full:
        "Today, Vaishali Media Productions LLC sits at the center of a growing ecosystem. We've worked alongside 8 and 9 figure business owners, award-winning entrepreneurs, and industry leaders — and the best work is still ahead.",
      attribution: "@vaishalimedia",
      timeAgo: "now",
      side: "right" as const,
    },
  ],
} as const;

export const experience = {
  label: "Our Story",
  heading: "Built Through Experience.",
  founded: "Founded In 2019.",
  intro:
    "What started as a single focus has grown into a full ecosystem of growth solutions — each brand solving a specific challenge businesses face every day.",
  timeline: about.timeline,
  workedWith: about.workedWith,
} as const;

export const projectsSection = {
  label: "Projects",
  heading: "Personal Projects I've Built.",
  description:
    "Growth brands and websites I've created — each built to solve a specific business challenge.",
  cta: { label: "Explore Projects →", href: "#projects" },
  projects: growthBrands.map((brand, i) => ({
    index: String(i + 1).padStart(2, "0"),
    name: brand.name,
    description: brand.caseDescription,
    tags: [...brand.tags],
    href: brand.href,
    image: brand.image,
  })),
} as const;

export const capabilities = {
  label: "What You Get?",
  eyebrow: "Capabilities Overview",
  parts: [
    { type: "text", content: "Leads, creative, and" },
    { type: "pill", icon: "◈", label: "Systems" },
    { type: "text", content: "combined — turning" },
    { type: "pill", icon: "◎", label: "Strategy" },
    { type: "text", content: "your growth challenges into connected brands that" },
    { type: "pill", icon: "★", label: "Scale" },
    { type: "text", content: "feel effortless to run." },
  ],
} as const;

export const testimonials = {
  label: "Testimonials",
  heading: "From People We've Worked With",
  items: [
    {
      headline: "Trusted long-term collaborator.",
      quote:
        "Vaishali Media doesn't just deliver assets — they think in systems. Every funnel, ad, and creative piece connects back to the bigger growth picture.",
      name: "Darrell Stern",
      role: "Webinar Scaling Coach",
      href: "https://milliondollarmedia.us/",
      initials: "DS",
    },
    {
      headline: "Results that compound.",
      quote:
        "We went from scattered vendors to one ecosystem that actually talks to itself. Leads, creative, and conversion finally move in the same direction.",
      name: "Pierce Grimes",
      role: "7 Figure Agency Owner",
      href: "https://milliondollarmedia.us/",
      initials: "PG",
    },
    {
      headline: "Creative that converts.",
      quote:
        "The team ships fast without sacrificing quality. Our ad creative refresh alone changed how efficiently we scale campaigns month over month.",
      name: "Tim Burd",
      role: "9 Figure Agency Owner",
      href: "https://milliondollarmedia.us/",
      initials: "TB",
    },
    {
      headline: "Built for operators.",
      quote:
        "Contractor Leads changed how our desk works — scored leads, outreach scripts, and a pipeline we actually trust instead of another stale list.",
      name: "Vaishali Kapoor",
      role: "Founder, Contractor Leads",
      href: "https://www.contractorleads.us/",
      initials: "VK",
    },
    {
      headline: "Systems over shortcuts.",
      quote:
        "Roofing Systems installed a full acquisition engine — not just ads. Booked inspections went up because the whole journey finally made sense.",
      name: "Growth Partner",
      role: "Roofing Systems Co.",
      href: "https://roofingsystems.co/",
      initials: "RS",
    },
    {
      headline: "Funnels that finally scale.",
      quote:
        "Million Dollar Funnels rebuilt our backend so low-ticket and high-ticket offers work together. Revenue became predictable instead of chaotic.",
      name: "Gaurav Kapoor",
      role: "Million Dollar Funnels",
      href: "https://milliondollarfunnels.us/",
      initials: "GK",
    },
  ],
} as const;

export const team = {
  label: "Our People",
  heading: "The People Behind The Work.",
  description:
    "Meet the people building, creating, and growing the Vaishali Media ecosystem.",
  cta: { label: "Meet The Team →", href: "#team" },
  members: [
    {
      name: "Vaishali Kapoor",
      role: "Founder",
      image: "/team/vaishali.jpeg",
      bio: "Building the vision behind Vaishali Media and the growth brands in the ecosystem.",
    },
    {
      name: "Gaurav Kapoor",
      role: "Co-Founder",
      image: "/team/gaurav.jpeg",
      bio: "Partnering on strategy, operations, and scaling the business across every brand.",
    },
    {
      name: "Taqi Jafar",
      role: "Graphic Designer",
      image: "/team/Taqi.jpeg",
      bio: "Crafting visual identity and creative assets that make every campaign stand out.",
    },
    {
      name: "Ali Jawed",
      role: "Video Editor",
      image: "/team/Ali.jpeg",
      bio: "Turning raw footage into polished video content that drives attention and action.",
    },
  ],
} as const;

export const faq = {
  displayText: "VMPL",
  label: "FAQ",
  heading: "Got any questions?",
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
        "Reach out at hello@vaishalimedia.com or use the Find My Solution button. Tell us where you want to grow — we'll help you identify the right entry point in the VMPL ecosystem.",
    },
  ],
} as const;

export const projectLogos = growthBrands.map((brand) => ({
  src: brand.logo,
  alt: brand.name,
  href: brand.href,
}));

export const clientLogos = projectLogos.map((logo) => logo.alt);
