
/* =========================
   SERVICES DATA
========================= */

export const servicesData = [
  {
    id: 1,
    title: "Software Development",
    desc: "We design and develop scalable, secure, and high-performance web systems tailored to your business needs. From corporate websites to enterprise-grade platforms, our solutions are built using modern architecture and best engineering practices to ensure long-term reliability.",
    icon: "monitor",
    slug: "/Services/web-development",
  },
  {
    id: 2,
    title: "IT Consulting",
    desc: "Our IT consulting services help businesses define technical strategies, evaluate system architecture, choose the right digital stack, and plan sustainable technology roadmaps aligned with business growth objectives.",
    icon: "briefcase",
  },
  {
    id: 3,
    title: "Mobile App Development",
    desc: "We build custom Android and iOS applications focused on usability, scalability, and performance. Our apps integrate seamlessly with backend systems while delivering smooth user experiences.",
    icon: "smartphone",
    slug: "/Services/mobile-app",
  },
  {
    id: 4,
    title: "Cloud Solutions",
    desc: "From infrastructure setup to monitoring and cost optimization, we implement reliable cloud environments designed for scalability, high availability, and operational efficiency.",
    icon: "cloud",
  },
  {
    id: 5,
    title: "UI/UX Design",
    desc: "We create intuitive interfaces, strong design systems, interactive prototypes, and data-driven user experiences that enhance engagement and improve product usability.",
    icon: "palette",
    slug: "/Services/ui-ux-design",
  },
  {
    id: 6,
    title: "Cyber Security & Outsourcing",
    desc: "Our security services include system audits, penetration testing, vulnerability analysis, and dedicated IT resource outsourcing to ensure your digital infrastructure remains protected and efficient.",
    icon: "shield",
  },
];



/* =========================
   PORTFOLIO DATA
========================= */

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  heroImage: string;
  client: string;
  year: string;
  duration?: string;
  role?: string;
  technologies: string[];
  projectUrl?: string;
  challenge: string;
  solution: string;
  result: string;
  gallery: string[];
}


export const projects: Project[] = [
  {
    id: 1,
    slug: "prowerty",
    title: "Prowerty",
    description: "Platform marketplace untuk property",
    category: "Web Application",
    image: "/images/Prowperty.png",
    heroImage: "/images/Prowperty.png",
    client: "Prowerty Inc",
    year: "2024",
    duration: "6 months",
    role: "Full Stack Development",
    technologies: ["Next.js","TypeScript","PostgreSQL","AWS","Tailwind CSS"],
    projectUrl: "https://prowerty.com",
    challenge: "Traditional property marketplaces struggled with outdated interfaces.",
    solution: "Modern AI-powered marketplace with real-time sync.",
    result: "150% increase in engagement.",
    gallery: ["/images/Prowperty2.png","/images/Prowperty3.png"],
  },
  {
    id: 2,
    slug: "saams-platform",
    title: "SAAMS Platform",
    description: "Enterprise solution for business",
    category: "Company Web",
    image: "/images/saams.png",
    heroImage: "/images/saams.png",
    client: "Enterprise Corp",
    year: "2023",
    duration: "8 months",
    role: "Lead Developer",
    technologies: ["React","Node.js","MongoDB"],
    challenge: "Needed scalable SaaS solution.",
    solution: "Unified modular system.",
    result: "60% efficiency increase.",
    gallery: ["/images/saams2.png"],
  },
  {
    id: 3,
    slug: "enterprise-dashboard",
    title: "Truexess",
    description: "Data analytics platform",
    category: "Enterprise System",
    image: "/images/Truexess.png",
    heroImage: "/images/Truexess.png",
    client: "Tech Solutions",
    year: "2023",
    duration: "4 months",
    role: "Frontend Lead",
    technologies: ["Vue.js","Python","PostgreSQL"],
    challenge: "Data scattered across systems.",
    solution: "Centralized dashboard.",
    result: "75% faster decision making.",
    gallery: ["/images/Truexess2.png"],
  },
  {
    id: 4,
    slug: "ndpie-system",
    title: "Crowdpie",
    description: "Management system",
    category: "Product/Platform",
    image: "/images/Crowdpie.png",
    heroImage: "/images/Crowdpie.png",
    client: "NDPIE Group",
    year: "2024",
    duration: "12 months",
    role: "System Architect",
    technologies: ["Angular","Java","Oracle"],
    challenge: "Manual operations inefficient.",
    solution: "Automated integrated system.",
    result: "90% error reduction.",
    gallery: ["/images/Crowdpie2.png"],
  },
];


/* =========================
   BLOG DATA
========================= */

export interface Blog {
  id: number;
  title: string;
  desc: string;
  image: string;
  category: string;
  slug: string;
}

export const blogData: Blog[] = [
  {
    id: 1,
    title: "Where Technology, Design, and Stories Meet",
    desc: "Exploring the intersection between technology innovation and user experience design.",
    image: "/bg/bg1.jpg",
    category: "Insight",
    slug: "technology-design-stories",
  },
  {
    id: 2,
    title: "Digital Future of Business",
    desc: "How digital transformation reshapes modern enterprises.",
    image: "/bg/bg1.jpg",
    category: "Design",
    slug: "digital-future-business",
  },
  {
    id: 3,
    title: "How Technology Shapes UX",
    desc: "Understanding how engineering decisions impact user experience.",
    image: "/bg/bg1.jpg",
    category: "Insight",
    slug: "technology-shapes-ux",
  },
  {
    id: 4,
    title: "Building Scalable Products",
    desc: "Architecture principles behind scalable digital systems.",
    image: "/bg/bg1.jpg",
    category: "Tech",
    slug: "building-scalable-products",
  },
];
