import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import { 
  Menu
} from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'AI Assistant', href: '/ai-assistant', icon: '🤖' },
    { name: 'Yield Predictions', href: '/yield-prediction', icon: '🌾' },
    { name: 'Farm Health', href: '/farm-health', icon: '🏥' },
    { name: 'Marketplace', href: '/marketplace', icon: '🛒' },
    { name: 'Community', href: '/community', icon: '👥' },
    { name: 'Weather', href: '/weather', icon: '🌤️' },
    { name: 'My Profile', href: '/profile', icon: '👤' },
  ];

  const currentPage = navigation.find(item => item.href === location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          navigation={navigation} 
          currentPage={currentPage}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar 
          navigation={navigation} 
          currentPage={currentPage}
        />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            {currentPage?.name || 'FarmConnect'}
          </div>
        </div>

        {/* Desktop header */}
        <Header user={user} />

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Page title */}
            {currentPage && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">{currentPage.icon}</span>
                  {currentPage.name}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  {getPageDescription(currentPage.name)}
                </p>
              </div>
            )}

            {/* Page content */}
            <div className="fade-in-up">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const getPageDescription = (pageName) => {
  const descriptions = {
    'Dashboard': 'Monitor your farm performance and get insights at a glance',
    'AI Assistant': 'Get expert farming advice and answers to your questions',
    'Yield Predictions': 'AI-powered crop yield forecasting based on your farm data',
    'Farm Health': 'Monitor soil health, crop conditions, and get recommendations',
    'Marketplace': 'Buy and sell farm products, equipment, and services',
    'Community': 'Connect with other farmers and share knowledge',
    'Weather': 'Real-time weather data and farming recommendations',
    'My Profile': 'Manage your account and farm information'
  };
  
  return descriptions[pageName] || '';
};

export default Layout; 