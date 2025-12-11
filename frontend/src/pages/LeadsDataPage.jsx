import React, { useState, useEffect } from 'react'; 
import leadService from '../api/leadService';
import LeadTable from '../components/LeadTable';
import { Search, RotateCcw, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

// Style constants
const inputStyle = "w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#85CC2C] placeholder-gray-400 text-sm transition-all";
const selectStyle = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#85CC2C] text-sm cursor-pointer transition-all";

const jobOptions = [
  { value: '', label: 'All Jobs' }, { value: 'admin.', label: 'Admin' }, { value: 'blue-collar', label: 'Blue Collar' },
  { value: 'entrepreneur', label: 'Entrepreneur' }, { value: 'housemaid', label: 'Housemaid' }, { value: 'management', label: 'Management' },
  { value: 'retired', label: 'Retired' }, { value: 'self-employed', label: 'Self Employed' }, { value: 'services', label: 'Services' },
  { value: 'student', label: 'Student' }, { value: 'technician', label: 'Technician' }, { value: 'unemployed', label: 'Unemployed' },
  { value: 'unknown', label: 'Unknown' },
];

const loanOptions = [{ value: '', label: 'All Loan Status' }, { value: 'Has Loan', label: 'Has Loan' }, { value: 'No Loan', label: 'No Loan' }];

function LeadsDataPage() {
  const [allLeads, setAllLeads] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState(''); 
  const [jobFilter, setJobFilter] = useState(''); 
  const [loanFilter, setLoanFilter] = useState(''); 
  const [sortOrder, setSortOrder] = useState('desc'); 

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    leadService.getLeads({ limit: 1000 }).then(data => {
      setAllLeads(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, jobFilter, loanFilter, sortOrder]);

  const resetFilters = () => { 
    setSearchTerm(''); setJobFilter(''); setLoanFilter(''); setSortOrder('desc'); setCurrentPage(1); setItemsPerPage(10);
  };

  const filteredLeads = allLeads.filter((lead) => {
      const matchName = searchTerm === '' || (lead.customer_name && lead.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchJob = jobFilter === '' || (lead.job && lead.job.toLowerCase() === jobFilter.toLowerCase());
      const matchLoan = loanFilter === '' || (lead.loan_status === loanFilter);
      return matchName && matchJob && matchLoan;
    }).sort((a, b) => sortOrder === 'desc' ? b.score - a.score : a.score - b.score);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Leads Dashboard</h2>
        <span className="text-sm font-medium bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">{filteredLeads.length} items</span>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        
        {/* --- FILTER SECTION: Compact Grid Layout --- */}
        <div className="grid grid-cols-2 gap-3 md:flex md:flex-row md:gap-4">
          
          {/* 1. Search Bar*/}
          <div className="relative col-span-2 md:flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={inputStyle} />
          </div>
          
          {/* 2. Job Filter*/}
          <div className="col-span-1 md:w-40 lg:w-48">
             <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} className={selectStyle}>{jobOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
          </div>

          {/* 3. Loan Filter*/}
          <div className="col-span-1 md:w-40 lg:w-48">
            <select value={loanFilter} onChange={(e) => setLoanFilter(e.target.value)} className={selectStyle}>{loanOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
          </div>
          
          {/* 4. Sort Filter */}
          <div className="col-span-1 md:w-40 lg:w-44">
             <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={selectStyle}><option value="desc">Score Highest</option><option value="asc">Score Lowest</option></select>
          </div>
          
          {/* 5. Reset Button */}
          <div className="col-span-1 md:w-auto">
            <button 
              onClick={resetFilters} 
              className="w-full h-full md:w-auto px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center gap-2"
              title="Reset Filters"
            >
              <RotateCcw size={18}/>
              <span className="md:hidden text-sm font-medium">Reset</span>
            </button>
          </div>

        </div>
      </div>

      {loading ? (
        <p className="text-center py-10">Loading Data...</p>
      ) : (
        <>
          <LeadTable leads={currentItems} />

          {filteredLeads.length > 0 && (
            
            <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-all duration-300">
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400 max-w-[1920px] mx-auto">
                  <div className="flex items-center gap-2 order-2 md:order-1 self-center md:self-auto">
                      <span className="hidden sm:inline">Show</span>
                      <select
                          value={itemsPerPage}
                          onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                          className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#85CC2C]"
                      >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                      </select>
                      <span className="hidden sm:inline">entries</span>
                  </div>
                  
                  {/* Tombol Panah & Nomor Halaman */}
                  <div className="flex flex-wrap items-center justify-center gap-2 order-1 md:order-2 w-full md:w-auto">
                      <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white dark:bg-gray-800"><ChevronLeft size={16} /></button>
                      <div className="flex flex-wrap gap-1 justify-center">
                          {getPageNumbers().map((number, index) => {
                              if (number === '...') return <span key={`dots-${index}`} className="w-8 h-8 flex items-center justify-center text-gray-400"><MoreHorizontal size={16} /></span>;
                              return <button key={number} onClick={() => paginate(number)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${currentPage === number ? 'bg-[#85CC2C] text-white shadow-md transform scale-105' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-[#85CC2C] dark:hover:border-[#85CC2C]'}`}>{number}</button>;
                          })}
                      </div>
                      <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white dark:bg-gray-800"><ChevronRight size={16} /></button>
                  </div>

                  <div className="hidden md:block text-xs text-gray-500 dark:text-gray-400 order-3">
                       Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLeads.length)} of {filteredLeads.length}
                  </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default LeadsDataPage;