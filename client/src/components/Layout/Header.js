import React, { useState } from 'react';
import { Bell, Search, Settings } from 'lucide-react';

const Header = ({ user }) => {
  const [notifications] = useState([
    {
      id: 1,
      title: 'Weather Alert',
      message: 'Heavy rain expected in your area tomorrow',
      time: '2 hours ago',
      type: 'warning'
    },
    {
      id: 2,
      title: 'Farm Health Update',
      message: 'Your soil pH levels are optimal',
      time: '1 day ago',
      type: 'success'
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      {/* Search bar */}
      <div className="flex flex-1 gap-x-4">
        <div className="relative flex-1 max-w-lg">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search farms, crops, or topics..."
            className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-200">
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Settings dropdown */}
          {showSettings && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Settings</h3>
              </div>
              
              {/* Profile Settings */}
              <div className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-sm">👤</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profile Settings</p>
                    <p className="text-xs text-gray-500">Manage your account information</p>
                  </div>
                </div>
              </div>

              {/* Farm Settings */}
              <div className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-sm">🚜</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Farm Settings</p>
                    <p className="text-xs text-gray-500">Configure farm details and preferences</p>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">🔔</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notifications</p>
                    <p className="text-xs text-gray-500">Manage alert preferences</p>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-sm">🔒</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Privacy & Security</p>
                    <p className="text-xs text-gray-500">Control data sharing and security</p>
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 text-sm">🎨</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Theme</p>
                      <p className="text-xs text-gray-500">Light mode</p>
                    </div>
                  </div>
                  <button className="text-xs text-primary-600 hover:text-primary-700">
                    Change
                  </button>
                </div>
              </div>

              {/* Language Settings */}
              <div className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 text-sm">🌐</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Language</p>
                      <p className="text-xs text-gray-500">English</p>
                    </div>
                  </div>
                  <button className="text-xs text-primary-600 hover:text-primary-700">
                    Change
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-2 pt-2">
                {/* Help & Support */}
                <div className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 text-sm">❓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Help & Support</p>
                      <p className="text-xs text-gray-500">Get help and contact support</p>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="px-4 py-3 hover:bg-red-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 text-sm">🚪</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-600">Sign Out</p>
                      <p className="text-xs text-red-400">Logout from your account</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.farmType || 'Farmer'}
            </p>
          </div>
          
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 