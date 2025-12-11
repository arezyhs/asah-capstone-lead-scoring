import React, { useState, useEffect, useMemo } from 'react';
import leadService from '../api/leadService';
import { useTheme } from '../context/ThemeContext';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area 
} from 'recharts';
import { 
  Users, TrendingUp, AlertCircle, TrendingDown, 
  PieChart as PieIcon, BarChart3, Activity, 
  Clock, Heart, Calendar, GraduationCap 
} from 'lucide-react';

const COLORS = ['#85CC2C', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
const MARITAL_COLORS = ['#EC4899', '#8B5CF6', '#F59E0B', '#9CA3AF'];

const StatCard = ({ title, value, colorClass, bgClass, svgIcon }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 transition-all hover:shadow-md h-full">
    <div className={`p-3 rounded-xl ${bgClass} shrink-0`}>
      {React.cloneElement(svgIcon, { className: `w-5 h-5 sm:w-6 sm:h-6 ${colorClass}` })}
    </div>
    <div>
      <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
    </div>
  </div>
);

function AnalyticsPage() {
  const { isDarkMode } = useTheme();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const axisTextColor = isDarkMode ? '#9CA3AF' : '#4B5563'; 

  const tooltipStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    color: '#000000' 
  };
  const tooltipLabelStyle = { color: '#000000', fontWeight: 'bold', marginBottom: '0.25rem' };

  useEffect(() => {
    leadService.getLeads({ limit: 2000 }).then(data => {
      setLeads(data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => ({
    total: leads.length,
    high: leads.filter(l => l.score >= 80).length,
    medium: leads.filter(l => l.score >= 50 && l.score < 80).length,
    low: leads.filter(l => l.score < 50).length
  }), [leads]);

  const chartData = useMemo(() => {
    if (!leads.length) return { jobData: [], balanceData: [], scoreData: [], maritalData: [], ageData: [], durationData: [], educationData: [] };
    
    // --- 1. JOB DATA ---
    const jobCounts = {};
    leads.forEach(l => { 
      const j = l.demographic_profile?.job || l.job || 'unknown'; 
      jobCounts[j] = (jobCounts[j] || 0) + 1; 
    });
    const sortedJobs = Object.entries(jobCounts).sort(([,a], [,b]) => b - a);
    let jobData = sortedJobs.slice(0, 5).map(([name, value]) => ({ name, value }));
    const others = sortedJobs.slice(5).reduce((acc, [,v]) => acc + v, 0);
    if(others > 0) jobData.push({ name: 'Others', value: others });

    // --- 2. ECONOMY CLASS ---
    const balanceGroups = { 'Low': 0, 'Medium': 0, 'High': 0 };
    leads.forEach(l => {
      const b = l.financial_profile?.average_balance || 0;
      if (b < 500) balanceGroups['Low']++; else if (b <= 2000) balanceGroups['Medium']++; else balanceGroups['High']++;
    });
    const balanceData = Object.entries(balanceGroups).map(([name, count]) => ({ name, count }));

    // --- 3. SCORE DISTRIBUTION ---
    const scoreBins = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
    leads.forEach(l => {
       const s = l.score;
       if (s <= 20) scoreBins['0-20']++;
       else if (s <= 40) scoreBins['21-40']++;
       else if (s <= 60) scoreBins['41-60']++;
       else if (s <= 80) scoreBins['61-80']++;
       else scoreBins['81-100']++;
    });
    const scoreData = Object.entries(scoreBins).map(([name, value]) => ({ name, value }));

    // --- 4. MARITAL STATUS ---
    const maritalCounts = {};
    leads.forEach(l => { 
      let rawMarital = l.demographic_profile?.marital_status || l.demographic_profile?.marital;
      const m = rawMarital ? (rawMarital.charAt(0).toUpperCase() + rawMarital.slice(1)) : 'Unknown';
      maritalCounts[m] = (maritalCounts[m] || 0) + 1; 
    });
    const maritalData = Object.entries(maritalCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // --- 5. AGE DISTRIBUTION ---
    const ageBins = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56-65': 0, '65+': 0 };
    leads.forEach(l => {
      const a = parseInt(l.demographic_profile?.age || 0);
      if (a > 0) {
        if (a <= 25) ageBins['18-25']++;
        else if (a <= 35) ageBins['26-35']++;
        else if (a <= 45) ageBins['36-45']++;
        else if (a <= 55) ageBins['46-55']++;
        else if (a <= 65) ageBins['56-65']++;
        else ageBins['65+']++;
      }
    });
    const ageData = Object.entries(ageBins).map(([name, count]) => ({ name, count }));

    // --- 6. CONTACT DURATION (Seconds) ---
    const durationBins = { '0-60s': 0, '61-180s': 0, '181-300s': 0, '301-600s': 0, '> 600s': 0 };
    leads.forEach(l => {
      const d = parseInt(l.campaign_history?.duration_seconds || 0);
      if (d > 0) {
        if (d <= 60) durationBins['0-60s']++;       
        else if (d <= 180) durationBins['61-180s']++; 
        else if (d <= 300) durationBins['181-300s']++; 
        else if (d <= 600) durationBins['301-600s']++; 
        else durationBins['> 600s']++;              
      }
    });
    const durationData = Object.entries(durationBins).map(([name, count]) => ({ name, count }));

    // --- 7. EDUCATION DISTRIBUTION (NEW) ---
    const educationCounts = {};
    leads.forEach(l => {
      let rawEdu = l.demographic_profile?.education;
      const e = rawEdu ? (rawEdu.charAt(0).toUpperCase() + rawEdu.slice(1)) : 'Unknown';
      educationCounts[e] = (educationCounts[e] || 0) + 1;
    });
    const educationData = Object.entries(educationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    return { jobData, balanceData, scoreData, maritalData, ageData, durationData, educationData };
  }, [leads]);

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-500">Loading Analytics Data...</div>;

  return (
    <div className="pb-10">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard Analytics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
        <StatCard title="Total Leads" value={stats.total} colorClass="text-blue-600" bgClass="bg-blue-50 dark:bg-blue-900/20" svgIcon={<Users />} />
        <StatCard title="High Potential" value={stats.high} colorClass="text-green-600" bgClass="bg-green-50 dark:bg-green-900/20" svgIcon={<TrendingUp />} />
        <StatCard title="Medium" value={stats.medium} colorClass="text-yellow-600" bgClass="bg-yellow-50 dark:bg-yellow-900/20" svgIcon={<AlertCircle />} />
        <StatCard title="Low" value={stats.low} colorClass="text-red-600" bgClass="bg-red-50 dark:bg-red-900/20" svgIcon={<TrendingDown />} />
      </div>

      {/* 2. PIE CHARTS (Job & Marital) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex gap-2"><PieIcon className="w-5 h-5"/> Job Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
               <PieChart>
                 <Pie data={chartData.jobData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                   {chartData.jobData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                 </Pie>
                 <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#000' }} />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex gap-2"><Heart className="w-5 h-5 text-pink-500"/> Marital Status</h3>
          <div className="h-64">
            <ResponsiveContainer>
               <PieChart>
                 <Pie data={chartData.maritalData} cx="50%" cy="50%" innerRadius={0} outerRadius={80} paddingAngle={2} dataKey="value">
                   {chartData.maritalData.map((e, i) => <Cell key={i} fill={MARITAL_COLORS[i % MARITAL_COLORS.length]} />)}
                 </Pie>
                 <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#000' }} />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* 3. BAR CHARTS (Age & Education - NEW PAIR) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Age Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex gap-2"><Calendar className="w-5 h-5 text-blue-500"/> Age Group</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={chartData.ageData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false}/>
                <XAxis dataKey="name" tick={{fill: axisTextColor, fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
                <Bar dataKey="count" fill="#3B82F6" radius={[4,4,0,0]} barSize={40} name="People"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Education Level (NEW CHART) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex gap-2"><GraduationCap className="w-5 h-5 text-indigo-500"/> Education Level</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={chartData.educationData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false}/>
                <XAxis dataKey="name" tick={{fill: axisTextColor, fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[4,4,0,0]} barSize={40} name="People"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. BAR CHARTS (Economy & Duration) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Economy */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex gap-2"><BarChart3 className="w-5 h-5 text-green-500"/> Economy Class</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={chartData.balanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false}/>
                <XAxis dataKey="name" tick={{fill: axisTextColor, fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
                <Bar dataKey="count" fill="#85CC2C" radius={[4,4,0,0]} barSize={50} name="People"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex gap-2"><Clock className="w-5 h-5 text-orange-500"/> Contact Duration (Seconds)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={chartData.durationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false}/>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={70} tick={{fill: axisTextColor, fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
                <Bar dataKey="count" fill="#F59E0B" radius={[0,4,4,0]} barSize={30} name="Sessions"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. SCORE (Full Width) */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex gap-2"><Activity className="w-5 h-5 text-purple-600"/> Lead Score Distribution</h3>
          <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.scoreData}>
                      <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false}/>
                      <XAxis dataKey="name" tick={{fill: axisTextColor}} axisLine={false} tickLine={false} />
                      <YAxis hide/>
                      <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
                      <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" name="Leads" />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AnalyticsPage;