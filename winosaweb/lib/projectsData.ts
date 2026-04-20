export interface Project {
  id: number;
  slug: string; 
  title: string;
  description: string;
  category: "All" | "Company Web" | "Enterprise System" | "Product/Platform" | "Web Application";
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
  
  metrics?: {
    label: string;
    value: string;
  }[];
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
    
    // Project Info
    client: "Prowerty Inc",
    year: "2024",
    duration: "6 months",
    role: "Full Stack Development",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "AWS", "Tailwind CSS"],
    projectUrl: "https://prowerty.com",
    
    // Case Study
    challenge: "Traditional property marketplaces struggled with outdated interfaces and lack of real-time data. Users found it difficult to discover properties that matched their specific needs, and agents lacked efficient tools to manage listings and client interactions.",
    
    solution: "We developed a modern, AI-powered property marketplace that leverages advanced search algorithms and real-time data synchronization. The platform features virtual tours, intelligent property matching, and a comprehensive CRM system for agents. Built with Next.js for optimal performance and SEO.",
    
    result: "Within the first 3 months of launch, Prowerty saw a 150% increase in user engagement and 80% faster property discovery times. The platform now serves over 10,000 active users and has facilitated transactions worth over $50 million.",
    
    // Gallery
    gallery: [
      "/images/Prowperty2.png",
      "/images/Prowperty3.png",
    ],
    
    // Metrics
    metrics: [
      { label: "User Growth", value: "+150%" },
      { label: "Active Users", value: "10K+" },
      { label: "Transaction Value", value: "$50M+" },
      { label: "Discovery Time", value: "-80%" },
    ],
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
    technologies: ["React", "Node.js", "MongoDB", "Docker", "Redis"],
    
    challenge: "Enterprise clients needed a scalable SaaS solution to manage their operations across multiple departments. Existing tools were fragmented and didn't communicate with each other.",
    
    solution: "We built a unified platform with modular architecture allowing seamless integration across departments. The system features real-time collaboration, automated workflows, and comprehensive analytics.",
    
    result: "The platform increased operational efficiency by 60% and reduced manual tasks by 70%. Now serving 50+ enterprise clients with 99.9% uptime.",
    
    gallery: [
      "/images/saams2.png",
    ],
    
    metrics: [
      { label: "Efficiency Gain", value: "+60%" },
      { label: "Manual Tasks", value: "-70%" },
      { label: "Enterprise Clients", value: "50+" },
      { label: "Uptime", value: "99.9%" },
    ],
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
    technologies: ["Vue.js", "Python", "D3.js", "PostgreSQL"],
    
    challenge: "Business leaders struggled to make data-driven decisions due to scattered data sources and complex reporting tools.",
    
    solution: "We created an intuitive dashboard that consolidates data from multiple sources with real-time visualization and predictive analytics powered by machine learning.",
    
    result: "Decision-making time reduced by 75%. The platform now processes over 1 million data points daily and serves 500+ business users.",
    
    gallery: [
      "/images/Truexess2.png",
      "/images/Truexess3.png",
      "/images/Truexess4.png",
    ],
    
    metrics: [
      { label: "Decision Time", value: "-75%" },
      { label: "Data Points/Day", value: "1M+" },
      { label: "Active Users", value: "500+" },
    ],
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
    technologies: ["Angular", "Java", "Oracle", "Kubernetes"],
    
    challenge: "Manufacturing and distribution operations were handled manually, leading to errors and inefficiencies.",
    
    solution: "We developed an integrated management system automating inventory, logistics, and quality control with IoT sensors and AI-powered predictions.",
    
    result: "Operational errors reduced by 90%, inventory accuracy improved to 99%, and distribution efficiency increased by 65%.",
    
    gallery: [
      "/images/Crowdpie2.png",
      "/images/Crowdpie3.png",
    ],
    
    metrics: [
      { label: "Error Reduction", value: "-90%" },
      { label: "Inventory Accuracy", value: "99%" },
      { label: "Distribution Efficiency", value: "+65%" },
    ],
  },
];