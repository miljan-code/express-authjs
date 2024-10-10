import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs';

export const hasAccess = (): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);

    return auth.session$.pipe(
      take(1),
      map((session) => !!session)
    );
  };
};
