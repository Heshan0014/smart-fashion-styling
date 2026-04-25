/**
 * Seller API Service
 * Handles all API calls related to seller registration and management
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const sellerAPI = {
  /**
   * Submit a new seller registration
   */
  submitRegistration: async (sellerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sellers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellerData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit registration');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting seller registration:', error);
      throw error;
    }
  },

  /**
   * Get all sellers with optional filters
   */
  getAllSellers: async (page = 0, size = 10, status = null, search = null) => {
    try {
      let url = `${API_BASE_URL}/sellers?page=${page}&size=${size}`;
      
      if (status) {
        url += `&status=${status}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sellers');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching sellers:', error);
      throw error;
    }
  },

  /**
   * Get seller by ID
   */
  getSellerById: async (sellerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch seller');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching seller:', error);
      throw error;
    }
  },

  /**
   * Get seller statistics
   */
  getSellerStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sellers/stats/overview`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching seller statistics:', error);
      throw error;
    }
  },

  /**
   * Approve a seller registration
   */
  approveSeller: async (sellerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to approve seller');
      }

      return await response.json();
    } catch (error) {
      console.error('Error approving seller:', error);
      throw error;
    }
  },

  /**
   * Reject a seller registration
   */
  rejectSeller: async (sellerId, rejectionReason) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectionReason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject seller');
      }

      return await response.json();
    } catch (error) {
      console.error('Error rejecting seller:', error);
      throw error;
    }
  },

  /**
   * Update seller information
   */
  updateSeller: async (sellerId, sellerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellerData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update seller');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating seller:', error);
      throw error;
    }
  },

  /**
   * Delete a seller
   */
  deleteSeller: async (sellerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete seller');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting seller:', error);
      throw error;
    }
  },

  /**
   * Seller login
   */
  sellerLogin: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sellers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error during seller login:', error);
      throw error;
    }
  },

  /**
   * Reset seller password (admin only)
   */
  resetSellerPassword: async (sellerId, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/reset-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reset password');
      }

      return await response.json();
    } catch (error) {
      console.error('Error resetting seller password:', error);
      throw error;
    }
  },
};

export default sellerAPI;
