import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import leadService from '../api/leadService';
import InfoCard from '../components/InfoCard';

function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [note, setNote] = useState('');
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const customerData = await leadService.getLeadDetail(id);
        setCustomer(customerData);
        const notesData = await leadService.getLeadNotes(id);
        setNotesList(notesData);
      } catch (err) {
        setError("Gagal mengambil detail nasabah. Silakan coba lagi.");
        console.error("Fetch Customer Detail Error:", err);
        navigate('/dashboard'); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSaveNote = async () => {
    if (!note.trim()) return;
    try {
      const newNote = await leadService.saveLeadNote(id, note);
      setNotesList(prevNotes => [...prevNotes, newNote]);
      setNote('');
      alert('Catatan berhasil disimpan!');
    } catch (err) {
      console.error("Gagal menyimpan catatan:", err);
      alert('Gagal menyimpan catatan.');
    }
  };

  const handleMarkAsContacted = () => {
    alert('Fitur "Mark as Contacted" akan diimplementasikan oleh Backend untuk update status nasabah.');
  };

  if (loading) {
    return <div className="p-5 text-center text-gray-600">Loading customer details...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-500 text-center">{error}</div>;
  }

  if (!customer) {
    return <div className="p-5 text-gray-600 text-center">Nasabah tidak ditemukan.</div>;
  }

  return (
    <div className="p-5 bg-gray-100 min-h-[calc(100vh-60px)]">
      <button onClick={() => navigate('/dashboard')} className="mb-5 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-300">
        ← Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800 m-0">Customer Details</h2>
        <span className="bg-gray-200 px-3 py-1 rounded-md text-sm text-gray-700">
          Customer ID: {customer.id}
        </span>
      </div>
      <h3 className="mb-8 text-xl font-semibold text-gray-800">{customer.customer_name}</h3>

      <div className="flex flex-wrap gap-5 mb-8">
        <InfoCard title="Key Information" dataObject={customer.key_information} />
        <InfoCard title="Customer Demographic Profile" dataObject={customer.demographic_profile} />
        <InfoCard title="Financial Profile" dataObject={customer.financial_profile} />
        <InfoCard title="Contact & Campaign History" dataObject={customer.campaign_history} />

        <div className="bg-white p-5 rounded-lg shadow-sm flex items-center justify-center flex-1 basis-[48%] min-h-[150px]">
            <button
                onClick={() => alert('Fungsi Direct Call akan terintegrasi dengan sistem telepon.')}
                className="px-6 py-3 bg-[#85CC2C] text-white rounded-lg text-lg font-semibold flex items-center gap-2 hover:bg-[#72b02a] transition duration-300"
            >
                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06L6 9.879a1.5 1.5 0 000 2.242l1.24 1.24a1.5 1.5 0 002.242 0l1.455-1.455a1 1 0 011.06-.54l4.435.74A1 1 0 0118 16.847V18a1 1 0 01-1 1h-2.153a1 1 0 01-.986-.836l-.74-4.435a1 1 0 01.54-1.06l.894-.894a1.5 1.5 0 000-2.242L14 6.121a1.5 1.5 0 00-2.242 0l-1.455 1.455a1 1 0 01-1.06.54l-4.435-.74A1 1 0 012 3.153V3z" />
                </svg>
                Direct Call
            </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
        <h4 className="mb-4 text-lg font-semibold text-[#85CC2C]">Sales Representative Notes</h4>
        {notesList.length > 0 ? (
            <div className="max-h-[150px] overflow-y-auto border border-gray-200 p-3 rounded-md mb-4 bg-gray-50">
                {notesList.map(n => (
                    <p key={n.id} className="mb-1 text-sm text-gray-700">
                        <strong className="font-medium">{new Date(n.timestamp).toLocaleDateString()}:</strong> {n.note}
                    </p>
                ))}
            </div>
        ) : (
            <p className="text-sm text-gray-500 mb-4">Belum ada catatan.</p>
        )}
        <textarea
          placeholder="Write notes..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="4"
          className="w-full p-3 rounded-md border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-[#85CC2C]"
        ></textarea>
        <div className="flex justify-end gap-3">
          <button 
            onClick={handleSaveNote}
            className="px-4 py-2 bg-[#85CC2C] text-white rounded-md hover:bg-[#72b02a] transition duration-300"
          >
            Save Notes
          </button>
          <button 
            onClick={handleMarkAsContacted}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-300"
          >
            Mark as Contacted
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailPage;