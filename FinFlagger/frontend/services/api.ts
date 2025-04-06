import axios from 'axios';

// Base configuration for API requests
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Error handling wrapper
const handleApiError = async (apiCall: Promise<any>) => {
  try {
    const response = await apiCall;
    return { data: response.data, error: null };
  } catch (error: any) {
    console.error('API Error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return { 
        data: null, 
        error: {
          status: error.response.status,
          message: error.response.data.message || 'Server error occurred',
          details: error.response.data
        } 
      };
    } else if (error.request) {
      // The request was made but no response was received
      return { 
        data: null, 
        error: {
          status: 0,
          message: 'No response from server. Please check your connection.',
          details: error.request
        } 
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return { 
        data: null, 
        error: {
          status: 0,
          message: error.message || 'An unexpected error occurred',
          details: error
        } 
      };
    }
  }
};

// Retry mechanism
const withRetry = async (apiCall: () => Promise<any>, maxRetries = 3, delay = 1000) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    const { data, error } = await handleApiError(apiCall());
    
    if (!error || (error.status !== 0 && error.status !== 429 && error.status < 500)) {
      // If no error or if error is not retriable (not a timeout, rate limit, or server error)
      return { data, error };
    }
    
    // Exponential backoff
    const waitTime = delay * Math.pow(2, retries);
    console.log(`Retrying API call in ${waitTime}ms... (${retries + 1}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    retries++;
  }
  
  // If we've exhausted all retries
  return { 
    data: null, 
    error: { 
      status: 0, 
      message: 'Maximum retries exceeded', 
      details: null 
    } 
  };
};

// API endpoints for anomaly detection
export const anomalyApi = {
  // Get all detected anomalies
  getAnomalies: async (filters = {}) => {
    return await withRetry(() => apiClient.get('/anomalies', { params: filters }));
  },
  
  // Get a specific anomaly by ID
  getAnomalyById: async (id: string | number) => {
    return await withRetry(() => apiClient.get(`/anomalies/${id}`));
  },
  
  // Submit data for anomaly detection
  detectAnomalies: async (data: any) => {
    return await withRetry(() => apiClient.post('/anomalies/detect', data));
  },
  
  // Update anomaly status (e.g., mark as resolved)
  updateAnomalyStatus: async (id: string | number, status: string, resolution?: any) => {
    return await withRetry(() => apiClient.patch(`/anomalies/${id}/status`, { status, resolution }));
  },
  
  // Get anomaly statistics
  getAnomalyStats: async (timeframe = 'week') => {
    return await withRetry(() => apiClient.get('/anomalies/stats', { params: { timeframe } }));
  },
  
  // Provide feedback on anomaly detection (for model improvement)
  provideFeedback: async (id: string | number, feedback: { isAccurate: boolean, comments?: string }) => {
    return await withRetry(() => apiClient.post(`/anomalies/${id}/feedback`, feedback));
  }
};

// API endpoints for audit reports
export const auditApi = {
  // Get all audit reports
  getReports: async (filters = {}) => {
    return await withRetry(() => apiClient.get('/audit-reports', { params: filters }));
  },
  
  // Get a specific audit report
  getReportById: async (id: string | number) => {
    return await withRetry(() => apiClient.get(`/audit-reports/${id}`));
  },
  
  // Generate a new audit report
  generateReport: async (params: any) => {
    return await withRetry(() => apiClient.post('/audit-reports/generate', params));
  },
  
  // Export a report in different formats
  exportReport: async (id: string | number, format: 'pdf' | 'csv' | 'excel') => {
    return await withRetry(() => 
      apiClient.get(`/audit-reports/${id}/export`, { 
        params: { format },
        responseType: 'blob'
      })
    );
  }
};

export default {
  anomaly: anomalyApi,
  audit: auditApi
};