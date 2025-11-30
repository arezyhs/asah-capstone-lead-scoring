import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';

const TopBar = ({ userName, onLogout }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    authService.logout();
    onLogout(); 
    navigate('/login'); 
  };

  return (
    <div className="flex justify-between items-center px-5 py-3 bg-[#85CC2C] text-white shadow-md">
      <h3 className="m-0 text-lg font-semibold">Predictive Lead Scoring Portal</h3>
      <div className="flex items-center">
        {userName && <span className="mr-4 text-base">Hello, {userName}</span>}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;