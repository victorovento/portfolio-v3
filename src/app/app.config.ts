import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Hash URLs (/#/projects) work on any static host without rewrite rules.
    provideRouter(routes, withHashLocation(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
  ],
};
