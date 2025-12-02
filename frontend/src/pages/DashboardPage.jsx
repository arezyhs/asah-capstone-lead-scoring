import React, { useState, useEffect, useCallback } from 'react'; 
import leadService from '../api/leadService';
import LeadTable from '../components/LeadTable';
import { Users, TrendingUp, AlertCircle, Filter, TrendingDown, RotateCcw, Search } from 'lucide-react'; // Tambah icon Search kembali

const inputStyle = "w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#85CC2C] placeholder-gray-400 text-sm transition-all";
const selectStyle = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#85CC2C] text-sm cursor-pointer transition-all";

const jobOptions = [
  { value: '', label: 'All Jobs' },
  { value: 'admin.', label: 'Admin' },
  { value: 'blue-collar', label: 'Blue Collar' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'housemaid', label: 'Housemaid' },
  { value: 'management', label: 'Management' },
  { value: 'retired', label: 'Retired' },
  { value: 'self-employed', label: 'Self Employed' },
  { value: 'services', label: 'Services' },
  { value: 'student', label: 'Student' },
  { value: 'technician', label: 'Technician' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'unknown', label: 'Unknown' },
];

const loanOptions = [
  { value: '', label: 'All Loan Status' },
  { value: 'Has Loan', label: 'Has Loan' },
  { value: 'No Loan', label: 'No Loan' },
];

const StatCard = ({ title, value, colorClass, bgClass, svgIcon, loading }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
    <div className={`p-3 rounded-xl ${bgClass}`}>
      {React.cloneElement(svgIcon, { className: `w-6 h-6 ${colorClass}` })}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{loading ? '-' : value}</h3>
    </div>
  </div>
);

function DashboardPage() {
  const [allLeads, setAllLeads] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort State
  const [searchTerm, setSearchTerm] = useState(''); 
  const [jobFilter, setJobFilter] = useState(''); 
  const [loanFilter, setLoanFilter] = useState(''); 
  const [sortOrder, setSortOrder] = useState('desc'); 

  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leadService.getLeads({ limit: 1000 });
      setAllLeads(data);
      
      const total = data.length;
      const high = data.filter(l => l.score >= 80).length;
      const medium = data.filter(l => l.score >= 50 && l.score < 80).length;
      const low = data.filter(l => l.score < 50).length;
      
      setStats({ total, high, medium, low });

    } catch (err) {
      setError("Failed to fetch leads.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Fungsi Reset Filter
  const resetFilters = () => {
    setSearchTerm(''); 
    setJobFilter('');
    setLoanFilter('');
    setSortOrder('desc');
  };

  // --- LOGIKA FILTER & SORTING (Client Side) ---
  const displayedLeads = allLeads
    .filter((lead) => {
      const matchName = searchTerm === '' || (lead.customer_name && lead.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchJob = jobFilter === '' || (lead.job && lead.job.toLowerCase() === jobFilter.toLowerCase());
      const matchLoan = loanFilter === '' || (lead.loan_status === loanFilter);
      
      return matchName && matchJob && matchLoan;
    })
    .sort((a, b) => {
      return sortOrder === 'desc' 
        ? b.score - a.score 
        : a.score - b.score;
    });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300 pb-10">
      
      <div className="max-w-7xl mx-auto p-6">
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Sales Dashboard</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Monitor lead data and customer priorities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Leads" value={stats.total} loading={loading} colorClass="text-blue-600" bgClass="bg-blue-50 dark:bg-blue-900/20" svgIcon={<Users />} />
          <StatCard title="High Potential" value={stats.high} loading={loading} colorClass="text-green-600" bgClass="bg-green-50 dark:bg-green-900/20" svgIcon={<TrendingUp />} />
          <StatCard title="Medium Potential" value={stats.medium} loading={loading} colorClass="text-yellow-600" bgClass="bg-yellow-50 dark:bg-yellow-900/20" svgIcon={<AlertCircle />} />
          <StatCard title="Low Potential" value={stats.low} loading={loading} colorClass="text-red-600" bgClass="bg-red-50 dark:bg-red-900/20" svgIcon={<TrendingDown />} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            <div className="w-full md:w-1/3 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search Customer Name..."
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className={inputStyle}
              />
            </div>

            <div className="w-full md:w-2/3 flex flex-col sm:flex-row gap-3">
              
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 sm:hidden">
                    <Filter className="w-4 h-4" />
                </div>
                <select 
                  value={jobFilter} 
                  onChange={(e) => setJobFilter(e.target.value)} 
                  className={`${selectStyle} ${jobFilter === '' ? 'text-gray-500' : 'text-gray-800 dark:text-white'}`}
                >
                  {jobOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>

              <div className="flex-1">
                <select 
                  value={loanFilter} 
                  onChange={(e) => setLoanFilter(e.target.value)} 
                  className={`${selectStyle} ${loanFilter === '' ? 'text-gray-500' : 'text-gray-800 dark:text-white'}`}
                >
                  {loanOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>

              <div className="flex-1">
                <select 
                  onChange={(e) => setSortOrder(e.target.value)} 
                  value={sortOrder} 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 font-medium text-gray-700 dark:text-gray-200 text-sm focus:ring-2 focus:ring-[#85CC2C] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <option value="desc">Highest Score</option>
                  <option value="asc">Lowest Score</option>
                </select>
              </div>

              <button 
                onClick={resetFilters}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-all flex items-center justify-center gap-2"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Reset</span>
              </button>

            </div>
          </div>
        </div>

        {loading && (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85CC2C] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading leads data...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-center border border-red-100">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <>
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-lg font-bold text-gray-700 dark:text-white">Customer List</h3>
              <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
                {displayedLeads.length} Leads Displayed
              </span>
            </div>
            <LeadTable leads={displayedLeads} />
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;