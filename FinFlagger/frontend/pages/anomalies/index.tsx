import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useApi } from '../../context/ApiContext';
import type { Notification, ReportOptions } from '../../types/anomaly';
import type { Anomaly } from '../../types/anomaly';
import AnomalyCard from '../../components/anomalies/AnomalyCard';
import NotificationSystem from '../../components/anomalies/NotificationSystem';
import ReportModal from '../../components/anomalies/ReportModal';
import FilterBar from '../../components/anomalies/FilterBar';
import EmptyState from '../../components/anomalies/EmptyState';
import { useRouter } from 'next/router';

type AnomaliesPageProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

// Add this import at the top of the file
import { exportAnomalies } from '../../utils/exportUtils';

const AnomaliesPage = ({ darkMode, toggleDarkMode }: AnomaliesPageProps) => {
  const router = useRouter();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    category: 'all',
    timeRange: 'all'
  });
  
  // Report-related state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    timeRange: 'all',
    categories: [],
    statuses: [],
    severities: [],
    format: 'pdf',
    includeDetails: true
  });
  const [generatingReport, setGeneratingReport] = useState(false);
  
  // Notification-related state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationSound] = useState(
    typeof Audio !== 'undefined' ? new Audio('/notification-sound.mp3') : null
  );
  
  const { fetchAnomalies, generateReport, fetchNotifications, markNotificationAsRead } = useApi();

  useEffect(() => {
    const loadAnomalies = async () => {
      try {
        const data = await fetchAnomalies(filters);
        
        // Apply client-side filtering if the API doesn't support filtering
        let filteredData = data || [];
        
        // Filter by status if not 'all'
        if (filters.status !== 'all') {
          filteredData = filteredData.filter(
            (anomaly: Anomaly) => anomaly.status.toLowerCase() === filters.status.toLowerCase()
          );
        }
        
        // Filter by severity if not 'all'
        if (filters.severity !== 'all') {
          filteredData = filteredData.filter(
            (anomaly: Anomaly) => anomaly.severity.toLowerCase() === filters.severity.toLowerCase()
          );
        }
        
        // Filter by category if not 'all'
        if (filters.category !== 'all') {
          filteredData = filteredData.filter(
            (anomaly: Anomaly) => anomaly.category.toLowerCase().replace(/\s+/g, '_') === filters.category.toLowerCase()
          );
        }
        
        // Filter by time range if not 'all'
        if (filters.timeRange !== 'all') {
          const now = new Date();
          let startDate = new Date();
          
          switch(filters.timeRange) {
            case 'today':
              startDate.setHours(0, 0, 0, 0);
              break;
            case 'week':
              startDate.setDate(now.getDate() - 7);
              break;
            case 'month':
              startDate.setMonth(now.getMonth() - 1);
              break;
            case 'quarter':
              startDate.setMonth(now.getMonth() - 3);
              break;
          }
          
          filteredData = filteredData.filter(
            (anomaly: Anomaly) => new Date(anomaly.detectedAt) >= startDate
          );
        }
        
        setAnomalies(filteredData);
      } catch (err) {
        setError('An error occurred while fetching anomalies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAnomalies();
  }, [fetchAnomalies, filters]);

  // Notification polling effect
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data || []);
        setUnreadCount(data.filter((notification: Notification) => !notification.read).length);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };
    
    loadNotifications();
    
    // Set up polling for new notifications
    const notificationInterval = setInterval(async () => {
      try {
        const data = await fetchNotifications();
        
        // Check if there are new notifications
        if (data.length > notifications.length) {
          // Find new high severity notifications
          const newHighSeverityNotifications = data.filter(
            (notification: Notification) => 
              notification.severity === 'high' && 
              !notifications.some(n => n.id === notification.id)
          );
          
          // Play sound and show alert for new high severity notifications
          if (newHighSeverityNotifications.length > 0) {
            // Play notification sound
            notificationSound?.play().catch(e => console.error('Failed to play notification sound:', e));
            
            // Show browser notification if supported
            if ('Notification' in window && Notification.permission === 'granted') {
              newHighSeverityNotifications.forEach(notification => {
                new Notification('High Severity Anomaly Detected', {
                  body: notification.message,
                  icon: '/favicon.ico'
                });
              });
            } else if ('Notification' in window && Notification.permission !== 'denied') {
              Notification.requestPermission();
            }
          }
        }
        
        setNotifications(data || []);
        setUnreadCount(data.filter((notification: Notification) => !notification.read).length);
      } catch (err) {
        console.error('Failed to poll notifications:', err);
      }
    }, 30000); // Poll every 30 seconds
    
    return () => {
      clearInterval(notificationInterval);
    };
  }, [fetchNotifications, notifications, notificationSound]);

  // Helper functions
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return '#ff4d4f';
      case 'medium':
        return '#faad14';
      case 'low':
        return '#52c41a';
      default:
        return '#1890ff';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Helper function to get status background color
  const getStatusBackgroundColor = (status: string): string => {
    if (status === 'Open') return 'rgba(24, 144, 255, 0.1)';
    if (status === 'Investigating') return 'rgba(250, 173, 20, 0.1)';
    return 'rgba(82, 196, 26, 0.1)';
  };

  // Helper function to get status text color
  const getStatusTextColor = (status: string): string => {
    if (status === 'Open') return '#1890ff';
    if (status === 'Investigating') return '#faad14';
    return '#52c41a';
  };

  const handleReportOptionChange = (option: keyof ReportOptions, value: any) => {
    setReportOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  // Replace the existing handleMultiSelectChange function with these two functions
  const addOptionToMultiSelect = (option: 'categories' | 'statuses' | 'severities', value: string) => {
  setReportOptions(prev => ({
    ...prev,
    [option]: [...prev[option], value]
  }));
  };
  
  const removeOptionFromMultiSelect = (option: 'categories' | 'statuses' | 'severities', value: string) => {
  setReportOptions(prev => ({
    ...prev,
    [option]: prev[option].filter(item => item !== value)
  }));
  };
  
  const handleMultiSelectChange = (option: 'categories' | 'statuses' | 'severities', value: string, checked: boolean) => {
  const updatedOptions = checked 
    ? [...reportOptions[option], value]
    : reportOptions[option].filter(item => item !== value);
    
  setReportOptions(prev => ({
    ...prev,
    [option]: updatedOptions
  }));
};

  const generateCustomReport = async () => {
    try {
      setGeneratingReport(true);
      
      // Prepare report data based on current filters and report options
      const reportData = {
        ...reportOptions,
        anomalies: anomalies.filter(anomaly => {
          // Filter by selected categories
          if (reportOptions.categories.length > 0 && !reportOptions.categories.includes(anomaly.category)) {
            return false;
          }
          
          // Filter by selected statuses
          if (reportOptions.statuses.length > 0 && !reportOptions.statuses.includes(anomaly.status)) {
            return false;
          }
          
          // Filter by selected severities
          if (reportOptions.severities.length > 0 && !reportOptions.severities.includes(anomaly.severity)) {
            return false;
          }
          
          return true;
        })
      };
      
      // Call API to generate report
      const reportUrl = await generateReport(reportData);
      
      // Open report in new tab or download it
      window.open(reportUrl, '_blank');
      
      // Close modal after successful generation
      setShowReportModal(false);
    } catch (err) {
      setError('An error occurred while generating the report');
      console.error(err);
    } finally {
      setGeneratingReport(false);
    }
  };

  // Add notification handling functions
  const handleNotificationClick = (notification: Notification) => {
    // Mark notification as read
    if (!notification.read) {
      markNotificationAsRead(notification.id);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    // Force a hard navigation
    window.location.href = `/anomalies/${notification.anomalyId}`;
  };
  
  const handleMarkAllAsRead = () => {
    // Mark all notifications as read in the API
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationAsRead(notification.id);
      }
    });
    
    // Update local state
    setNotifications(prevNotifications => 
      prevNotifications.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  if (loading) {
    return (
      <Layout darkMode={darkMode}>
        <div style={styles.loadingContainer}>
          <p>Loading anomalies...</p>
        </div>
      </Layout>
    );
  }

  // Inside the AnomaliesPage component, add these functions:
  const handleExportCSV = () => {
  exportAnomalies(anomalies, 'csv');
  };
  
  const handleExportPDF = () => {
  exportAnomalies(anomalies, 'pdf');
  };

  return (
    <Layout darkMode={darkMode}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <h1 style={styles.title}>Anomalies</h1>
            <div style={styles.headerActions}>
              {/* Notification system */}
              <NotificationSystem 
                notifications={notifications}
                unreadCount={unreadCount}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                handleNotificationClick={handleNotificationClick}
                handleMarkAllAsRead={handleMarkAllAsRead}
                getSeverityColor={getSeverityColor}
                formatNotificationTime={formatNotificationTime}
              />
              
              {/* Export buttons */}
              <button 
                style={styles.exportButton} 
                onClick={handleExportCSV}
                disabled={anomalies.length === 0}
              >
                Export CSV
              </button>
              
              <button 
                style={styles.exportButton} 
                onClick={handleExportPDF}
                disabled={anomalies.length === 0}
              >
                Export PDF
              </button>
              
              <button 
                style={styles.reportButton} 
                onClick={() => setShowReportModal(true)}
              >
                Generate Report
              </button>
            </div>
          </div>
          <p style={styles.subtitle}>
            Investigate and manage detected financial anomalies
          </p>
        </div>

        {/* Filters */}
        <FilterBar 
          filters={filters}
          handleFilterChange={handleFilterChange}
        />

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {anomalies.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={styles.anomaliesGrid}>
            {anomalies.map((anomaly) => (
              <AnomalyCard 
                key={anomaly.id}
                anomaly={anomaly}
                getSeverityColor={getSeverityColor}
                getStatusBackgroundColor={getStatusBackgroundColor}
                getStatusTextColor={getStatusTextColor}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        {/* Report Modal */}
        <ReportModal 
          showReportModal={showReportModal}
          setShowReportModal={setShowReportModal}
          reportOptions={reportOptions}
          handleReportOptionChange={handleReportOptionChange}
          handleMultiSelectChange={handleMultiSelectChange}
          generateCustomReport={generateCustomReport}
          generatingReport={generatingReport}
        />
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '2rem',
  },
  headerTop: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  headerActions: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '1rem',
  },
  title: {
    fontSize: '2rem',
    color: '#e6f1ff',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  reportButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(0, 183, 255, 0.1)',
    color: '#00b7ff',
    border: '1px solid #00b7ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  loadingContainer: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    height: '50vh',
  },
  errorMessage: {
    padding: '1rem',
    backgroundColor: 'rgba(255, 77, 79, 0.1)',
    color: '#ff4d4f',
    borderRadius: '4px',
    marginBottom: '2rem',
  },
  anomaliesGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  exportButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    color: '#64ffda',
    border: '1px solid #64ffda',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    marginRight: '0.5rem',
  },
};

export default AnomaliesPage;