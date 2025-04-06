import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useApi } from '../context/ApiContext';
import Link from 'next/link';

type AuditReportsProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const AuditReportsPage = ({ darkMode, toggleDarkMode }: AuditReportsProps) => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchReports } = useApi();

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchReports();
        if (data) {
          setReports(data);
        } else {
          setError('Failed to load reports');
        }
      } catch (err) {
        setError('An error occurred while fetching reports');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [fetchReports]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout darkMode={darkMode}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Audit Reports</h1>
          <button style={styles.generateButton}>Generate New Report</button>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <p>Loading audit reports...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div style={styles.reportsList}>
              {reports.map(report => (
                <div key={report.id} style={styles.reportCard}>
                  <div style={styles.reportHeader}>
                    <h2 style={styles.reportTitle}>{report.name}</h2>
                    <span style={styles.reportStatus}>{report.status}</span>
                  </div>
                  
                  <div style={styles.reportMeta}>
                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Date:</span>
                      <span style={styles.metaValue}>{formatDate(report.date)}</span>
                    </div>
                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Anomalies:</span>
                      <span style={styles.metaValue}>{report.anomalies}</span>
                    </div>
                  </div>
                  
                  <p style={styles.reportSummary}>{report.summary}</p>
                  
                  <div style={styles.reportStats}>
                    <div style={styles.statItem}>
                      <span style={styles.statLabel}>Transactions:</span>
                      <span style={styles.statValue}>{report.details.totalTransactions.toLocaleString()}</span>
                    </div>
                    <div style={styles.statItem}>
                      <span style={styles.statLabel}>Value:</span>
                      <span style={styles.statValue}>{report.details.totalValue}</span>
                    </div>
                    <div style={styles.statItem}>
                      <span style={styles.statLabel}>Anomaly Rate:</span>
                      <span style={styles.statValue}>{report.details.anomalyRate}</span>
                    </div>
                    <div style={styles.statItem}>
                      <span style={styles.statLabel}>Potential Loss:</span>
                      <span style={styles.statValue}>{report.details.potentialLoss}</span>
                    </div>
                  </div>
                  
                  <div style={styles.reportActions}>
                    <Link href={`/audit-reports/${report.id}`}>
                      <button style={styles.viewButton}>View Details</button>
                    </Link>
                    <button style={styles.exportButton}>Export PDF</button>
                    <button style={styles.exportButton}>Export CSV</button>
                  </div>
                </div>
              ))}
            </div>
          </>
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
  generateButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#00b7ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
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
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    height: '50vh',
    color: '#ff6b6b',
  },
  reportsList: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  reportCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  reportHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '1rem',
  },
  reportTitle: {
    fontSize: '1.5rem',
    color: '#e6f1ff',
    fontWeight: '500' as const,
  },
  reportStatus: {
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(6, 214, 160, 0.2)',
    color: '#06d6a0',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  reportMeta: {
    display: 'flex' as const,
    gap: '2rem',
    marginBottom: '1rem',
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
  reportSummary: {
    marginBottom: '1.5rem',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  reportStats: {
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statItem: {
    flex: '1 0 calc(25% - 1rem)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '1rem',
    borderRadius: '4px',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statValue: {
    fontSize: '1.2rem',
    color: '#00b7ff',
    fontWeight: '500' as const,
  },
  reportActions: {
    display: 'flex' as const,
    gap: '1rem',
    marginTop: '1rem',
  },
  viewButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(0, 183, 255, 0.2)',
    color: '#00b7ff',
    border: '1px solid #00b7ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  exportButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
};

export default AuditReportsPage;