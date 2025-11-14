import React from 'react';
import { Link } from 'react-router-dom';

const LeadTable = ({ leads }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#85CC2C] text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Probability Score</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Job</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Loan Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.customer_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.probability_score}%</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.job}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.loan_status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link to={`/customer/${lead.id}`} className="px-3 py-2 bg-[#85CC2C] text-white rounded-md hover:bg-[#72b02a] transition duration-300 text-sm">
                  View Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;