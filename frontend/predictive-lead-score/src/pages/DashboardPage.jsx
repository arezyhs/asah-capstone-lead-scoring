import React, { useState, useEffect } from 'react';
import leadService from '../api/leadService';
import LeadTable from '../components/LeadTable';

function DashboardPage() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('probability_score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await leadService.getLeads({ searchTerm, sortBy, sortOrder });
        setLeads(data);
      } catch (err) {
        setError("Gagal mengambil data leads. Silakan coba lagi.");
        console.error("Fetch Leads Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [searchTerm, sortBy, sortOrder]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split(':');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <div className="p-5 bg-gray-100 min-h-[calc(100vh-60px)]">
      <h2 className="mb-2 text-2xl font-bold text-gray-800">Sales Dashboard</h2>
      <p className="mb-5 text-gray-600">Prioritized list of customers based on probability score</p>

      <div className="flex mb-5">
        <input
          type="text"
          placeholder="Search customer"
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 rounded-md border border-gray-300 flex-grow mr-2 focus:outline-none focus:ring-2 focus:ring-[#85CC2C]"
        />
        <select 
          onChange={handleSortChange} 
          value={`${sortBy}:${sortOrder}`}
          className="px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#85CC2C]"
        >
          <option value="probability_score:desc">Sort by Probability Score (High to Low)</option>
          <option value="probability_score:asc">Sort by Probability Score (Low to High)</option>
          <option value="job:asc">Sort by Job (A-Z)</option>
        </select>
      </div>

      {loading && <p className="text-center text-gray-600">Loading leads...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && <LeadTable leads={leads} />}
    </div>
  );
}

export default DashboardPage;