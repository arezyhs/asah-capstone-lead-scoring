import React from 'react';
import { Link } from 'react-router-dom';

const LeadTable = ({ leads }) => {
  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center transition-colors duration-300">
        <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Data not found</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  const getLoanStatusColor = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'approved' || s === 'yes' || s === 'has loan') {
      return 'border-green-200 bg-green-50 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400';
    }
    if (s === 'pending') {
      return 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400';
    }
    if (s === 'rejected' || s === 'no' || s === 'no loan') {
      return 'border-red-200 bg-red-50 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400';
    }
    return 'border-gray-200 bg-gray-50 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400';
  };

  const getPotentialLabel = (score) => {
    if (score >= 80) return 'High Potential';
    if (score >= 50) return 'Medium Potential';
    return 'Low Potential';
  };
  
  const getPotentialColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  const getProgressBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          
          <thead>
            <tr className="bg-[#85CC2C]">
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Customer Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Probability Score</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Job</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Loan Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {lead.customer_name} 
                  </div>
                  <div className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${getPotentialColor(lead.score)}`}>
                    {getPotentialLabel(lead.score)}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full ${getScoreBadgeColor(lead.score)}`}>
                      {lead.score}%
                    </span>
                    <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(lead.score)}`} 
                        style={{ width: `${lead.score}%` }}
                      ></div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {lead.job}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-xs px-2.5 py-1 rounded-md capitalize font-semibold border ${getLoanStatusColor(lead.loan_status)}`}>
                    {lead.loan_status || 'Unknown'}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    to={`/customer/${lead.id}`} 
                    className="inline-flex items-center px-4 py-1.5 border border-transparent text-xs font-bold rounded-lg text-[#85CC2C] bg-green-50 hover:bg-[#85CC2C] hover:text-white transition-all duration-200 dark:bg-gray-700 dark:text-[#85CC2C] dark:hover:bg-[#85CC2C] dark:hover:text-white shadow-sm"
                  >
                    Detail
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;