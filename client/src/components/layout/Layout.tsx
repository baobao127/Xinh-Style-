import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">XinhStyle</h1>
      </header>

      <main className="flex-1 p-4">
        <Outlet />
      </main>

      <footer className="bg-gray-100 text-center text-sm text-gray-500 py-4">
        &copy; {new Date().getFullYear()} XinhStyle. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
