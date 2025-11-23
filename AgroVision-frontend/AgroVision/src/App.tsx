// App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'; 
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Upload from './components/Upload';
import ProblemStatement from './components/ProblemStatement';

function AppRouterContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-agri-gradient bg-field-texture flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <span className="absolute inset-0 rounded-full border-4 border-agri-200 border-t-agri-600 animate-spin"></span>
            <span className="absolute inset-2 rounded-full border-4 border-crop-100 border-t-crop-500 animate-spin [animation-duration:1.2s]"></span>
          </div>
          <p className="text-soil-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agri-gradient bg-field-texture dark:bg-gray-950 dark:text-gray-100">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problem" element={<ProblemStatement />} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignUp />} />
          <Route path="/upload" element={user ? <Upload /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRouterContent />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
