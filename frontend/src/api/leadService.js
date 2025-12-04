import apiClient from './apiClient';

const leadService = {
  getLeads: async (params) => {
    try {
      const actualParams = {
        _sort: params.sortBy,
        _order: params.sortOrder,
        q: params.searchTerm
      };
      // Memanggil endpoint GET /leads di Backend
      const response = await apiClient.get('/leads', { params: actualParams });
      return response.data;
    } catch (error) {
      console.error('Get Leads API error:', error);
      throw error;
    }
  },

  // Mengambil detail lead berdasarkan ID
  getLeadDetail: async (id) => {
    try {
      // Memanggil endpoint GET /leads/{id} di Backend
      const response = await apiClient.get(`/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get Lead Detail API for ID ${id} error:`, error);
      throw error;
    }
  },

  
  getLeadNotes: async (leadId) => {
    try {
      // Memanggil endpoint GET /notes?leadId=... di Backend
      const response = await apiClient.get('/notes', { 
        params: { leadId } 
      });
      return response.data;
    } catch (error) {
      console.warn(`Gagal mengambil notes untuk lead ${leadId} (Mungkin endpoint belum ada)`, error);
      return [];
    }
  },

  saveLeadNote: async (leadId, noteText) => {
    try {
      // Mengirim data ke endpoint POST /notes di Backend
      const response = await apiClient.post('/notes', {
        leadId: leadId,
        note: noteText,
        timestamp: new Date().toISOString() 
      });
      return response.data;
    } catch (error) {
      console.error(`Save Lead Note API for ID ${leadId} error:`, error);
      throw error;
    }
  }
};

export default leadService;