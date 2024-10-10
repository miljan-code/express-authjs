import { HttpClient, type HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type {
  ClientSafeProvider,
  LiteralUnion,
  SignInAuthorizationParams,
  SignInOptions,
  SignInResponse,
  SignOutParams,
  SignOutResponse,
} from './types';
import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from '@auth/core/providers';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  of,
  switchMap,
  type Observable,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type UserInfo = {
  user: {
    email?: string;
  };
  expires: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  public session$ = new BehaviorSubject<UserInfo | null>(null);

  constructor() {
    this.getSession()
      .pipe(takeUntilDestroyed())
      .subscribe((session) => {
        this.session$.next(session);
      });
  }

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
    const baseUrl = '/api/auth';
    let redirect = options?.redirect ?? true;
    let callbackUrl = options?.callbackUrl ?? 'http://localhost:4200';
    let isSupportingReturn = false;

    return combineLatest([this.getCsrfToken(), this.getProviders()]).pipe(
      switchMap(([{ csrfToken }, providers]) => {
        if (!providers) {
          window.location.href = `${baseUrl}/error`;
          return EMPTY;
        }

        if (!provider || !(provider in providers)) {
          window.location.href = `${baseUrl}/signin?${new URLSearchParams({
            callbackUrl,
          })}`;
          return EMPTY;
        }

        const isCredentials = providers[provider].type === 'credentials';
        const isEmail = providers[provider].type === 'email';
        isSupportingReturn = isCredentials || isEmail;

        const signInUrl = `${baseUrl}/${
          isCredentials ? 'callback' : 'signin'
        }/${provider}`;

        const _signInUrl = `${signInUrl}${
          authorizationParams
            ? `?${new URLSearchParams(authorizationParams)}`
            : ''
        }`;

        return this.http.post<HttpResponse<SignInResponse>>(
          _signInUrl,
          // @ts-expect-error
          new URLSearchParams({
            ...options,
            csrfToken,
            callbackUrl,
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
      switchMap((res) => {
        if (redirect || !isSupportingReturn) {
          const url = res.url ?? callbackUrl;
          window.location.href = url;
          // If url contains a hash, the browser does not reload the page. We reload manually
          if (url.includes('#')) window.location.reload();
          return EMPTY;
        }

        const error = new URL(res.url ?? '').searchParams.get('error');

        return of({
          error,
          status: res.status,
          ok: res.ok,
          url: error ? null : res.url,
        });
      })
    );
  }

  public signOut<R extends boolean>(
    options?: SignOutParams<R>
  ): Observable<SignOutResponse | null> {
    const callbackUrl = window.location.href;
    const baseUrl = '/api/auth';

    return this.getCsrfToken().pipe(
      switchMap(({ csrfToken }) => {
        return this.http.post<HttpResponse<SignOutResponse>>(
          `${baseUrl}/signout`,
          // @ts-expect-error
          new URLSearchParams({
            csrfToken,
            callbackUrl,
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
      switchMap((res) => {
        if (options?.redirect ?? true) {
          const url = res.url ?? callbackUrl;
          window.location.href = url;
          // If url contains a hash, the browser does not reload the page. We reload manually
          if (url.includes('#')) window.location.reload();
          return EMPTY;
        }

        return of(res.body);
      })
    );
  }

  private getSession(): Observable<UserInfo | null> {
    return this.http.get<UserInfo | null>('/api/auth/session');
  }
}
