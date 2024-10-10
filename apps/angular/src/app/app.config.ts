import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { hasAccess } from './auth/auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter([
      {
        path: '',
        loadComponent: () =>
          import('./app.component').then((c) => c.LayoutComponent),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./app.component').then((c) => c.IndexComponent),
          },
          {
            path: 'protected',
            canActivate: [hasAccess()],
            loadComponent: () =>
              import('./app.component').then((c) => c.ProtectedComponent),
          },
        ],
      },
      {
        path: 'signin',
        loadComponent: () =>
          import('./app.component').then((c) => c.SignInComponent),
      },
    ]),
  ],
};
