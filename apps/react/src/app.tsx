import { Link, Outlet } from 'react-router-dom';

export const App = () => {
  return (
    <div className="flex justify-center pt-4">
      <div className="max-w-xl w-full space-y-4">
        <div className="bg-slate-100 rounded-md flex items-center justify-between p-3">
          <span className="text-slate-700">You are not signed in.</span>
          <Link
            to="/signin"
            className="bg-blue-600 text-white py-1.5 px-4 rounded-md"
          >
            Sign in
          </Link>
        </div>

        <ul className="flex items-center gap-2 [&>li]:text-slate-700 [&>li]:underline [&>li]:underline-offset-2">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/protected">Protected</Link>
          </li>
        </ul>

        <Outlet />
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
  return (
    <div className="space-y-1 pt-4">
      <h1 className="text-2xl font-bold">Protected route</h1>
      <p className="text-slate-500">This route is protected. Session.</p>
    </div>
  );
};

export const SignIn = () => {
  return (
    <div className="flex justify-center pt-4">
      <div className="max-w-xl w-full space-y-4">
        <Link to="/" className="text-slate-500 text-sm">
          &larr; Go back to Home page
        </Link>
        <div className="bg-slate-100 rounded-md flex items-center justify-between p-3">
          Sign in
        </div>
      </div>
    </div>
  );
};
