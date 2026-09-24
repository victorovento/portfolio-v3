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

// ─── Projects ─────────────────────────────────────────────────────────────────
export interface Project {
  name: string;
  description: string;
  /** Short, concrete bullets: what you built and how. */
  highlights?: string[];
  tech: string[];
  url?: string;
  repo?: string;
  year?: string;
  status: 'live' | 'wip' | 'archived';
}

// Strongest first. Everything here is a public repo on github.com/victorovento.
export const projects: Project[] = [
  {
    name: 'victorvento.net',
    description:
      'This site: a hand-built retro homepage and portfolio. Angular 21 with standalone components, signals and zoneless change detection, plus build-time scripts that pull live stats from Steam, PlayStation, Spotify and GitHub.',
    highlights: [
      'Node build pipeline snapshots four third-party APIs to static JSON, with graceful fallbacks, so no API key ever reaches the browser',
      'Chiptune music synthesized in real time with the WebAudio API; canvas particle effects that respect reduced-motion settings',
      'Pixel art rendered from code as crisp SVG; lazy-loaded routes and a responsive three-column layout',
    ],
    tech: ['Angular 21', 'TypeScript', 'Signals', 'Node.js', 'WebAudio', 'Canvas'],
    url: 'https://victorvento.net',
    repo: 'https://github.com/victorovento/portfolio-v3',
    year: '2026',
    status: 'live',
  },
  {
    name: 'Developer Website Ideas',
    description:
      'An open-source, community-driven gallery of 240+ developer portfolios. Anyone can add their site with a one-line pull request; the app is Angular with server-side rendering for speed and SEO.',
    highlights: [
      'GitHub Actions validate every pull request (field format, https-only URLs, duplicate detection) and run the unit test suite',
      'Searchable, filterable UI built from standalone Angular components',
      'Content lives in a single Markdown file, so the whole site ships without a database',
    ],
    tech: ['Angular', 'SSR', 'TypeScript', 'GitHub Actions', 'Netlify'],
    repo: 'https://github.com/victorovento/developer-website-ideas',
    year: '2026',
    status: 'live',
  },
  {
    name: 'MyPetLogger Website',
    description:
      'Marketing site for MyPetLogger, a privacy-first pet journal app for iOS and Android. Framework-free HTML, CSS and JavaScript, localized into 15 languages by a custom Python site generator.',
    highlights: [
      'Python build script generates every page for each locale, including right-to-left Arabic',
      'Per-locale Open Graph metadata, sitemap and robots.txt for international SEO',
      'Deployed to Netlify with custom security headers and redirects',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'Python', 'i18n', 'Netlify'],
    repo: 'https://github.com/victorovento/mypetlogger-website',
    year: '2026',
    status: 'live',
  },
  {
    name: 'Airport Management System',
    description:
      'Desktop application for day-to-day airport operations: scheduling flights, selling tickets, managing passengers and reporting revenue. Built with C# WinForms on .NET and a SQLite database.',
    highlights: [
      'Implemented a generic linked list (ILista<E>) from scratch as the in-memory data layer',
      'Revenue reports per flight and per date range, with inline form validation',
      'Shipped as versioned releases with a documented changelog',
    ],
    tech: ['C#', '.NET', 'WinForms', 'SQLite'],
    repo: 'https://github.com/victorovento/airport-control',
    year: '2019',
    status: 'archived',
  },
  {
    name: 'Karnaugh Map Solver',
    description:
      'Desktop tool that simplifies Boolean functions: fill in a 2-, 3- or 4-variable Karnaugh map and it returns the minimized expression. Java with a Swing interface.',
    highlights: [
      'Grouping algorithm looks for the largest valid groups first (16, 8, 4, then 2 cells) to produce the simplest expression',
      'Separate solver per map size behind a single interactive GUI',
    ],
    tech: ['Java', 'Swing', 'Algorithms'],
    repo: 'https://github.com/victorovento/Karnaugh-map-solver',
    status: 'archived',
  },
  {
    name: 'Statistical Variables Calculator',
    description:
      'Command-line tool that turns raw data into grouped frequency tables and computes measures of central tendency (mean, median, mode) and dispersion. A C++ university team project.',
    highlights: [
      'Handles discrete and continuous variables, with absolute, relative and cumulative frequencies',
      'Frequency table stored in a hand-written doubly linked list',
    ],
    tech: ['C++', 'Data structures', 'Statistics'],
    repo: 'https://github.com/victorovento/statistical-variables-calculator',
    status: 'archived',
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

// ─── Last.fm (live "listening to" in the status box) ─────────────────────────
// While you're playing something that scrobbles to Last.fm, the status box
// shows it; otherwise it falls back to status.listening. Last.fm API keys are
// read-only and meant to be used client-side, so it's fine for this to be public.
// Get a key at https://www.last.fm/api/account/create
export const lastfm = {
  username: 'victorvento',
  apiKey: '5d54a16620fa062af350119c02baaaaf',
};

// ─── Socials (left sidebar) ───────────────────────────────────────────────────
// `url` opens the profile; entries without one (Discord) copy `handle` instead.
export interface Social {
  name: string;
  handle: string;
  icon: 'instagram' | 'xlogo' | 'facebook' | 'reddit' | 'discord';
  url?: string;
}

export const socials: Social[] = [
  { name: 'Instagram', handle: '@victorovento', icon: 'instagram', url: 'https://www.instagram.com/victorovento' },
  { name: 'X', handle: '@victorovento', icon: 'xlogo', url: 'https://x.com/victorovento' },
  { name: 'Facebook', handle: 'Victor Vento', icon: 'facebook', url: 'https://www.facebook.com/profile.php?id=61579601784245' },
  { name: 'Reddit', handle: 'u/Impossible_Duty_3509', icon: 'reddit', url: 'https://www.reddit.com/user/Impossible_Duty_3509/' },
  { name: 'Discord', handle: 'victor_vento', icon: 'discord' },
];

// ─── Fortune cookie (right sidebar) ───────────────────────────────────────────
export const fortunes: string[] = [
  'It works on your machine. Ship the machine.',
  'A bug fixed at 2am is two bugs by 9am.',
  'Your next commit message will be "fix". Again.',
  'There are 10 kinds of people: those who get binary and those who don\'t.',
  'The cache is always the problem. Unless it\'s DNS.',
  'You will find the missing semicolon in the last place you look.',
  'Today is a good day to delete code.',
  'Weeks of coding can save you hours of planning.',
  'A clean git history is a myth, like the Loch Ness monster.',
  'Rubber duck debugging: the duck knows. The duck always knows.',
  'You will soon rewrite this in a new framework. Resist.',
  'Lucky numbers: 200, 201, 204. Unlucky: 500.',
];

// ─── Site stats (right sidebar) ───────────────────────────────────────────────
export const site = {
  onlineSince: '2026-03-28',
  // Reset this when something breaks in production.
  lastBug: '2026-09-24',
};

// ─── Travel map (travel page) ─────────────────────────────────────────────────
// Names must match the map's regions (Natural Earth names).
export interface Place {
  region: string;
  cities?: string[];
}

export const travel = {
  usStates: [
    'Texas', 'Florida', 'Georgia', 'Maryland', 'Virginia', 'West Virginia', 'Pennsylvania',
    'North Carolina', 'New Jersey', 'Delaware', 'New York', 'Connecticut', 'South Carolina',
    'Alabama', 'Mississippi', 'Louisiana', 'Oklahoma', 'Tennessee', 'Kentucky', 'Massachusetts',
    'New Hampshire', 'Maine', 'Rhode Island', 'Vermont', 'Minnesota', 'Wisconsin', 'Indiana',
    'Illinois', 'Missouri', 'Kansas', 'Colorado', 'New Mexico', 'Arkansas', 'Nevada', 'Arizona',
    'California', 'Oregon', 'Washington', 'Idaho', 'Montana', 'Utah', 'District of Columbia',
  ],
  canada: [{ region: 'Ontario' }] as Place[],
  mexico: [
    { region: 'Quintana Roo', cities: ['Cancún'] },
    { region: 'Chiapas', cities: ['Tapachula'] },
    { region: 'Oaxaca', cities: ['Oaxaca'] },
    { region: 'Ciudad de México', cities: ['Mexico City'] },
    { region: 'Nuevo León', cities: ['Monterrey'] },
    { region: 'Tamaulipas', cities: ['Reynosa'] },
  ] as Place[],
  // Visited as a whole (no subdivisions on the map).
  countries: ['Cuba', 'Guatemala', 'Honduras', 'Nicaragua', 'Puerto Rico'],
  markers: [
    { label: 'born here', icon: 'star', lat: 22.0, lon: -79.5, where: 'Cuba' },
    { label: 'home', icon: 'home', lat: 28.0836, lon: -80.6081, where: 'Melbourne, FL' },
  ] as const,
};
