import { signIn, signOut } from './auth';
import type { BuiltInProviderType } from '@auth/core/providers';

export function useAuth() {
  const loginWithOAuth = async (provider: BuiltInProviderType | 'custom') => {
    try {
      await signIn(provider, {
        redirect: false,
      });
    } catch (err) {
      console.error('Login failed');
      throw err;
    }
  };

  const logout = async () => {
    await signOut({
      redirect: false,
    });

    window.location.href = '/signin'; // not good, need to invest to find better way.
  };

  return {
    loginWithOAuth,
    logout,
  };
}
