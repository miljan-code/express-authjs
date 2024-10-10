import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  template: `
    <header class="py-4 flex flex-col items-center [&>*]:max-w-xl [&>*]:w-full">
      <div
        class="bg-slate-200 rounded-md p-4 text-slate-700 flex items-center justify-between"
      >
        @if (auth.session$ | async; as session) {
        <span>{{ session.user.email }}</span>
        <button
          (click)="signOut()"
          class="bg-blue-500 text-white py-1.5 px-3 rounded-md"
        >
          Sign out
        </button>
        } @else {
        <span>You are not logged in</span>
        <a
          routerLink="/signin"
          class="bg-blue-500 text-white py-1.5 px-3 rounded-md"
          >Sign in</a
        >
        }
      </div>
      <nav
        class="p-4 flex items-center gap-2 [&>*]:underline [&>*]:underline-offset-2"
      >
        <a routerLink="/" class="text-blue-500">Home</a>
        <a routerLink="/protected" class="text-blue-500">Protected</a>
      </nav>
    </header>
    <router-outlet />
  `,
})
export class LayoutComponent {
  public auth = inject(AuthService);

  signOut() {
    this.auth.signOut().subscribe();
  }
}

@Component({
  selector: 'app-index',
  standalone: true,
  template: `
    <div class="flex justify-center">
      <div class="max-w-xl w-full p-4 text-slate-700 flex flex-col gap-1">
        <h1 class="text-2xl font-bold">Angular/Express/Auth.js Example</h1>
        <span class="text-slate-500">
          This is a simple example of how to use Angular with Express and
          Auth.js.
        </span>
      </div>
    </div>
  `,
})
export class IndexComponent {}

@Component({
  selector: 'app-protected',
  standalone: true,
  template: `
    <div class="flex justify-center">
      <div class="max-w-xl w-full p-4 text-slate-700 flex flex-col gap-1">
        <h1 class="text-2xl font-bold">Protected component</h1>
        <span class="text-slate-500"> This is a protected component. </span>
      </div>
    </div>
  `,
})
export class ProtectedComponent {}

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex justify-center">
      <div class="max-w-xl w-full p-4 text-slate-700 space-y-2">
        <a routerLink="/" class="text-blue-500">&larr; Go back to Home page</a>
        <div
          class="bg-slate-200 max-w-xl w-full rounded-md p-4 text-slate-700 flex items-center justify-between"
        >
          <button
            class="bg-blue-500 text-white py-1.5 px-3 rounded-md cursor-pointer"
            (click)="signIn()"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SignInComponent {
  private auth = inject(AuthService);

  signIn() {
    this.auth.signIn('google').subscribe();
  }
}
