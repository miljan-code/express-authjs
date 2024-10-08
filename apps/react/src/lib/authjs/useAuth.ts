import { useEvent } from '../../hooks/useEvent';
import { getSession, signIn, signOut } from './auth';
import type { SignInResponse } from './types';
import { BuiltInProviderType } from '@auth/core/providers';

export function useAuth() {
  const loginWithOAuth = useEvent(
    async (provider: BuiltInProviderType | 'custom') => {
      let res: SignInResponse | undefined;
      try {
        res = await signIn(provider, {
          redirect: false,
        });
        console.log('res', res);
      } catch (err) {
        console.error('Login failed');
        throw err;
      }

      if (res?.error) {
        console.error('Login failed');
        throw new Error('Login failed');
      }

      const session = await getSession();
      if (!session) {
        console.error('Can not get current user info');
        throw new Error('Login failed, ');
      }

      return session;
    }
  );

  const logout = useEvent(async () => {
    await signOut({
      redirect: false,
    });

    window.location.href = '/login'; // not good, need to invest to find better way.
  });

  return {
    loginWithOAuth,
    logout,
  };
}
