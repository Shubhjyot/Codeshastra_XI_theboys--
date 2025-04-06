import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface AuditReport {
  id: string;
  title: string;
  date: string;
  anomalies: number;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  description: string;
  transactions: number;
  value: string;
  anomalyRate: string;
  potentialLoss: string;
}

const AuditReportsPage = () => {
  const [reports, setReports] = useState<AuditReport[]>([]);
  const [loading, setLoading] = useState(true);
  const darkMode = true;
  const router = useRouter();

  useEffect(() => {
    // In a real app, you would fetch from an API
    // For now, we'll use mock data
    const mockReports: AuditReport[] = [
      {
        id: '1',
        title: 'May 2023 Sales Audit',
        date: 'May 31, 2023',
        anomalies: 51,
        status: 'Completed',
        description: 'This audit identified 51 anomalies across various categories, with unauthorized discounts being the most common issue.',
        transactions: 12450,
        value: '$1,245,000',
        anomalyRate: '0.41%',
        potentialLoss: '$12,450',
      },
      {
        id: '2',
        title: 'April 2023 Sales Audit',
        date: 'April 30, 2023',
        anomalies: 43,
        status: 'Completed',
        description: 'This audit identified 43 anomalies across various categories, with pricing modifications being the most common issue.',
        transactions: 11320,
        value: '$1,132,000',
        anomalyRate: '0.38%',
        potentialLoss: '$10,980',
      },
      {
        id: '3',
        title: 'Q1 2023 Financial Review',
        date: 'March 31, 2023',
        anomalies: 87,
        status: 'Completed',
        description: 'Quarterly financial review identifying 87 anomalies across all departments.',
        transactions: 35240,
        value: '$3,524,000',
        anomalyRate: '0.25%',
        potentialLoss: '$28,750',
      },
      {
        id: '4',
        title: 'June 2023 Sales Audit',
        date: 'June 30, 2023',
        anomalies: 0,
        status: 'Scheduled',
        description: 'Scheduled monthly audit for June 2023 sales transactions.',
        transactions: 0,
        value: '$0',
        anomalyRate: '0%',
        potentialLoss: '$0',
      },
    ];
    
    setReports(mockReports);
    setLoading(false);
  }, []);

  const handleGenerateReport = () => {
    // In a real app, this would open a form or modal to create a new report
    // For now, we'll just navigate to a mock "new report" page
    router.push('/audit-reports/new');
  };

  return (
    <Layout darkMode={darkMode}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Audit Reports</h1>
          <button 
            style={styles.generateButton}
            onClick={handleGenerateReport}
          >
            Generate New Report
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <p>Loading audit reports...</p>
          </div>
        ) : (
          <div style={styles.reportsContainer}>
            {reports.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No audit reports found.</p>
              </div>
            ) : (
              reports.map(report => (
                <div key={report.id} style={styles.reportCard}>
                  <div style={styles.reportHeader}>
                    <h2 style={styles.reportTitle}>{report.title}</h2>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: report.status === 'Completed' ? '#00cc6620' : 
                                      report.status === 'In Progress' ? '#1890ff20' : '#ffcc0020',
                      color: report.status === 'Completed' ? '#00cc66' : 
                             report.status === 'In Progress' ? '#1890ff' : '#ffcc00'
                    }}>
                      {report.status}
                    </span>
                  </div>
                  
                  <div style={styles.reportDetails}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Date:</span>
                      <span style={styles.detailValue}>{report.date}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Anomalies:</span>
                      <span style={styles.detailValue}>{report.anomalies}</span>
                    </div>
                  </div>
                  
                  <p style={styles.reportDescription}>{report.description}</p>
                  
                  <div style={styles.reportMetrics}>
                    <div style={styles.metricItem}>
                      <span style={styles.metricLabel}>Transactions:</span>
                      <span style={styles.metricValue}>{report.transactions.toLocaleString()}</span>
                    </div>
                    <div style={styles.metricItem}>
                      <span style={styles.metricLabel}>Value:</span>
                      <span style={styles.metricValue}>{report.value}</span>
                    </div>
                    <div style={styles.metricItem}>
                      <span style={styles.metricLabel}>Anomaly Rate:</span>
                      <span style={styles.metricValue}>{report.anomalyRate}</span>
                    </div>
                    <div style={styles.metricItem}>
                      <span style={styles.metricLabel}>Potential Loss:</span>
                      <span style={styles.metricValue}>{report.potentialLoss}</span>
                    </div>
                  </div>
                  
                  <div style={styles.reportActions}>
                    <button 
                      style={styles.viewDetailsButton}
                      onClick={() => router.push(`/audit-reports/${report.id}`)}
                    >
                      View Details
                    </button>
                    {report.status === 'Completed' && (
                      <>
                        <button style={styles.exportPdfButton}>Export PDF</button>
                        <button style={styles.exportCsvButton}>Export CSV</button>
                      </>
                    )}
                  </div>
                </div>
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
  generateButton: {
    backgroundColor: '#1890ff',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
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
  reportsContainer: {
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
    alignItems: 'flex-start' as const,
    marginBottom: '1rem',
  },
  reportTitle: {
    fontSize: '1.5rem',
    color: '#e6f1ff',
    fontWeight: '500' as const,
    marginRight: '1rem',
  },
  statusBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '500' as const,
    whiteSpace: 'nowrap' as const,
  },
  reportDetails: {
    display: 'flex' as const,
    gap: '2rem',
    marginBottom: '1rem',
  },
  detailItem: {
    display: 'flex' as const,
    gap: '0.5rem',
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.9rem',
  },
  detailValue: {
    color: '#e6f1ff',
    fontSize: '0.9rem',
  },
  reportDescription: {
    fontSize: '0.95rem',
    lineHeight: '1.5',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '1.5rem',
  },
  reportMetrics: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(4, 1fr)' as const,
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '4px',
    marginBottom: '1.5rem',
  },
  metricItem: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.8rem',
  },
  metricValue: {
    color: '#e6f1ff',
    fontSize: '1.1rem',
    fontWeight: '500' as const,
  },
  reportActions: {
    display: 'flex' as const,
    gap: '1rem',
  },
  viewDetailsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  exportPdfButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#e6f1ff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  exportCsvButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#e6f1ff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
};

export default AuditReportsPage;