import React, { createContext, useContext, useState, ReactNode } from 'react';
import { anomalyApi, auditApi } from '../services/api';

// Mock data for development without the actual ML model
import mockAnomalies from '../mocks/anomalies.json';
import mockReports from '../mocks/reports.json';

// Define the Notification type
export type Notification = {
  id: string | number;
  anomalyId: string | number;
  title: string;
  message: string;
  severity: string;
  read: boolean;
  createdAt: string;
};

// Define the API context type
export type ApiContextType = {
  loading: { [key: string]: boolean };
  errors: { [key: string]: any };
  fetchAnomalies: (filters?: any) => Promise<any>;
  fetchAnomalyById: (id: string | number) => Promise<any>;
  detectAnomalies: (data: any) => Promise<any>;
  updateAnomalyStatus: (id: string | number, status: string, resolution?: any) => Promise<any>;
  fetchAnomalyStats: (timeframe?: string) => Promise<any>;
  provideFeedback: (id: string | number, feedback: any) => Promise<any>;
  fetchReports: (filters?: any) => Promise<any>;
  fetchReportById: (id: string | number) => Promise<any>;
  generateReport: (params: any) => Promise<any>;
  exportReport: (id: string | number, format: 'pdf' | 'csv' | 'excel') => Promise<any>;
  useMockData: boolean;
  setUseMockData: (use: boolean) => void;
  uploadTransactionFile: (file: File) => Promise<any>;
  fetchNotifications: () => Promise<Notification[]>;
  markNotificationAsRead: (id: string | number) => Promise<void>;
  addAnomalyComment: (id: string | number, comment: string) => Promise<any>;
  fetchDashboardStats: () => Promise<any>;
  fetchTransactionHistory: (accountId?: string | number) => Promise<any>;
  fetchRiskScore: (accountId: string | number) => Promise<any>;
  fetchAlertSettings: () => Promise<any>;
  updateAlertSettings: (settings: any) => Promise<any>;
  submitAnomalyFeedback: (anomalyId: string, isTruePositive: boolean, comments: string) => Promise<void>;
  getAnomalyFeedback: (anomalyId: string) => Promise<{ isTruePositive: boolean; comments: string } | null>;
};

// Keep only one declaration of ApiContext (around line 49)
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// We need to extend the anomalyApi interface to include the missing methods
interface ExtendedAnomalyApi {
  getAnomalies: (filters?: {}) => Promise<{ data: any; error: { status: any; message: any; details: any; } | null; }>;
  getAnomalyById: (id: string | number) => Promise<{ data: any; error: { status: any; message: any; details: any; } | null; }>;
  detectAnomalies: (data: any) => Promise<any>;
  updateAnomalyStatus: (id: string | number, status: string, resolution?: any) => Promise<any>;
  getAnomalyStats: (timeframe?: string) => Promise<any>;
  provideFeedback: (id: string | number, feedback: any) => Promise<any>;
  addComment: (id: string | number, comment: string) => Promise<any>;
  getDashboardStats: () => Promise<any>;
  getTransactionHistory: (accountId?: string | number) => Promise<any>;
  getRiskScore: (accountId: string | number) => Promise<any>;
  getAlertSettings: () => Promise<any>;
  updateAlertSettings: (settings: any) => Promise<any>;
}

// Cast anomalyApi to the extended interface
const extendedAnomalyApi = anomalyApi as unknown as ExtendedAnomalyApi;

// Remove this duplicate declaration (around line 77)
// const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const [useMockData, setUseMockData] = useState<boolean>(true); // Default to mock data until ML model is ready

  // Helper to manage loading state
  const withLoadingState = async (key: string, apiCall: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: null }));
    
    try {
      const result = await apiCall();
      
      if (result.error) {
        setErrors(prev => ({ ...prev, [key]: result.error }));
        return null;
      }
      
      return result.data;
    } catch (error) {
      setErrors(prev => ({ ...prev, [key]: error }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  // Mock data implementations
  const getMockAnomalies = (filters?: any) => {
    // Apply filters if needed
    return mockAnomalies;
  };

  const getMockAnomalyById = (id: string | number) => {
    return mockAnomalies.find(a => a.id.toString() === id.toString()) || null;
  };

  // API functions
  const fetchAnomalies = async (filters?: any) => {
    if (useMockData) {
      return getMockAnomalies(filters);
    }
    return await withLoadingState('fetchAnomalies', () => anomalyApi.getAnomalies(filters));
  };

  const fetchAnomalyById = async (id: string | number) => {
    if (useMockData) {
      return getMockAnomalyById(id);
    }
    return await withLoadingState(`fetchAnomaly_${id}`, () => anomalyApi.getAnomalyById(id));
  };

  const detectAnomalies = async (data: any) => {
    if (useMockData) {
      // Simulate detection with mock data
      return { 
        detected: Math.floor(Math.random() * 5) + 1,
        anomalies: getMockAnomalies().slice(0, Math.floor(Math.random() * 5) + 1)
      };
    }
    return await withLoadingState('detectAnomalies', () => anomalyApi.detectAnomalies(data));
  };

  const updateAnomalyStatus = async (id: string | number, status: string, resolution?: any) => {
    if (useMockData) {
      // Just return success for mock
      return { success: true, id, status };
    }
    return await withLoadingState(`updateStatus_${id}`, () => anomalyApi.updateAnomalyStatus(id, status, resolution));
  };

  const fetchAnomalyStats = async (timeframe = 'week') => {
    if (useMockData) {
      // Return mock stats
      return {
        total: 51,
        highSeverity: 15,
        financialImpact: 12450,
        byCategory: {
          'Unauthorized Discount': 18,
          'Tax Miscalculation': 12,
          'Pricing Modification': 15,
          'Suspicious Transaction': 6
        }
      };
    }
    return await withLoadingState(`stats_${timeframe}`, () => anomalyApi.getAnomalyStats(timeframe));
  };

  const provideFeedback = async (id: string | number, feedback: any) => {
    if (useMockData) {
      return { success: true, id };
    }
    return await withLoadingState(`feedback_${id}`, () => anomalyApi.provideFeedback(id, feedback));
  };

  const fetchReports = async (filters?: any) => {
    if (useMockData) {
      return mockReports;
    }
    return await withLoadingState('fetchReports', () => auditApi.getReports(filters));
  };

  const fetchReportById = async (id: string | number) => {
    if (useMockData) {
      return mockReports.find(r => r.id.toString() === id.toString()) || null;
    }
    return await withLoadingState(`fetchReport_${id}`, () => auditApi.getReportById(id));
  };

  const generateReport = async (params: any) => {
    if (useMockData) {
      return { 
        id: `report-${Date.now()}`,
        name: params.name || `Audit Report ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString(),
        status: 'Completed'
      };
    }
    return await withLoadingState('generateReport', () => auditApi.generateReport(params));
  };

  const exportReport = async (id: string | number, format: 'pdf' | 'csv' | 'excel') => {
    if (useMockData) {
      // Mock export - in real implementation, this would return a blob
      return { success: true, id, format };
    }
    return await withLoadingState(`export_${id}_${format}`, () => auditApi.exportReport(id, format));
  };

  const uploadTransactionFile = async (file: File) => {
    try {
      // In a real implementation, you would use FormData to upload the file
      const formData = new FormData();
      formData.append('file', file);
      
      // For now, we'll simulate the API call with a timeout
      // Replace this with your actual API endpoint
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock response
          resolve({
            success: true,
            reportId: Math.floor(Math.random() * 1000) + 1, // Random report ID
            message: 'File uploaded and processed successfully'
          });
        }, 2000);
      });
    } catch (error) {
      console.error('Error uploading transaction file:', error);
      throw error;
    }
  };

  // Add mock notifications for testing
  const mockNotifications: Notification[] = [
    {
      id: 1,
      anomalyId: 101,
      title: 'High Severity Anomaly Detected',
      message: 'Unusual transaction pattern detected in account #12345',
      severity: 'high',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
    },
    {
      id: 2,
      anomalyId: 102,
      title: 'Potential Regulatory Violation',
      message: 'Transaction exceeds reporting threshold',
      severity: 'medium',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
    },
    {
      id: 3,
      anomalyId: 103,
      title: 'New Fraud Attempt Detected',
      message: 'Multiple failed authentication attempts',
      severity: 'high',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
    }
  ];

  // Add the notification functions
  const fetchNotifications = async (): Promise<Notification[]> => {
    try {
      setLoading(prev => ({ ...prev, notifications: true }));
      // Replace with actual API call when backend is ready
      // For now, return mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      setLoading(prev => ({ ...prev, notifications: false }));
      return mockNotifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(prev => ({ ...prev, notifications: false }));
      setErrors(prev => ({ ...prev, notifications: error }));
      return [];
    }
  };

  const markNotificationAsRead = async (id: string | number): Promise<void> => {
    try {
      setLoading(prev => ({ ...prev, markRead: true }));
      // Replace with actual API call when backend is ready
      console.log(`Marking notification ${id} as read`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setLoading(prev => ({ ...prev, markRead: false }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setLoading(prev => ({ ...prev, markRead: false }));
      setErrors(prev => ({ ...prev, markRead: error }));
    }
  };

  // Implement the missing functions
  const addAnomalyComment = async (id: string | number, comment: string) => {
    if (useMockData) {
      return { success: true, id, comment };
    }
    return await withLoadingState(`addComment_${id}`, () => extendedAnomalyApi.addComment(id, comment));
  };

  const fetchDashboardStats = async () => {
    if (useMockData) {
      return {
        totalAnomalies: 51,
        openAnomalies: 23,
        resolvedAnomalies: 28,
        highSeverityCount: 15,
        mediumSeverityCount: 20,
        lowSeverityCount: 16
      };
    }
    return await withLoadingState('dashboardStats', () => extendedAnomalyApi.getDashboardStats());
  };

  const fetchTransactionHistory = async (accountId?: string | number) => {
    if (useMockData) {
      return [
        { id: 1, amount: 1250.00, date: '2023-05-01T10:30:00Z', type: 'deposit' },
        { id: 2, amount: 450.75, date: '2023-05-03T14:22:00Z', type: 'withdrawal' },
        { id: 3, amount: 2000.00, date: '2023-05-10T09:15:00Z', type: 'transfer' }
      ];
    }
    return await withLoadingState('transactionHistory', () => extendedAnomalyApi.getTransactionHistory(accountId));
  };

  const fetchRiskScore = async (accountId: string | number) => {
    if (useMockData) {
      return { score: Math.floor(Math.random() * 100), lastUpdated: new Date().toISOString() };
    }
    return await withLoadingState(`riskScore_${accountId}`, () => extendedAnomalyApi.getRiskScore(accountId));
  };

  // Make sure these methods are properly implemented in the ApiProvider component
  const fetchAlertSettings = async () => {
    if (useMockData) {
      return {
        detectionSensitivity: 50,
        emailNotifications: true,
        pushNotifications: false,
        alertThreshold: 'medium',
        dailyDigest: true,
        autoResolveRules: false,
        dataRetentionPeriod: 90,
        teamNotifications: true,
        riskScoreThreshold: 65
      };
    }
    return await withLoadingState('alertSettings', () => extendedAnomalyApi.getAlertSettings());
  };
  
  const updateAlertSettings = async (settings: any) => {
    if (useMockData) {
      return { success: true, settings };
    }
    return await withLoadingState('updateAlertSettings', () => extendedAnomalyApi.updateAlertSettings(settings));
  };

  // Move these functions inside the ApiProvider component
  const submitAnomalyFeedback = async (anomalyId: string, isTruePositive: boolean, comments: string) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it with localStorage
      const feedbackData = {
        anomalyId,
        isTruePositive,
        comments,
        submittedAt: new Date().toISOString()
      };
      
      // Store feedback in localStorage
      localStorage.setItem(`anomaly_feedback_${anomalyId}`, JSON.stringify(feedbackData));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return;
    } catch (error) {
      console.error('Error submitting anomaly feedback:', error);
      throw error;
    }
  };

  const getAnomalyFeedback = async (anomalyId: string) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it with localStorage
      const feedbackData = localStorage.getItem(`anomaly_feedback_${anomalyId}`);
      
      if (!feedbackData) {
        return null;
      }
      
      const parsed = JSON.parse(feedbackData);
      return {
        isTruePositive: parsed.isTruePositive,
        comments: parsed.comments
      };
    } catch (error) {
      console.error('Error getting anomaly feedback:', error);
      return null;
    }
  };

  // Update the value object to include the new functions
  const value = React.useMemo<ApiContextType>(() => ({
    loading,
    errors,
    fetchAnomalies,
    fetchAnomalyById,
    detectAnomalies,
    updateAnomalyStatus,
    fetchAnomalyStats,
    provideFeedback,
    fetchReports,
    fetchReportById,
    generateReport,
    exportReport,
    useMockData,
    setUseMockData,
    uploadTransactionFile,
    fetchNotifications,
    markNotificationAsRead,
    addAnomalyComment,
    fetchDashboardStats,
    fetchTransactionHistory,
    fetchRiskScore,
    fetchAlertSettings,
    updateAlertSettings,
    submitAnomalyFeedback,  // Add this
    getAnomalyFeedback      // Add this
  }), [
    loading, 
    errors, 
    useMockData
    // We don't need to include the function dependencies since they don't change
  ]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};


// Remove these functions from outside the ApiProvider component
// (Delete the standalone submitAnomalyFeedback and getAnomalyFeedback functions at the end of the file)