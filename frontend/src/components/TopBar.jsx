import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { Menu, Moon, Sun } from 'lucide-react';

const TopBar = ({ userName, onToggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="px-4 sm:px-6 h-16 flex justify-between items-center max-w-[1920px] mx-auto">
        
        <div className="flex items-center gap-3">
          {/* Tombol Hamburger (Mobile Only) */}
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
          >
            <Menu size={24} />
          </button>

          {/* Logo / Judul Halaman */}
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
             <h1 className="text-lg font-bold text-gray-800 dark:text-white leading-tight tracking-tight">
              Predictive <span className="text-[#85CC2C]">Lead Scoring</span>
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
          </button>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{userName}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;