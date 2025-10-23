import axios from "axios";
import * as c from "../utils/constants";

// Phone Call Service Functions
export const phoneCallService = {
  // Create a new phone call record
  createPhoneCall: async (data: any) => {
    try {
      const response = await axios.post(c.PHONECALLS, data);
      return response.data;
    } catch (error) {
      console.error('Error creating phone call:', error);
      throw error;
    }
  },

  // Get all phone calls with filtering and pagination
  getPhoneCalls: async (params: any = {}) => {
    try {
      const response = await axios.get(c.PHONECALLS, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching phone calls:', error);
      throw error;
    }
  },

  // Get a single phone call by ID
  getPhoneCallById: async (id: string) => {
    try {
      const response = await axios.get(`${c.PHONECALLS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching phone call:', error);
      throw error;
    }
  },

  // Update a phone call record
  updatePhoneCall: async (id: string, data: any) => {
    try {
      const response = await axios.put(`${c.PHONECALLS}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating phone call:', error);
      throw error;
    }
  },

  // Delete a phone call record
  deletePhoneCall: async (id: string) => {
    try {
      const response = await axios.delete(`${c.PHONECALLS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting phone call:', error);
      throw error;
    }
  },

  // Complete follow-up for a phone call
  completeFollowUp: async (id: string, followUpNotes?: string) => {
    try {
      const response = await axios.patch(`${c.PHONECALLS}/${id}/follow-up`, {
        followUpNotes
      });
      return response.data;
    } catch (error) {
      console.error('Error completing follow-up:', error);
      throw error;
    }
  },

  // Get phone call statistics
  getPhoneCallStats: async (params: any = {}) => {
    try {
      const response = await axios.get(`${c.PHONECALLS}/stats/overview`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching phone call stats:', error);
      throw error;
    }
  },

  // Get pending follow-ups
  getPendingFollowUps: async (params: any = {}) => {
    try {
      const response = await axios.get(`${c.PHONECALLS}/follow-ups/pending`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching pending follow-ups:', error);
      throw error;
    }
  },

  // Generate phone call report
  getPhoneCallReport: async (params: any = {}) => {
    try {
      const response = await axios.get(`${c.PHONECALLS}/reports`, { params });
      return response.data;
    } catch (error) {
      console.error('Error generating phone call report:', error);
      throw error;
    }
  }
};

export default phoneCallService;
