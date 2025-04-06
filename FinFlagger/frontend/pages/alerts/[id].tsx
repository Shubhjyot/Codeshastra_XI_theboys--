import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';

interface Alert {
  id: number;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  date: string;
  isRead: boolean;
  details?: string;
  relatedItems?: Array<{id: number, type: string, name: string}>;
}

const AlertDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const darkMode = true;

  useEffect(() => {
    if (id) {
      // In a real app, you would fetch from an API
      // For now, we'll use mock data
      const mockAlert: Alert = {
        id: Number(id),
        title: 'Critical Anomaly Detected',
        description: 'Multiple unauthorized discounts exceeding $5,000 detected in the last 24 hours.',
        severity: 'critical',
        date: '2023-05-15 09:23 AM',
        isRead: true,
        details: 'Our system has detected a pattern of unauthorized discounts being applied to transactions over the past 24 hours. The total value of these discounts exceeds $5,000, which is significantly above normal thresholds. The discounts appear to be concentrated in the electronics department and were processed by employee ID #1042.\n\nImmediate investigation is recommended to determine if this is a system error, policy misunderstanding, or potential fraud.',
        relatedItems: [
          { id: 1, type: 'Anomaly', name: 'Unauthorized Discount #1245' },
          { id: 2, type: 'Anomaly', name: 'Unauthorized Discount #1246' },
          { id: 3, type: 'Anomaly', name: 'Unauthorized Discount #1247' },
          { id: 4, type: 'User', name: 'Employee #1042' },
        ]
      };
      
      setAlert(mockAlert);
      setLoading(false);
    }
  }, [id]);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return '#ff4d4d';
      case 'high': return '#ff9933';
      case 'medium': return '#ffcc00';
      case 'low': return '#00cc66';
      default: return '#00cc66';
    }
  };

  if (loading) {
    return (
      <Layout darkMode={darkMode}>
        <div style={styles.loadingContainer}>
          <p>Loading alert details...</p>
        </div>
      </Layout>
    );
  }

  if (!alert) {
    return (
      <Layout darkMode={darkMode}>
        <div style={styles.errorContainer}>
          <h2>Alert Not Found</h2>
          <p>The requested alert could not be found.</p>
          <Link href="/alerts">
            <button style={styles.backButton}>Back to Alerts</button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout darkMode={darkMode}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Link href="/alerts">
            <button style={styles.backButton}>← Back to Alerts</button>
          </Link>
          <h1 style={styles.title}>Alert Details</h1>
        </div>

        <div style={styles.alertCard}>
          <div style={styles.alertHeader}>
            <h2 style={styles.alertTitle}>{alert.title}</h2>
            <span style={{
              ...styles.severityBadge,
              backgroundColor: `${getSeverityColor(alert.severity)}20`,
              color: getSeverityColor(alert.severity)
            }}>
              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
            </span>
          </div>

          <div style={styles.metaInfo}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Date:</span>
              <span style={styles.metaValue}>{alert.date}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Alert ID:</span>
              <span style={styles.metaValue}>#{alert.id}</span>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={styles.description}>{alert.description}</p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Details</h3>
            <p style={styles.details}>{alert.details}</p>
          </div>

          {alert.relatedItems && alert.relatedItems.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Related Items</h3>
              <div style={styles.relatedItems}>
                {alert.relatedItems.map(item => (
                  <div key={item.id} style={styles.relatedItem}>
                    <span style={styles.itemType}>{item.type}</span>
                    <span style={styles.itemName}>{item.name}</span>
                    <Link href={`/${item.type.toLowerCase()}/${item.id}`}>
                      <button style={styles.viewButton}>View</button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={styles.actions}>
            <button style={styles.resolveButton}>Mark as Resolved</button>
            <button style={styles.assignButton}>Assign to Team</button>
            <button style={styles.investigateButton}>Investigate</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    color: '#e6f1ff',
  },
  header: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#e6f1ff',
    fontWeight: 'bold' as const,
    marginLeft: '1rem',
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  alertCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  alertHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '1rem',
  },
  alertTitle: {
    fontSize: '1.5rem',
    color: '#e6f1ff',
    fontWeight: '500' as const,
  },
  severityBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '500' as const,
  },
  metaInfo: {
    display: 'flex' as const,
    gap: '2rem',
    marginBottom: '2rem',
  },
  metaItem: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  metaLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  metaValue: {
    fontSize: '1.1rem',
    color: '#e6f1ff',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    color: '#e6f1ff',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '0.5rem',
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  details: {
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.8)',
    whiteSpace: 'pre-line' as const,
  },
  relatedItems: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  relatedItem: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '4px',
  },
  itemType: {
    padding: '0.25rem 0.5rem',
    backgroundColor: 'rgba(0, 183, 255, 0.2)',
    color: '#00b7ff',
    borderRadius: '4px',
    fontSize: '0.8rem',
    marginRight: '1rem',
  },
  itemName: {
    flex: '1',
    color: '#e6f1ff',
  },
  viewButton: {
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  actions: {
    display: 'flex' as const,
    gap: '1rem',
    marginTop: '2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '1.5rem',
  },
  resolveButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(6, 214, 160, 0.2)',
    color: '#06d6a0',
    border: '1px solid #06d6a0',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500' as const,
  },
  assignButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(255, 209, 102, 0.2)',
    color: '#ffd166',
    border: '1px solid #ffd166',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500' as const,
  },
  investigateButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(0, 183, 255, 0.2)',
    color: '#00b7ff',
    border: '1px solid #00b7ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500' as const,
  },
  loadingContainer: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    height: '50vh',
    color: '#e6f1ff',
  },
  errorContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    height: '50vh',
    color: '#e6f1ff',
  },
};

export default AlertDetailPage;