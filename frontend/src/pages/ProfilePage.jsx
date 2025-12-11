import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { 
  User, Mail, Phone, Calendar, Briefcase, 
  Target, TrendingUp, PhoneCall, 
  FileText, Clock, ExternalLink, Lightbulb 
} from 'lucide-react';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/api/profile')
      .then(res => {
        setProfileData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  // --- HELPER: Generate Tanggal & Waktu Realtime WIB ---
  const getRealtimeDateTime = (minutesAgo) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - minutesAgo);
    
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
      timeZone: 'Asia/Jakarta'
    }).replace('.', ':') + ' WIB';
  };

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;
  if (!profileData) return <div className="p-10 text-center">Failed to load profile.</div>;

  // Destructure data dari API
  const { user, performance, recent_notes, recent_calls, upcoming_features } = profileData;

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Profile</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- KOLOM KIRI: USER PROFILE CARD --- */}
        <div className="lg:col-span-1 h-fit">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center">
            
            <div className="relative mb-4">
              <img 
                src={user.avatar_url} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-gray-50 dark:border-gray-700 shadow-md"
              />
            </div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{user.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{user.role}</p>

            <div className="w-full space-y-4 text-left">
              <ProfileItem icon={<Briefcase size={16}/>} label="ID" value={user.employee_id} />
              <ProfileItem icon={<Calendar size={16}/>} label="Joined" value={user.join_date} />
              <ProfileItem icon={<Mail size={16}/>} label="Email" value={user.email} />
              <ProfileItem icon={<Phone size={16}/>} label="Phone" value={user.phone} />
            </div>

          </div>
        </div>

        {/* --- KOLOM KANAN: STATS, NOTES, CALLS & COMING SOON --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Performance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard 
              title="Leads Processed" 
              value={performance.total_leads_processed} 
              icon={<User className="text-blue-500" size={20}/>}
              bg="bg-blue-50 dark:bg-blue-900/20"
            />
            <MetricCard 
              title="Conversion Rate" 
              value={performance.conversion_rate} 
              icon={<TrendingUp className="text-green-500" size={20}/>}
              bg="bg-green-50 dark:bg-green-900/20"
            />
             <MetricCard 
              title="Direct Calls" 
              value={performance.total_direct_calls} 
              icon={<PhoneCall className="text-orange-500" size={20}/>}
              bg="bg-orange-50 dark:bg-orange-900/20"
            />
            <MetricCard 
              title="Monthly Target" 
              value={`${performance.high_potential_found} / ${performance.monthly_target}`} 
              subtext="High Potential Leads"
              icon={<Target className="text-purple-500" size={20}/>}
              bg="bg-purple-50 dark:bg-purple-900/20"
            />
          </div>

          {/* 2. SALES NOTES HISTORY */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#85CC2C]" />
                Recent Sales Notes
              </h3>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {recent_notes && recent_notes.length > 0 ? (
                recent_notes.map((item, idx) => (
                  <div key={idx} className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#85CC2C] dark:hover:border-[#85CC2C] transition-colors bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-gray-800 dark:text-white text-sm">
                           {item.customer_name}
                         </span>
                         {item.lead_id && (
                           <Link to={`/dashboard/leads/${item.lead_id}`} className="text-[#85CC2C] hover:text-[#76b626]">
                             <ExternalLink size={12} />
                           </Link>
                         )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 whitespace-nowrap">
                        <Clock size={10} />
                        {getRealtimeDateTime(idx * 45 + 15)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      "{item.note}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
                  No notes recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* 3. DIRECT CALL HISTORY */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-orange-500" />
                Direct Call History
              </h3>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {recent_calls && recent_calls.length > 0 ? (
                recent_calls.map((call, idx) => (
                  <div key={idx} className="group p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-colors bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800 dark:text-white text-sm">
                          {call.customer_name}
                        </span>
                        
                        {call.lead_id && (
                           <Link to={`/dashboard/leads/${call.lead_id}`} className="text-orange-500 hover:text-orange-600">
                             <ExternalLink size={14} />
                           </Link>
                         )}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-gray-400 whitespace-nowrap">
                        <Clock size={10} />
                        {getRealtimeDateTime(idx * 20 + 5)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
                  No call history found.
                </div>
              )}
            </div>
          </div>

          {/* 4. COMING SOON */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-4">
               <Lightbulb className="text-yellow-500 w-5 h-5" />
               <h3 className="font-bold text-gray-600 dark:text-gray-300">Coming Soon for You</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upcoming_features && upcoming_features.length > 0 ? (
                upcoming_features.map((feature, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-1">{feature.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{feature.description}</p>
                    <span className="text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">
                      Release: {feature.release_date}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Stay tuned for updates!</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Komponen Kecil Helper
const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
    <div className="text-gray-400 dark:text-gray-500">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{value}</p>
    </div>
  </div>
);

const MetricCard = ({ title, value, subtext, icon, bg }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full">
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg ${bg} shrink-0`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
    </div>
    <div>
      <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h4>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  </div>
);

export default ProfilePage;