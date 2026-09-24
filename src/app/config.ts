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

// ─── Status box (left sidebar) ────────────────────────────────────────────────
// Edit these whenever you feel like it and redeploy.
export const status = {
  feeling: 'caffeinated ☕',
  listening: 'lofi chiptunes',
  workingOn: 'this very website',
  reading: 'Designing Data-Intensive Applications',
  updated: '2026-09-24',
};

// ─── Updates log (right sidebar) ──────────────────────────────────────────────
// Newest first.
export interface Update {
  date: string; // YYYY-MM-DD
  text: string;
}

export const updates: Update[] = [
  { date: '2026-09-24', text: 'Redesigned the whole site in glorious retro style!' },
  { date: '2026-09-24', text: 'Added a projects page and a cool links page.' },
  { date: '2026-09-24', text: 'There might be a secret or two hidden around here...' },
  { date: '2026-04-30', text: 'Added a photo of me.' },
  { date: '2026-03-28', text: 'Site v3 went live.' },
];

// ─── Projects ─────────────────────────────────────────────────────────────────
export interface Project {
  name: string;
  description: string;
  tech: string[];
  url?: string;
  repo?: string;
  status: 'live' | 'wip' | 'archived';
}

// TODO: replace the placeholder entry with your own projects.
export const projects: Project[] = [
  {
    name: 'victorvento.net',
    description:
      'The site you are looking at right now. A retro personal homepage built with Angular, pixel art drawn in code, a WebAudio chiptune player and a few secrets.',
    tech: ['Angular', 'TypeScript', 'SCSS', 'WebAudio'],
    url: 'https://victorvento.net',
    repo: 'https://github.com/victorovento',
    status: 'live',
  },
  {
    name: 'PreK.Club',
    description:
      'Platform for pre-kindergarten programs. Serverless microservices on Google Cloud, an SSR Angular front end and Stripe-powered payments.',
    tech: ['Angular SSR', 'GCP', 'Firestore', 'Stripe'],
    url: 'https://prek.club',
    status: 'live',
  },
  {
    name: 'Project Placeholder',
    description: 'Describe a side project here: what it does, why you built it and what you learned.',
    tech: ['Node.js', 'MongoDB'],
    repo: 'https://github.com/victorovento',
    status: 'wip',
  },
];

// ─── Cool links ───────────────────────────────────────────────────────────────
export interface CoolLink {
  name: string;
  url: string;
  description: string;
}

export const coolLinks: CoolLink[] = [
  { name: 'dimden.dev', url: 'https://dimden.dev/', description: 'The personal site that inspired this redesign.' },
  { name: 'Neocities', url: 'https://neocities.org/', description: 'Free hosting for the personal web. Keeping the old internet alive.' },
  { name: '32-Bit Cafe', url: 'https://32bit.cafe/', description: 'A community of personal website enthusiasts.' },
  { name: 'Angular', url: 'https://angular.dev/', description: 'The framework this site is built with.' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/', description: 'My daily dose of tech news.' },
];
