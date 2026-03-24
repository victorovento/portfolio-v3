// ─── Personal Info ────────────────────────────────────────────────────────────
export const personal = {
  name: 'Victor Vento',
  role: 'Software Developer',
  tagline: 'Building clean and efficient digital experiences.',
  email: 'your.email@example.com',
  location: 'Your City, Country',
  availability: 'Full-time / Freelance',
  bio: [
    "Hi! I'm Victor, a passionate Software Developer with a love for building clean, efficient, and user-friendly applications. I thrive on turning complex problems into elegant solutions.",
    "I enjoy working across the full stack — from crafting responsive front-end interfaces to designing robust back-end services. I'm always seeking to learn new technologies and sharpen my craft.",
    "When I'm not coding, you'll find me exploring new ideas, contributing to open-source projects, or enjoying a good coffee.",
  ],
  // Social links — update these with your actual profiles
  github: 'https://github.com/your-username',
  linkedin: 'https://www.linkedin.com/in/your-profile',
  instagram: 'https://www.instagram.com/your-profile',
  // Place your CV at src/assets/cv.pdf
  cvPath: 'assets/cv.pdf',
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
    company: 'Company Name',
    role: 'Software Developer',
    city: 'City, Country',
    startDate: 'Jan 2022',
    endDate: 'Present',
    description:
      'Describe your responsibilities and key achievements here. What problems did you solve? What impact did your work have? Which technologies did you use?',
  },
  {
    company: 'Previous Company',
    role: 'Junior Software Developer',
    city: 'City, Country',
    startDate: 'Mar 2020',
    endDate: 'Dec 2021',
    description:
      'Describe your responsibilities and key achievements here. Focus on impact, growth, and the technologies you worked with.',
  },
  {
    company: 'First Company / Internship',
    role: 'Software Developer Intern',
    city: 'City, Country',
    startDate: 'Jun 2019',
    endDate: 'Feb 2020',
    description:
      'Describe your responsibilities and what you learned during this role.',
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
    skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS / SCSS', 'RxJS'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'REST APIs', 'SQL', 'MongoDB'],
  },
  {
    category: 'Tools & DevOps',
    skills: ['Git', 'Docker', 'Linux', 'CI/CD'],
  },
  {
    category: 'Methodologies',
    skills: ['Agile / Scrum', 'Clean Code', 'Code Review', 'Problem Solving'],
  },
];
