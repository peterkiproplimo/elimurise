import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:9000/api/';

class GoogleDriveService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}project-evidences`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token if available
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Upload existing project evidence to Google Drive
   * @param {string} projectId - Project evidence ID
   * @returns {Promise<Object>} - Upload result
   */
  async uploadToGoogleDrive(projectId) {
    try {
      const response = await this.api.post(`/${projectId}/upload-to-drive`);
      return {
        success: true,
        data: response.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: error.response?.data
      };
    }
  }

  /**
   * Get Google Drive file information for a project evidence
   * @param {string} projectId - Project evidence ID
   * @returns {Promise<Object>} - File information
   */
  async getGoogleDriveInfo(projectId) {
    try {
      const response = await this.api.get(`/${projectId}/google-drive-info`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error getting Google Drive info:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: error.response?.data
      };
    }
  }

  /**
   * Create new project evidence with optional Google Drive upload
   * @param {FormData} formData - Form data containing project evidence and file
   * @param {boolean} uploadToGoogleDrive - Whether to upload to Google Drive
   * @returns {Promise<Object>} - Creation result
   */
  async createProjectEvidence(formData, uploadToGoogleDrive = false) {
    try {
      // Add uploadToGoogleDrive flag to form data
      formData.append('uploadToGoogleDrive', uploadToGoogleDrive);

      const response = await this.api.post('/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error creating project evidence:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: error.response?.data
      };
    }
  }

  /**
   * Get all project evidences with optional filtering
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} - Project evidences list
   */
  async getProjectEvidences(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await this.api.get(`/?${params.toString()}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error getting project evidences:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Get single project evidence
   * @param {string} projectId - Project evidence ID
   * @returns {Promise<Object>} - Project evidence data
   */
  async getProjectEvidence(projectId) {
    try {
      const response = await this.api.get(`/${projectId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error getting project evidence:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Update project evidence
   * @param {string} projectId - Project evidence ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Update result
   */
  async updateProjectEvidence(projectId, updateData) {
    try {
      const response = await this.api.put(`/${projectId}`, updateData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating project evidence:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Delete project evidence
   * @param {string} projectId - Project evidence ID
   * @returns {Promise<Object>} - Deletion result
   */
  async deleteProjectEvidence(projectId) {
    try {
      const response = await this.api.delete(`/${projectId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error deleting project evidence:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Add teacher feedback to project evidence
   * @param {string} projectId - Project evidence ID
   * @param {Object} feedbackData - Feedback data
   * @returns {Promise<Object>} - Feedback result
   */
  async addTeacherFeedback(projectId, feedbackData) {
    try {
      const response = await this.api.post(`/${projectId}/feedback`, feedbackData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error adding teacher feedback:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Toggle project evidence status
   * @param {string} projectId - Project evidence ID
   * @returns {Promise<Object>} - Status toggle result
   */
  async toggleProjectEvidenceStatus(projectId) {
    try {
      const response = await this.api.patch(`/${projectId}/toggle-status`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error toggling project evidence status:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Check if project evidence is uploaded to Google Drive
   * @param {Object} projectEvidence - Project evidence object
   * @returns {boolean} - Whether it's uploaded to Google Drive
   */
  isUploadedToGoogleDrive(projectEvidence) {
    return projectEvidence.googleDriveData && 
           projectEvidence.googleDriveData.fileId && 
           projectEvidence.googleDriveData.webViewLink;
  }

  /**
   * Get Google Drive view link for project evidence
   * @param {Object} projectEvidence - Project evidence object
   * @returns {string|null} - Google Drive view link or null
   */
  getGoogleDriveViewLink(projectEvidence) {
    if (this.isUploadedToGoogleDrive(projectEvidence)) {
      return projectEvidence.googleDriveData.webViewLink;
    }
    return null;
  }

  /**
   * Get Google Drive download link for project evidence
   * @param {Object} projectEvidence - Project evidence object
   * @returns {string|null} - Google Drive download link or null
   */
  getGoogleDriveDownloadLink(projectEvidence) {
    if (this.isUploadedToGoogleDrive(projectEvidence)) {
      return projectEvidence.googleDriveData.webContentLink;
    }
    return null;
  }

  /**
   * Get project folder name from Google Drive data
   * @param {Object} projectEvidence - Project evidence object
   * @returns {string|null} - Project folder name or null
   */
  getProjectFolderName(projectEvidence) {
    if (this.isUploadedToGoogleDrive(projectEvidence)) {
      return projectEvidence.googleDriveData.projectFolderName;
    }
    return null;
  }
}

// Create singleton instance
const googleDriveService = new GoogleDriveService();

export default googleDriveService;
