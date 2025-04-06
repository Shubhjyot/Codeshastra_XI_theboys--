import React, { useState } from 'react';
import Layout from '../components/Layout';
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
  const darkMode = true;
  const [activeTab, setActiveTab] = useState('all');
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      title: 'Critical Anomaly Detected',
      description: 'Multiple unauthorized discounts exceeding $5,000 detected in the last 24 hours.',
      severity: 'critical',
      date: '2023-05-15 09:23 AM',
      isRead: false
    },
    {
      id: 2,
      title: 'New High-Risk Transaction',
      description: 'Unusual transaction pattern detected for customer ID #45892.',
      severity: 'high',
      date: '2023-05-14 03:45 PM',
      isRead: false
    },
    {
      id: 3,
      title: 'Weekly Audit Report Available',
      description: 'The weekly audit report for May 7-13 is now available for review.',
      severity: 'medium',
      date: '2023-05-14 08:00 AM',
      isRead: true
    },
    {
      id: 4,
      title: 'System Update Scheduled',
      description: 'A system update is scheduled for May 20, 2023 at 2:00 AM EST.',
      severity: 'low',
      date: '2023-05-13 11:30 AM',
      isRead: true
    },
    {
      id: 5,
      title: 'New User Registered',
      description: 'A new administrator account was created by user ID #admin123.',
      severity: 'medium',
      date: '2023-05-12 02:15 PM',
      isRead: false
    }
  ]);

  const markAsRead = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const filteredAlerts = activeTab === 'all' 
    ? alerts 
    : activeTab === 'unread' 
      ? alerts.filter(alert => !alert.isRead)
      : alerts.filter(alert => alert.severity === activeTab);

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
          <h1 style={styles.title}>Alerts & Notifications</h1>
          <div style={styles.actions}>
            <button style={styles.actionButton}>Mark All as Read</button>
            <button style={styles.actionButton}>Settings</button>
          </div>
        </div>

        <div style={styles.tabs}>
          <button 
            style={activeTab === 'all' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            style={activeTab === 'unread' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('unread')}
          >
            Unread
          </button>
          <button 
            style={activeTab === 'critical' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('critical')}
          >
            Critical
          </button>
          <button 
            style={activeTab === 'high' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('high')}
          >
            High
          </button>
          <button 
            style={activeTab === 'medium' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('medium')}
          >
            Medium
          </button>
          <button 
            style={activeTab === 'low' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('low')}
          >
            Low
          </button>
        </div>

        <div style={styles.alertsContainer}>
          {filteredAlerts.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No alerts to display</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div 
                key={alert.id} 
                style={{
                  ...styles.alertCard,
                  backgroundColor: alert.isRead ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.08)',
                  borderLeft: `4px solid ${getSeverityColor(alert.severity)}`
                }}
              >
                <div style={styles.alertHeader}>
                  <h3 style={styles.alertTitle}>
                    {!alert.isRead && <span style={styles.unreadDot}></span>}
                    {alert.title}
                  </h3>
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
                  <div style={styles.alertActions}>
                    {!alert.isRead && (
                      <button 
                        style={styles.alertButton}
                        onClick={() => markAsRead(alert.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                    <Link href={`/alerts/${alert.id}`}>
                      <button style={styles.alertButton}>View Details</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1000px',
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
  actionButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabs: {
    display: 'flex' as const,
    gap: '0.5rem',
    marginBottom: '2rem',
    overflowX: 'auto' as const,
    padding: '0.5rem 0',
  },
  tab: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#e6f1ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const,
  },
  activeTab: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(0, 183, 255, 0.2)',
    color: '#00b7ff',
    border: '1px solid #00b7ff',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  alertsContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  alertCard: {
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  alertHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: '0.75rem',
  },
  alertTitle: {
    fontSize: '1.1rem',
    color: '#e6f1ff',
    fontWeight: '500' as const,
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '0.5rem',
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#00b7ff',
  },
  severityBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '500' as const,
  },
  alertDescription: {
    marginBottom: '1rem',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.5',
  },
  alertFooter: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  alertDate: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  alertActions: {
    display: 'flex' as const,
    gap: '0.5rem',
  },
  alertButton: {
    padding: '0.4rem 0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
  },
  emptyState: {
    padding: '3rem',
    textAlign: 'center' as const,
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
  },
};

export default AlertsPage;