/**
 * Single source of truth for portfolio content.
 * Facts come from the owner's brief and the public GitHub repositories.
 * Keep copy factual: no invented metrics, roles or achievements.
 */
import greenPreview from "@/assets/greentogether-preview.webp.asset.json";
import diagnoPreview from "@/assets/diagnofra-preview.webp.asset.json";

export const profile = {
  name: "MD Soheb Ansari",
  shortName: "Soheb",
  role: "Computer Science undergraduate, aspiring Software Developer",
  location: "Durgapur, West Bengal, India",
  email: "mdsohebansari0404@gmail.com",
  github: "https://github.com/Soheb04-git",
  linkedin: "https://www.linkedin.com/in/md-soheb-ansari-608a52291/",
};

/**
 * Original PDFs. Set `href` to "/documents/<file>.pdf" once the files are
 * placed in public/documents. While `href` is null the UI shows a clearly
 * marked "file pending" state instead of a broken download.
 */
export const documents: {
  cv: { label: string; href: string | null; filename: string };
  resume: { label: string; href: string | null; filename: string };
} = {
  cv: { label: "Download CV", href: null, filename: "Soheb CV.pdf" },
  resume: { label: "Download Resume", href: null, filename: "Md Soheb Ansari.pdf" },
};

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export const skillGroups = [
  { key: "lang", title: "Programming Languages", items: ["C", "Python", "Java", "JavaScript"] },
  { key: "web", title: "Frontend", items: ["HTML5", "CSS3", "React.js"] },
  { key: "api", title: "Backend", items: ["Java", "Spring Boot", "REST APIs"] },
  { key: "data", title: "Database", items: ["SQL"] },
  { key: "tools", title: "Tools", items: ["Git", "GitHub", "VS Code", "Linux"] },
  {
    key: "core",
    title: "CS Fundamentals",
    items: [
      "Data Structures and Algorithms",
      "Object-Oriented Programming",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
      "Problem-solving",
    ],
  },
  {
    key: "genai",
    title: "Generative AI (studied)",
    note: "Covered through the OCI Generative AI Professional certification.",
    items: [
      "Large Language Models",
      "Prompt Engineering",
      "RAG",
      "Embeddings",
      "Fine-tuning",
      "LangChain",
      "OCI Generative AI Agents",
    ],
  },
] as const;

export type Project = {
  id: string;
  index: string;
  name: string;
  tagline: string;
  category: string;
  period?: string;
  problem: string;
  solution: string;
  features: string[];
  status?: { working: string[]; planned: string[]; note: string };
  contribution: string[];
  stack: string[];
  live?: string;
  repo?: string;
  preview?: { src: string; alt: string };
};

export const projects: Project[] = [
  {
    id: "greentogether",
    index: "01",
    name: "GreenTogether",
    tagline: "Smart waste management platform",
    category: "Smart India Hackathon 2025 · SIH25060",
    problem:
      "Municipal waste handling depends on citizens, collection workers and city administrators, but the three groups rarely share one system for reporting, assigning and tracking work.",
    solution:
      "A role-based web platform where citizens report waste with location and photos, workers receive and track tasks, and administrators monitor activity through dashboards.",
    features: [
      "Separate citizen, worker and admin portals",
      "Geo-tagged waste reporting on Leaflet maps",
      "Gamified learning portal for citizen awareness",
      "Rewards marketplace for incentive-based participation",
      "Worker task, training, safety and earnings views",
      "Admin monitoring hub with charts, plus multilingual UI",
    ],
    contribution: [
      "Built as a Smart India Hackathon 2025 team prototype",
      "Frontend prototype covering all three user roles",
    ],
    stack: ["React 18", "Vite", "Redux Toolkit", "Tailwind CSS", "React Router", "Leaflet", "Recharts", "D3.js", "i18next", "Framer Motion"],
    live: "https://green-together-32sx.vercel.app/",
    repo: "https://github.com/Soheb04-git/GreenTogether",
    preview: {
      src: greenPreview.url,
      alt: "GreenTogether landing page with a city illustration, registration buttons and navigation",
    },
  },
  {
    id: "diagnofra",
    index: "02",
    name: "DiagnoFRA",
    tagline: "Transformer diagnostics from FRA data",
    category: "Smart India Hackathon 2025",
    problem:
      "Power transformer failures cause outages and heavy losses. Frequency Response Analysis (FRA) can reveal winding and insulation problems, but reading static FRA plots needs expert interpretation.",
    solution:
      "A diagnostics dashboard that takes FRA test files, plots magnitude and phase response, compares a measurement against a baseline and presents a fault assessment with a confidence score and maintenance recommendation.",
    features: [
      "CSV upload with drag and drop",
      "Interactive magnitude and phase response plots",
      "Baseline versus measured comparison",
      "Fault category, confidence score and recommendation cards",
      "Downloadable PDF report",
    ],
    status: {
      working: [
        "CSV upload and parsing",
        "Magnitude and phase charts",
        "Baseline comparison view",
        "PDF report export",
      ],
      planned: [
        "Trained ML model for fault classification",
        "XML file import (parser drafted, not enabled)",
        "Explainable diagnostics backed by the model",
      ],
      note: "In the current build, fault labels and confidence scores come from a simulated analysis module that stands in for the planned model.",
    },
    contribution: ["Built as a Smart India Hackathon 2025 team project"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Radix UI", "Recharts", "react-dropzone", "jsPDF", "Framer Motion"],
    live: "https://diagno-fra.vercel.app/",
    repo: "https://github.com/Soheb04-git/DiagnoFRA",
    preview: {
      src: diagnoPreview.url,
      alt: "DiagnoFRA analysis dashboard showing fault detection status and magnitude and phase response charts",
    },
  },
  {
    id: "medicine",
    index: "03",
    name: "Online Medicine Ordering System",
    tagline: "Browse, order and manage medicines online",
    category: "Academic team project · BCET",
    period: "Aug 2025 – Nov 2025 · Team of 3",
    problem:
      "Ordering medicines usually means visiting a pharmacy in person, with no simple way to browse availability, keep a cart or track past orders.",
    solution:
      "A web application with a medicine catalog, cart and checkout flow, a personal dashboard for orders and prescriptions, and an admin panel for managing medicines and orders.",
    features: [
      "Medicine catalog with detail pages",
      "Cart, checkout and order confirmation",
      "User dashboard: orders, prescriptions, wishlist, profile",
      "Admin panel for medicines and orders",
      "Payment step simulated for the academic build",
    ],
    contribution: [
      "Application architecture and route structure",
      "Database organization for users, medicines, carts and orders",
      "Development and testing of the core workflows",
      "Documentation and team coordination",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase", "Radix UI"],
    repo: "https://github.com/Soheb04-git/online-medicine-ordering-system",
  },
];

/** Real route files from the repository, shown as the project preview. */
export const medicineRoutes = [
  "app/page.tsx",
  "app/medicines/page.tsx",
  "app/medicines/[id]/page.tsx",
  "app/cart/page.tsx",
  "app/checkout/page.tsx",
  "app/payment/page.tsx",
  "app/order-confirmation/page.tsx",
  "app/dashboard/orders/page.tsx",
  "app/dashboard/prescriptions/page.tsx",
  "app/dashboard/wishlist/page.tsx",
  "app/admin/medicines/page.tsx",
  "app/admin/orders/page.tsx",
  "lib/firebase.ts",
];

export const moreRepos = [
  {
    name: "SAT-SA",
    description: "Supervisory Analytics Tool for SOC Assessment (SIH26157).",
    lang: "HTML",
    href: "https://github.com/Soheb04-git/SAT-SA",
  },
  {
    name: "GovEdu-Scheduler",
    description: "Scheduling web app, deployed on Vercel.",
    lang: "HTML",
    href: "https://github.com/Soheb04-git/GovEdu-Scheduler",
    live: "https://govedu-scheduler.vercel.app",
  },
  {
    name: "GFG",
    description: "Java solutions repository.",
    lang: "Java",
    href: "https://github.com/Soheb04-git/GFG",
  },
  {
    name: "LCode",
    description: "Java solutions repository.",
    lang: "Java",
    href: "https://github.com/Soheb04-git/LCode",
  },
];

export const experience = [
  {
    org: "Code Vision Club, BCET",
    role: "Governor / Student Chief Coordinator",
    period: "Sep 2024 – Present",
    points: [
      "Lead and coordinate technical events, coding competitions and workshops.",
      "Manage registrations, scheduling, task distribution and on-the-day execution.",
      "Work with faculty members and students to plan each event.",
      "Contribute to peer learning through programming and technical workshops.",
      "Part of initiatives that involved 100+ students.",
    ],
  },
  {
    org: "Entrepreneurship Development Cell, BCET",
    role: "Technical Head",
    period: "Sep 2024 – Present",
    points: [
      "Handle the technical requirements of entrepreneurship-focused events.",
      "Coordinate technical initiatives within the cell.",
      "Connect technology work with entrepreneurship activities.",
      "Organized and supported CodeStorm.",
    ],
  },
];

export const certification = {
  name: "Oracle Cloud Infrastructure Generative AI Professional",
  issuer: "Oracle",
  year: "2025",
  topics: [
    "Large Language Models",
    "Prompt Engineering",
    "Retrieval-Augmented Generation",
    "Embeddings",
    "Fine-tuning",
    "LangChain",
    "OCI Generative AI Agents",
  ],
};

export const education = [
  {
    title: "B.Tech, Computer Science and Engineering",
    school: "Bengal College of Engineering and Technology (BCET), Durgapur",
    period: "Aug 2023 – Jul 2027",
    result: "CGPA 7.39 / 10 (up to 6th semester)",
    current: "Currently in 7th semester",
  },
  {
    title: "Class XII, WBCHSE",
    school: "Nepali Para Hindi High School, Durgapur",
    result: "65.8%",
  },
  {
    title: "Class X, WBBSE",
    school: "Benachity Netaji Vidyalaya, Durgapur",
    result: "83.57%",
  },
];

export const beyondCode = [
  {
    title: "Smart India Hackathon 2025",
    body: "Worked on two hackathon builds: GreenTogether for waste management and DiagnoFRA for transformer diagnostics.",
  },
  {
    title: "CodeStorm",
    body: "Organized and supported CodeStorm as Technical Head of the Entrepreneurship Development Cell.",
  },
  {
    title: "Workshops and coding competitions",
    body: "Plan and run programming workshops and coding contests with Code Vision Club for students at BCET.",
  },
];
