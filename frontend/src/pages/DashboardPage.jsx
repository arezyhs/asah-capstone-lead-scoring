import React, { useState, useEffect, useCallback, useMemo } from 'react'; 
import leadService from '../api/leadService';
import LeadTable from '../components/LeadTable';
import { Users, TrendingUp, AlertCircle, TrendingDown, RotateCcw, Search, Filter, PieChart as PieIcon, BarChart3 } from 'lucide-react'; 
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

// --- STYLING ---
const inputStyle = "w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#85CC2C] placeholder-gray-400 text-sm transition-all";
const selectStyle = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#85CC2C] text-sm cursor-pointer transition-all";
const COLORS = ['#85CC2C', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

// --- OPTIONS ---
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

// --- COMPONENTS ---
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

  // --- CHART DATA PROCESSING ---
  const chartData = useMemo(() => {
    if (!allLeads.length) return { jobData: [], balanceData: [] };

    // 1. Job Distribution (Pie Chart)
    const jobCounts = {};
    allLeads.forEach(lead => {
      const job = lead.job || 'unknown';
      jobCounts[job] = (jobCounts[job] || 0) + 1;
    });
    
    const sortedJobs = Object.entries(jobCounts)
      .sort(([,a], [,b]) => b - a);
    
    let jobData = sortedJobs.slice(0, 5).map(([name, value]) => ({ name, value }));
    const othersCount = sortedJobs.slice(5).reduce((acc, [,val]) => acc + val, 0);
    if (othersCount > 0) jobData.push({ name: 'Others', value: othersCount });

    // 2. Economy Class / Balance Distribution (Bar Chart)
    const balanceGroups = { 'Low (<500)': 0, 'Medium (500-2k)': 0, 'High (>2k)': 0 };
    
    allLeads.forEach(lead => {
      const balance = lead.financial_profile?.average_balance || 0; 
      if (balance < 500) balanceGroups['Low (<500)']++;
      else if (balance <= 2000) balanceGroups['Medium (500-2k)']++;
      else balanceGroups['High (>2k)']++;
    });

    const balanceData = Object.entries(balanceGroups).map(([name, count]) => ({ name, count }));

    return { jobData, balanceData };
  }, [allLeads]);


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
        
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Sales Dashboard</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Monitor lead data and customer priorities.</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Leads" value={stats.total} loading={loading} colorClass="text-blue-600" bgClass="bg-blue-50 dark:bg-blue-900/20" svgIcon={<Users />} />
          <StatCard title="High Potential" value={stats.high} loading={loading} colorClass="text-green-600" bgClass="bg-green-50 dark:bg-green-900/20" svgIcon={<TrendingUp />} />
          <StatCard title="Medium Potential" value={stats.medium} loading={loading} colorClass="text-yellow-600" bgClass="bg-yellow-50 dark:bg-yellow-900/20" svgIcon={<AlertCircle />} />
          <StatCard title="Low Potential" value={stats.low} loading={loading} colorClass="text-red-600" bgClass="bg-red-50 dark:bg-red-900/20" svgIcon={<TrendingDown />} />
        </div>

        {/* --- CHARTS SECTION (NEW) --- */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Chart 1: Job Distribution */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <PieIcon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Job Distribution</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.jobData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.jobData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Economy Class (Balance) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
               <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Economy Class (Balance)</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.balanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" fontSize={12} stroke="#888" />
                    <YAxis fontSize={12} stroke="#888" />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                    />
                    <Bar dataKey="count" fill="#85CC2C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* FILTERS & TABLE */}
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
            {/* Filter Controls*/}
            <div className="w-full md:w-2/3 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                 <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} className={`${selectStyle}`}>
                  {jobOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
              <div className="flex-1">
                <select value={loanFilter} onChange={(e) => setLoanFilter(e.target.value)} className={`${selectStyle}`}>
                  {loanOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
              <div className="flex-1">
                <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder} className={`${selectStyle} bg-white dark:bg-gray-700`}>
                  <option value="desc">Highest Score</option>
                  <option value="asc">Lowest Score</option>
                </select>
              </div>
              <button onClick={resetFilters} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* LOADING & ERROR */}
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
        
        {/* DATA TABLE */}
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