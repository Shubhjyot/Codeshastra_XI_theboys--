// Update your AnomalyDashboard component to use the API
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApi } from '../context/ApiContext';

type AnomalyDashboardProps = {
  darkMode?: boolean;
};

const AnomalyDashboard = ({ darkMode = true }: AnomalyDashboardProps) => {
  const [timeRange, setTimeRange] = useState('week');
  const [anomalies, setAnomalies] = useState([]);
  const [stats, setStats] = useState<any>(null);
  
  const { 
    fetchAnomalies, 
    fetchAnomalyStats, 
    loading, 
    errors 
  } = useApi();

  useEffect(() => {
    const loadData = async () => {
      const anomaliesData = await fetchAnomalies({ timeframe: timeRange });
      if (anomaliesData) {
        setAnomalies(anomaliesData);
      }
      
      const statsData = await fetchAnomalyStats(timeRange);
      if (statsData) {
        setStats(statsData);
      }
    };
    
    loadData();
  }, [timeRange]);

  // Mock data for anomalies
  const recentAnomalies = [
    { id: 1, type: 'Unauthorized Discount', severity: 'High', date: '2023-05-15', amount: '$1,245.00' },
    { id: 2, type: 'Tax Miscalculation', severity: 'Medium', date: '2023-05-14', amount: '$345.50' },
    { id: 3, type: 'Pricing Modification', severity: 'High', date: '2023-05-13', amount: '$2,100.00' },
    { id: 4, type: 'Suspicious Transaction', severity: 'Medium', date: '2023-05-12', amount: '$780.25' },
    { id: 5, type: 'Duplicate Entry', severity: 'Low', date: '2023-05-11', amount: '$450.00' },
  ];

  // Helper function for severity colors
  const getSeverityColor = (severity: string) => {
    if (severity === 'High') return '#ff6b6b';
    if (severity === 'Medium') return '#ffd166';
    return '#06d6a0';
  };

  const getSeverityBgColor = (severity: string) => {
    if (severity === 'High') return 'rgba(255, 107, 107, 0.2)';
    if (severity === 'Medium') return 'rgba(255, 209, 102, 0.2)';
    return 'rgba(6, 214, 160, 0.2)';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Anomaly Detection Dashboard</h1>
      
      <div style={styles.timeFilter}>
        <button 
          style={timeRange === 'week' ? styles.activeButton : styles.button}
          onClick={() => setTimeRange('week')}
        >
          This Week
        </button>
        <button 
          style={timeRange === 'month' ? styles.activeButton : styles.button}
          onClick={() => setTimeRange('month')}
        >
          This Month
        </button>
        <button 
          style={timeRange === 'quarter' ? styles.activeButton : styles.button}
          onClick={() => setTimeRange('quarter')}
        >
          This Quarter
        </button>
      </div>
      
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Anomalies</h3>
          <p style={styles.statValue}>51</p>
          <p style={styles.statChange}>+12% from last period</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>High Severity</h3>
          <p style={styles.statValue}>15</p>
          <p style={styles.statChange}>+5% from last period</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Potential Impact</h3>
          <p style={styles.statValue}>$12,450</p>
          <p style={styles.statChange}>+8% from last period</p>
        </div>
      </div>
      
      <div style={styles.tableContainer}>
        <h2 style={styles.sectionTitle}>Recent Anomalies</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>ID</th>
              <th style={styles.tableHeader}>Type</th>
              <th style={styles.tableHeader}>Severity</th>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Amount</th>
              <th style={styles.tableHeader}>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentAnomalies.map(anomaly => (
              <tr key={anomaly.id} style={styles.tableRow}>
                <td style={styles.tableCell}>{anomaly.id}</td>
                <td style={styles.tableCell}>{anomaly.type}</td>
                <td style={styles.tableCell}>
                  <span style={{
                    ...styles.severityBadge,
                    backgroundColor: getSeverityBgColor(anomaly.severity),
                    color: getSeverityColor(anomaly.severity),
                  }}>
                    {anomaly.severity}
                  </span>
                </td>
                <td style={styles.tableCell}>{anomaly.date}</td>
                <td style={styles.tableCell}>{anomaly.amount}</td>
                <td style={styles.tableCell}>
                  <button style={styles.viewButton}>View</button>
                  <button style={styles.resolveButton}>Resolve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    color: '#e6f1ff',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#e6f1ff',
    fontWeight: 'bold' as const,
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#e6f1ff',
  },
  timeFilter: {
    display: 'flex' as const,
    gap: '1rem',
    marginBottom: '2rem',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#00b7ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(0, 183, 255, 0.5)',
  },
  statsContainer: {
    display: 'flex' as const,
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    flex: '1',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  statTitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '0.5rem',
    fontWeight: 'normal' as const,
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold' as const,
    color: '#00b7ff',
    margin: '0.5rem 0',
  },
  statChange: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.9rem',
  },
  tableContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '1rem',
  },
  tableHeader: {
    textAlign: 'left' as const,
    padding: '0.75rem 1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
  },
  tableRow: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  tableCell: {
    padding: '0.75rem 1rem',
    color: '#e6f1ff',
  },
  severityBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    display: 'inline-block',
    fontWeight: '500' as const,
    fontSize: '0.85rem',
  },
  viewButton: {
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(0, 183, 255, 0.2)',
    color: '#00b7ff',
    border: '1px solid #00b7ff',
    borderRadius: '4px',
    marginRight: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
  },
  resolveButton: {
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(6, 214, 160, 0.2)',
    color: '#06d6a0',
    border: '1px solid #06d6a0',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
  },
};

export default AnomalyDashboard;