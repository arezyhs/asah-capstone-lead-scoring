import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import leadService from '../api/leadService';
import { Phone, ArrowLeft, Save, Clock, User, Briefcase, Euro, Calendar, TrendingUp, Activity } from 'lucide-react';

function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State Management
  const [customer, setCustomer] = useState(null);
  const [notesList, setNotesList] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      setLoading(true);
      try {
        const customerData = await leadService.getLeadDetail(id);
        setCustomer(customerData);

        try {
          const notesData = await leadService.getLeadNotes(id);
          setNotesList(notesData);
        } catch (e) {
          console.warn("Notes API not available yet", e);
        }
      } catch (err) {
        setError("Failed to fetch customer data.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Helper for safe nested data access
  const getVal = (obj, key, defaultVal = '-') => {
    return obj && obj[key] !== undefined && obj[key] !== null ? obj[key] : defaultVal;
  };

  // --- GENERATE NOMOR TELEPON PALSU (DUMMY) ---
  const getPhoneNumber = () => {
    if (!customer || !customer.id) return '-';
    const numericId = customer.id.replace(/\D/g, ''); 
    const suffix = numericId.slice(-8); 
    return `0812-${suffix.slice(0,4)}-${suffix.slice(4)}`;
  };

  const phoneNumber = getPhoneNumber();

  // Handle Feature: Call
  const handleCallAction = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Handle Feature: Save Note
  const handleSaveNote = async () => {
    if (!note.trim()) return;
    try {
      const newNote = await leadService.saveLeadNote(id, note);
      setNotesList(prev => [...prev, newNote]);
      setNote('');
    } catch (err) {
      alert("Failed to save note.", err);
    }
  };

  // Score Color Logic
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30 border-green-200';
    if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200';
    return 'bg-red-100 dark:bg-red-900/30 border-red-200';
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-gray-500">Loading data...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500 font-medium">{error}</div>;
  if (!customer) return <div className="flex h-screen items-center justify-center text-gray-500">Data not found</div>;

  const demo = customer.demographic_profile || {};
  const finance = customer.financial_profile || {};
  const campaign = customer.campaign_history || {};

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans pb-10 transition-colors duration-300">
      
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-16 z-30 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white flex items-center gap-2 transition-colors font-medium text-sm">
           <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          
          <div className="flex-[1.5] bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
             <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white leading-tight">
                      {customer.customer_name}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-mono text-gray-500 dark:text-gray-400">
                        ID: {customer.id}
                      </span>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {getVal(demo, 'job')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button 
                    onClick={handleCallAction}
                    className="flex-1 px-4 py-2.5 bg-[#85CC2C] hover:bg-[#77b828] text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Customer</span>
                  </button>
                </div>
             </div>
          </div>

          <div className={`flex-1 rounded-2xl p-6 shadow-sm border flex flex-col items-center justify-center relative overflow-hidden ${getScoreBg(customer.score)}`}>
             <div className="absolute -right-6 -bottom-6 opacity-10 transform rotate-12 pointer-events-none">
                <TrendingUp className="w-40 h-40 text-current" />
             </div>
             
             <div className="z-10 relative flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-2 opacity-70 dark:text-white">
                  <Activity className="w-4 h-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">Conversion Score</p>
                </div>
                
                <div className="flex items-baseline gap-1 mb-3">
                  <span className={`text-7xl font-black tracking-tight ${getScoreColor(customer.score)}`}>
                    {customer.score}
                  </span>
                  <span className="text-xl font-medium opacity-60 dark:text-white translate-y-[-4px]">/100</span>
                </div>
                
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold bg-white/60 dark:bg-black/20 backdrop-blur-sm shadow-sm border border-white/20 ${getScoreColor(customer.score)}`}>
                  {customer.score >= 80 ? 'High Potential' : customer.score >= 50 ? 'Medium Potential' : 'Low Potential'}
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
                 <h3 className="text-gray-800 dark:text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                    <User className="w-5 h-5 text-blue-500" /> Personal Profile
                 </h3>
                 <div className="flex flex-col gap-4">
                    <InfoItem label="Age" value={`${getVal(demo, 'age')} Years`} />
                    <InfoItem label="Job" value={getVal(demo, 'job')} capitalize />
                    <InfoItem label="Phone" value={phoneNumber} />
                    <InfoItem label="Marital Status" value={getVal(demo, 'marital_status')} capitalize />
                    <InfoItem label="Education" value={getVal(demo, 'education')} capitalize />
                 </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
                 <h3 className="text-gray-800 dark:text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                    <Euro className="w-5 h-5 text-green-500" /> Financial Profile
                 </h3>
                 <div className="flex flex-col gap-4">
                    <InfoItem label="Avg Balance" value={`€ ${getVal(finance, 'average_balance')}`} />
                    <InfoItem label="Credit Default" value={getVal(finance, 'defaulted_credit')} capitalize highlight={getVal(finance, 'defaulted_credit') === 'yes'} />
                    <InfoItem label="Housing Loan" value={getVal(finance, 'housing_loan')} capitalize />
                    <InfoItem label="Personal Loan" value={getVal(finance, 'personal_loan')} capitalize />
                 </div>
              </div>

            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
               <h3 className="text-gray-800 dark:text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                  <Calendar className="w-5 h-5 text-orange-500" /> Campaign History
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <InfoItem label="Last Contact" value={getVal(campaign, 'last_contact_date')} capitalize />
                  <InfoItem label="Contact Duration" value={`${getVal(campaign, 'duration_seconds')} Seconds`} />
                  <InfoItem label="Contact Type" value={getVal(campaign, 'contact_type')} capitalize />
                  <InfoItem label="Campaign Contacts" value={`${getVal(campaign, 'campaign_contacts')} Times`} />
                  
                  <InfoItem label="Days Since Last" value={getVal(campaign, 'days_since_previous') === 999 ? 'Never' : `${getVal(campaign, 'days_since_previous')} Days`} />
                  
                  <InfoItem label="Previous Outcome" value={getVal(campaign, 'poutcome')} capitalize />
               </div>
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-fit flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                     Sales Notes
                  </h3>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-500 dark:text-gray-300">
                    {notesList.length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4 max-h-[400px] custom-scrollbar">
                  {notesList.length > 0 ? (
                    notesList.map((n, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{n.note}</p>
                        <div className="flex items-center justify-end mt-2 gap-1 text-[10px] text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{n.timestamp ? new Date(n.timestamp).toLocaleString('en-US') : 'Just now'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 italic text-sm border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
                      <p>No notes yet</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <textarea
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#85CC2C] dark:text-white transition resize-none placeholder-gray-400"
                    rows="3"
                    placeholder="Write follow-up result..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <button 
                    onClick={handleSaveNote}
                    disabled={!note.trim()}
                    className="w-full mt-3 py-2.5 rounded-xl text-sm font-bold transition shadow-md flex items-center justify-center gap-2 text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-100 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-900 dark:disabled:text-gray-600"
                  >
                    <Save className="w-4 h-4" /> Save Note
                  </button>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ label, value, capitalize, highlight }) => (
  <div className="flex flex-col group border-b border-gray-50 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">
      {label}
    </span>
    <span className={`text-sm font-medium ${capitalize ? 'capitalize' : ''} ${highlight ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
      {value}
    </span>
  </div>
);

export default CustomerDetailPage;