import { HttpClient, type HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type {
  ClientSafeProvider,
  LiteralUnion,
  SignInAuthorizationParams,
  SignInOptions,
  SignInResponse,
} from './types';
import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from '@auth/core/providers';
import { combineLatest, EMPTY, of, switchMap, type Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private redirect = true;
  private callbackUrl = 'http://localhost:4200';
  private isSupportingReturn = false;

  private getCsrfToken() {
    return this.http.get<{ csrfToken: string }>('/api/auth/csrf');
  }

  private getProviders() {
    return this.http.get<
      Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>
    >('/api/auth/providers');
  }

  public signIn<P extends RedirectableProviderType | undefined = undefined>(
    provider?: LiteralUnion<
      P extends RedirectableProviderType
        ? P | BuiltInProviderType
        : BuiltInProviderType
    >,
    options?: SignInOptions,
    authorizationParams?: SignInAuthorizationParams
  ): Observable<SignInResponse | undefined> {
    return combineLatest([this.getCsrfToken(), this.getProviders()]).pipe(
      switchMap(([{ csrfToken }, providers]) => {
        this.callbackUrl = options?.callbackUrl ?? this.callbackUrl;
        this.redirect = options?.redirect ?? this.redirect;

        const baseUrl = '/api/auth';

        if (!providers) {
          window.location.href = `${baseUrl}/error`;
          return EMPTY;
        }

        if (!provider || !(provider in providers)) {
          window.location.href = `${baseUrl}/signin?${new URLSearchParams({
            callbackUrl: this.callbackUrl,
          })}`;
          return EMPTY;
        }

        const isCredentials = providers[provider].type === 'credentials';
        const isEmail = providers[provider].type === 'email';
        this.isSupportingReturn = isCredentials || isEmail;

        const signInUrl = `${baseUrl}/${
          isCredentials ? 'callback' : 'signin'
        }/${provider}`;

        const _signInUrl = `${signInUrl}${
          authorizationParams
            ? `?${new URLSearchParams(authorizationParams)}`
            : ''
        }`;

        return this.http.post<HttpResponse<{ url: string }>>(
          _signInUrl,
          // @ts-expect-error
          new URLSearchParams({
            ...options,
            csrfToken,
            callbackUrl: this.callbackUrl,
            json: true,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Auth-Return-Redirect': '1',
            },
          }
        );
      }),
      switchMap((data) => {
        if (this.redirect || !this.isSupportingReturn) {
          const url = data.url ?? this.callbackUrl;
          window.location.href = url;
          // If url contains a hash, the browser does not reload the page. We reload manually
          if (url.includes('#')) window.location.reload();
          return EMPTY;
        }

        const error = new URL(data.url ?? '').searchParams.get('error');

        return of({
          error,
          // todo: edit this
          status: 200,
          ok: true,
          url: error ? null : data.url,
        });
      })
    );
  }
}
