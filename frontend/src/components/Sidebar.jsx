import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Database, Calculator, LogOut, 
  PieChart, User, AlertTriangle, X 
} from 'lucide-react';
import authService from '../api/authService';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? 'bg-[#85CC2C] text-white shadow-lg shadow-green-200 dark:shadow-none'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* SIDEBAR CONTAINER */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 
        flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header Sidebar */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#85CC2C] rounded-lg flex items-center justify-center text-white shrink-0">
              <LayoutDashboard size={20} />
            </div>
            <span className="text-sm font-bold text-gray-800 dark:text-white leading-tight">
              Predictive<br/>Lead Scoring
            </span>
          </div>
          {/* Tombol Close (Mobile Only) */}
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 space-y-2 mt-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          
          <NavLink to="/dashboard/leads" className={navClasses} onClick={onClose}>
            <Database size={20} />
            <span className="font-medium">Leads Data</span>
          </NavLink>

          <NavLink to="/dashboard/analytics" className={navClasses} onClick={onClose}>
            <PieChart size={20} />
            <span className="font-medium">Analytics</span>
          </NavLink>

          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</p>
            <NavLink to="/dashboard/profile" className={navClasses} onClick={onClose}>
              <User size={20} />
              <span className="font-medium">My Profile</span>
            </NavLink>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-sm font-bold"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>

      {/* MODAL LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Confirm Logout</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to log out?</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleConfirmLogout} className="flex-1 px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30">Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;