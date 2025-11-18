import apiClient from './apiClient';

const leadService = {
  getLeads: async (params) => {
    try {
      const actualParams = {
        _sort: params.sortBy,
        _order: params.sortOrder,
        q: params.searchTerm
      };
      const response = await apiClient.get('/leads', { params: actualParams });
      return response.data;
    } catch (error) {
      console.error('Get Leads API error:', error);
      throw error;
    }
  },

  getLeadDetail: async (id) => {
    try {
      const response = await apiClient.get(`/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get Lead Detail API for ID ${id} error:`, error);
      throw error;
    }
  },

  getLeadNotes: async (leadId) => {
    try {
        const response = await apiClient.get(`/notes?leadId=${leadId}`);
        return response.data;
    } catch (error) {
        console.error(`Get Lead Notes API for ID ${leadId} error:`, error);
        throw error;
    }
  },

  saveLeadNote: async (leadId, noteText) => {
    try {
        const response = await apiClient.post(`/notes`, {
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