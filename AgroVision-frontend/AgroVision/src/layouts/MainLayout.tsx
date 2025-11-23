import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // derive a simple page id from pathname to keep Header highlighting working
  const pathToPage = (pathname: string) => {
    if (pathname === '/' || pathname === '') return 'home';
    if (pathname.startsWith('/upload')) return 'upload';
    if (pathname.startsWith('/problem')) return 'problem';
    if (pathname.startsWith('/signup')) return 'signup';
    if (pathname.startsWith('/login')) return 'login';
    return 'home';
  };

  const setCurrentPage = (page: string) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'upload':
        navigate('/upload');
        break;
      case 'problem':
        navigate('/problem');
        break;
      case 'signup':
        navigate('/signup');
        break;
      case 'login':
        navigate('/login');
        break;
      default:
        navigate('/');
    }
  };

  const currentPage = pathToPage(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
