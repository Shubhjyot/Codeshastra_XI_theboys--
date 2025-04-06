import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';

interface Anomaly {
  id: number;
  type: string;
  severity: string;
  date: string;
  amount: string;
  description?: string;
  relatedTransactions?: Array<{id: string, date: string, amount: string}>;
  riskScore?: number;
}

const AnomalyDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [anomaly, setAnomaly] = useState<Anomaly | null>(null);
  const [loading, setLoading] = useState(true);
  const darkMode = true;

  useEffect(() => {
    if (id) {
      // In a real app, you would fetch from an API
      // For now, we'll use mock data
      const mockAnomaly: Anomaly = {
        id: Number(id),
        type: 'Unauthorized Discount',
        severity: 'High',
        date: '2023-05-15',
        amount: '$1,245.00',
        description: 'Employee applied a 25% discount without manager approval. This exceeds the authorized limit of 15% for this product category.',
        relatedTransactions: [
          { id: 'T-10045', date: '2023-05-15', amount: '$1,245.00' },
          { id: 'T-10032', date: '2023-05-14', amount: '$980.50' }
        ],
        riskScore: 85
      };
      
      setAnomaly(mockAnomaly);
      setLoading(false);
    }
  }, [id]);

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

  if (loading) {
    return (
      <Layout darkMode={darkMode}>
        <div style={styles.loadingContainer}>
          <p>Loading anomaly details...</p>
        </div>
      </Layout>
    );
  }

  if (!anomaly) {
    return (
      <Layout darkMode={darkMode}>
        <div style={styles.errorContainer}>
          <h2>Anomaly Not Found</h2>
          <p>The requested anomaly could not be found.</p>
          <Link href="/dashboard">
            <button style={styles.backButton}>Back to Dashboard</button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout darkMode={darkMode}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Link href="/dashboard">
            <button style={styles.backButton}>← Back to Dashboard</button>
          </Link>
          <h1 style={styles.title}>Anomaly Details</h1>
        </div>

        <div style={styles.detailCard}>
          <div style={styles.detailHeader}>
            <div>
              <h2 style={styles.detailTitle}>{anomaly.type}</h2>
              <p style={styles.detailId}>ID: {anomaly.id}</p>
            </div>
            <span style={{
              ...styles.severityBadge,
              backgroundColor: getSeverityBgColor(anomaly.severity),
              color: getSeverityColor(anomaly.severity),
            }}>
              {anomaly.severity}
            </span>
          </div>

          <div style={styles.detailGrid}>
            <div style={styles.detailItem}>
              <h3 style={styles.detailLabel}>Date</h3>
              <p style={styles.detailValue}>{anomaly.date}</p>
            </div>
            <div style={styles.detailItem}>
              <h3 style={styles.detailLabel}>Amount</h3>
              <p style={styles.detailValue}>{anomaly.amount}</p>
            </div>
            <div style={styles.detailItem}>
              <h3 style={styles.detailLabel}>Risk Score</h3>
              <p style={styles.detailValue}>{anomaly.riskScore}/100</p>
            </div>
          </div>

          <div style={styles.descriptionSection}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={styles.description}>{anomaly.description}</p>
          </div>

          <div style={styles.transactionsSection}>
            <h3 style={styles.sectionTitle}>Related Transactions</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Transaction ID</th>
                  <th style={styles.tableHeader}>Date</th>
                  <th style={styles.tableHeader}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {anomaly.relatedTransactions?.map(transaction => (
                  <tr key={transaction.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{transaction.id}</td>
                    <td style={styles.tableCell}>{transaction.date}</td>
                    <td style={styles.tableCell}>{transaction.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.actionSection}>
            <button style={styles.resolveButton}>Mark as Resolved</button>
            <button style={styles.investigateButton}>Investigate Further</button>
            <button style={styles.reportButton}>Generate Report</button>
          </div>
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
  detailCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  detailHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: '2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '1rem',
  },
  detailTitle: {
    fontSize: '1.5rem',
    color: '#e6f1ff',
    marginBottom: '0.5rem',
  },
  detailId: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.9rem',
  },
  severityBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    display: 'inline-block',
    fontWeight: '500' as const,
    fontSize: '0.85rem',
  },
  detailGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  detailItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '1rem',
    borderRadius: '6px',
  },
  detailLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '0.5rem',
  },
  detailValue: {
    fontSize: '1.25rem',
    color: '#e6f1ff',
    fontWeight: '500' as const,
  },
  descriptionSection: {
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
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  transactionsSection: {
    marginBottom: '2rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
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
  actionSection: {
    display: 'flex' as const,
    gap: '1rem',
    marginTop: '2rem',
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
    transition: 'all 0.2s ease',
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
    transition: 'all 0.2s ease',
  },
  reportButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500' as const,
    transition: 'all 0.2s ease',
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

export default AnomalyDetail;