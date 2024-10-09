import { Link, Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from './lib/authjs/useAuth';
import { useEffect, useState } from 'react';
import { getSession } from './lib/authjs/auth';
import { UserInfo } from './lib/authjs/types';

export const App = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const getUserData = async () => {
      const userInfo = await getSession();
      setUserInfo(userInfo);
    };

    getUserData();
  }, []);

  return (
    <div className="flex justify-center pt-4">
      <div className="max-w-xl w-full space-y-4">
        <div className="bg-slate-100 rounded-md flex items-center justify-between p-3">
          <span className="text-slate-700">
            {userInfo ? userInfo.user?.email : 'You are not signed in.'}
          </span>
          {userInfo ? (
            <button
              className="bg-blue-600 text-white py-1.5 px-4 rounded-md"
              onClick={logout}
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/signin"
              className="bg-blue-600 text-white py-1.5 px-4 rounded-md"
            >
              Sign in
            </Link>
          )}
        </div>

        <ul className="flex items-center gap-2 [&>li]:text-slate-700 [&>li]:underline [&>li]:underline-offset-2">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/protected">Protected</Link>
          </li>
        </ul>

        <Outlet context={{ userInfo }} />
      </div>
    </div>
  );
};

export const Index = () => {
  return (
    <div className="space-y-1 pt-4">
      <h1 className="text-2xl font-bold">React/Express/Auth.js Example</h1>
      <p className="text-slate-500">
        This is an example of how to use React with Express and Auth.js
      </p>
    </div>
  );
};

export const Protected = () => {
  const { userInfo } = useOutletContext<{ userInfo: UserInfo }>();

  return userInfo ? (
    <div className="space-y-1 pt-4">
      <h1 className="text-2xl font-bold">Protected route</h1>
      <p className="text-slate-500">This route is protected. Session.</p>
    </div>
  ) : (
    <Navigate to="/signin" />
  );
};

export const SignIn = () => {
  const { loginWithOAuth } = useAuth();

  return (
    <div className="flex justify-center pt-4">
      <div className="max-w-xl w-full space-y-4">
        <Link to="/" className="text-slate-500 text-sm">
          &larr; Go back to Home page
        </Link>
        <div className="bg-slate-100 rounded-md flex items-center justify-between p-3">
          <button
            className="px-3 py-1.5 bg-blue-500 text-white rounded-md"
            onClick={() => loginWithOAuth('google')}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};
