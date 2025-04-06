import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';

interface Alert {
  id: number;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  date: string;
  isRead: boolean;
}

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const darkMode = true;

  useEffect(() => {
    // In a real app, you would fetch from an API
    // For now, we'll use mock data
    const mockAlerts: Alert[] = [
      {
        id: 1,
        title: 'Critical Anomaly Detected',
        description: 'Multiple unauthorized discounts exceeding $5,000 detected in the last 24 hours.',
        severity: 'critical',
        date: '2023-05-15 09:23 AM',
        isRead: false,
      },
      {
        id: 2,
        title: 'Unusual Transaction Pattern',
        description: 'Unusual pattern of voided transactions detected in Store #42.',
        severity: 'high',
        date: '2023-05-14 02:45 PM',
        isRead: true,
      },
      {
        id: 3,
        title: 'Potential Data Entry Error',
        description: 'Multiple inventory adjustments with identical quantities detected.',
        severity: 'medium',
        date: '2023-05-13 11:30 AM',
        isRead: true,
      },
      {
        id: 4,
        title: 'System Performance Alert',
        description: 'Transaction processing time exceeded threshold during peak hours.',
        severity: 'low',
        date: '2023-05-12 05:15 PM',
        isRead: true,
      },
    ];
    
    setAlerts(mockAlerts);
    setLoading(false);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return '#ff4d4d';
      case 'high': return '#ff9933';
      case 'medium': return '#ffcc00';
      case 'low': return '#00cc66';
      default: return '#00cc66';
    }
  };

  return (
    <Layout darkMode={darkMode}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Alerts</h1>
          <div style={styles.actions}>
            <button style={styles.filterButton}>
              <i className="fas fa-filter" style={styles.buttonIcon}></i>
              Filter
            </button>
            <button style={styles.settingsButton}>
              <i className="fas fa-cog" style={styles.buttonIcon}></i>
              Settings
            </button>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <p>Loading alerts...</p>
          </div>
        ) : (
          <div style={styles.alertsContainer}>
            {alerts.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No alerts found.</p>
              </div>
            ) : (
              alerts.map(alert => (
                <Link href={`/alerts/${alert.id}`} key={alert.id} legacyBehavior>
                  <a style={styles.alertLink}>
                    <div style={styles.alertCard}>
                      <div style={styles.alertHeader}>
                        <h3 style={styles.alertTitle}>{alert.title}</h3>
                        <span style={{
                          ...styles.severityBadge,
                          backgroundColor: `${getSeverityColor(alert.severity)}20`,
                          color: getSeverityColor(alert.severity)
                        }}>
                          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                        </span>
                      </div>
                      <p style={styles.alertDescription}>{alert.description}</p>
                      <div style={styles.alertFooter}>
                        <span style={styles.alertDate}>{alert.date}</span>
                        {!alert.isRead && <span style={styles.unreadBadge}>New</span>}
                      </div>
                    </div>
                  </a>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    color: '#e6f1ff',
  },
  header: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#e6f1ff',
    fontWeight: 'bold' as const,
  },
  actions: {
    display: 'flex' as const,
    gap: '1rem',
  },
  filterButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '0.5rem',
  },
  settingsButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '0.5rem',
  },
  buttonIcon: {
    fontSize: '0.9rem',
  },
  loadingContainer: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    height: '50vh',
  },
  emptyState: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    height: '50vh',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
  },
  alertsContainer: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' as const,
    gap: '1.5rem',
  },
  alertLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  alertCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  alertHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: '1rem',
  },
  alertTitle: {
    fontSize: '1.2rem',
    color: '#e6f1ff',
    fontWeight: '500' as const,
    marginRight: '1rem',
  },
  severityBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '500' as const,
    whiteSpace: 'nowrap' as const,
  },
  alertDescription: {
    fontSize: '0.95rem',
    lineHeight: '1.5',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '1.5rem',
    flex: '1',
  },
  alertFooter: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginTop: 'auto',
  },
  alertDate: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  unreadBadge: {
    padding: '0.2rem 0.5rem',
    backgroundColor: 'rgba(0, 183, 255, 0.2)',
    color: '#00b7ff',
    borderRadius: '4px',
    fontSize: '0.75rem',
  },
};

export default AlertsPage;