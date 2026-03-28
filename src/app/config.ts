// ─── Personal Info ────────────────────────────────────────────────────────────
export const personal = {
  name: 'Victor Vento',
  role: 'Software Developer',
  tagline: 'Building clean and efficient digital experiences.',
  email: 'contact@victorvento.net',
  location: 'Melbourne, FL',
  availability: 'Full-time / Freelance',
  bio: [
    "Hi! I'm Victor, a passionate Software Developer with a love for building clean, efficient, and user-friendly applications. I thrive on turning complex problems into elegant solutions.",
    "I enjoy working across the full stack — from crafting responsive front-end interfaces to designing robust back-end services. I'm always seeking to learn new technologies and sharpen my craft.",
    "When I'm not coding, you'll find me exploring new ideas, contributing to open-source projects, or enjoying a good coffee.",
  ],
  // Social links — update these with your actual profiles
  github: 'https://github.com/victorovento',
  linkedin: 'https://www.linkedin.com/in/vvento',
  instagram: 'https://www.instagram.com/victorovento',
  // Place your CV at src/assets/cv.pdf
  cvPath: 'assets/Resume.pdf',
};

// ─── Experience ───────────────────────────────────────────────────────────────
export interface Experience {
  company: string;
  role: string;
  city: string;
  startDate: string;
  endDate: string;
  description: string;
}

export const experiences: Experience[] = [
  {
    company: 'WELS Systems Foundation',
    role: 'Software Developer',
    city: 'Miami, FL',
    startDate: 'Jan 2024',
    endDate: 'Present',
    description:
      'Architected and deployed serverless microservices on Google Cloud for the PreK.Club platform, optimizing NoSQL database performance and scalability. Developed high-performance Angular applications using Server-Side Rendering (SSR) to achieve excellence in SEO metrics and Core Web Vitals. Engineered secure payment workflows via Stripe API and webhooks using TypeScript. Streamlined development lifecycles by implementing automated CI/CD pipelines with GitHub Actions and Azure Pipelines.',
  },
  {
    company: 'Freelance',
    role: 'Freelance Software Developer',
    city: 'Miami, FL',
    startDate: 'Sep 2023',
    endDate: 'Jan 2024',
    description:
      'Delivered custom full-stack solutions for diverse clients, focusing on responsive web applications and performance optimization. Leveraged TypeScript, Angular, and Node.js to build scalable MVPs and integrated third-party APIs for enhanced functionality. Managed the complete software development lifecycle, including UI/UX design, cloud deployment on GCP/AWS, and technical consulting to align software architecture with business goals.',
  },
  {
    company: 'ETECSA',
    role: 'Software Developer Intern',
    city: 'Pinar del Rio, Cuba',
    startDate: 'Dec 2022',
    endDate: 'Jun 2023',
    description:
      'Engineered a full-stack landline repair management system using Node.js and MongoDB, significantly streamlining internal workflows and improving customer service efficiency. Developed custom automation scripts to optimize workforce allocation, generating real-time deployment lists for network repair teams across Pinar del Rio. Focused on database performance and process automation to modernize legacy telecommunications maintenance operations.',
  },
];

// ─── Skills ───────────────────────────────────────────────────────────────────
export interface SkillGroup {
  category: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'Frontend',
    skills: [
      'Angular',
      'TypeScript',
      'JavaScript (ES6+)',
      'SSR (Server-Side Rendering)',
      'RxJS',
      'HTML5 / CSS3',
      'SCSS / Bootstrap',
      'Material Design',
    ],
  },
  {
    category: 'Backend & Cloud',
    skills: [
      'Node.js',
      'Google Cloud Platform (GCP)',
      'Serverless Architecture',
      'Microservices',
      'RESTful APIs',
      'Stripe Integration / Webhooks',
    ],
  },
  {
    category: 'Database & DevOps',
    skills: [
      'NoSQL (MongoDB / Firestore)',
      'SQL',
      'GitHub Actions',
      'Azure Pipelines',
      'Git / GitHub',
      'YAML',
      'Docker',
      'Linux',
    ],
  },
  {
    category: 'Software Engineering',
    skills: [
      'SEO Optimization',
      'Core Web Vitals',
      'CI/CD Workflows',
      'Agile / Scrum',
      'Unit Testing',
      'Problem Solving',
    ],
  },
];
