import { Routes } from '@angular/router';

const t = (page: string) => `${page} | Victor Vento`;

export const routes: Routes = [
  { path: '', title: 'Victor Vento | Software Developer', loadComponent: () => import('./pages/home.page').then((m) => m.HomePage) },
  { path: 'experience', title: t('Experience'), loadComponent: () => import('./pages/experience.page').then((m) => m.ExperiencePage) },
  { path: 'projects', title: t('Projects'), loadComponent: () => import('./pages/projects.page').then((m) => m.ProjectsPage) },
  { path: 'skills', title: t('Skills'), loadComponent: () => import('./pages/skills.page').then((m) => m.SkillsPage) },
  { path: 'travel', title: t('Travel'), loadComponent: () => import('./pages/travel.page').then((m) => m.TravelPage) },
  { path: 'links', title: t('Cool Links'), loadComponent: () => import('./pages/links.page').then((m) => m.LinksPage) },
  { path: 'contact', title: t('Contact'), loadComponent: () => import('./pages/contact.page').then((m) => m.ContactPage) },
  { path: '**', title: t('404'), loadComponent: () => import('./pages/not-found.page').then((m) => m.NotFoundPage) },
];
