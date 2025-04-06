import React, { useState } from 'react';

// Define the report type
interface Report {
  id: number;
  name: string;
  date: string;
  anomalies: number;
  status: string;
}

type AuditReportsProps = {
  darkMode?: boolean;
};

const AuditReports = ({ darkMode = true }: AuditReportsProps) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Mock data - would be replaced with actual API calls
  const reports: Report[] = [
    { id: 1, name: 'May 2023 Sales Audit', date: '2023-05-31', anomalies: 51, status: 'Completed' },
    { id: 2, name: 'April 2023 Sales Audit', date: '2023-04-30', anomalies: 43, status: 'Completed' },
    { id: 3, name: 'March 2023 Sales Audit', date: '2023-03-31', anomalies: 38, status: 'Completed' },
    { id: 4, name: 'February 2023 Sales Audit', date: '2023-02-28', anomalies: 29, status: 'Completed' },
    { id: 5, name: 'January 2023 Sales Audit', date: '2023-01-31', anomalies: 35, status: 'Completed' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={darkMode ? styles.titleDark : styles.titleLight}>Audit Reports</h1>
      
      <div style={styles.reportsContainer}>
        <div style={styles.reportsList}>
          <h2>Available Reports</h2>
          <div style={styles.reportsListInner}>
            {reports.map(report => (
              <button 
                key={report.id} 
                style={styles.reportCard}
                onClick={() => setSelectedReport(report)}
              >
                <h3>{report.name}</h3>
                <p>Date: {report.date}</p>
                <p>Anomalies: {report.anomalies}</p>
                <p>Status: <span style={styles.statusBadge}>{report.status}</span></p>
              </button>
            ))}
          </div>
          <button style={styles.generateButton}>Generate New Report</button>
        </div>
        
        <div style={styles.reportDetail}>
          {selectedReport ? (
            <>
              <h2>{selectedReport.name} Details</h2>
              <div style={styles.reportSummary}>
                <div style={styles.summaryItem}>
                  <h3>Report Date</h3>
                  <p>{selectedReport.date}</p>
                </div>
                <div style={styles.summaryItem}>
                  <h3>Total Anomalies</h3>
                  <p>{selectedReport.anomalies}</p>
                </div>
                <div style={styles.summaryItem}>
                  <h3>Status</h3>
                  <p>{selectedReport.status}</p>
                </div>
                <div style={styles.summaryItem}>
                  <h3>Financial Impact</h3>
                  <p>$12,450.75</p>
                </div>
              </div>
              
              <div style={styles.reportSection}>
                <h3>Anomaly Breakdown</h3>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Count</th>
                      <th>Severity</th>
                      <th>Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Unauthorized Discounts</td>
                      <td>12</td>
                      <td>High</td>
                      <td>$5,245.00</td>
                    </tr>
                    <tr>
                      <td>Tax Miscalculations</td>
                      <td>19</td>
                      <td>Medium</td>
                      <td>$2,345.50</td>
                    </tr>
                    <tr>
                      <td>Pricing Modifications</td>
                      <td>8</td>
                      <td>High</td>
                      <td>$3,100.00</td>
                    </tr>
                    <tr>
                      <td>Suspicious Transactions</td>
                      <td>5</td>
                      <td>Medium</td>
                      <td>$1,280.25</td>
                    </tr>
                    <tr>
                      <td>Duplicate Entries</td>
                      <td>7</td>
                      <td>Low</td>
                      <td>$480.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div style={styles.reportSection}>
                <h3>Recommended Actions</h3>
                <ul style={styles.actionsList}>
                  <li>Review all unauthorized discounts exceeding $500</li>
                  <li>Implement additional validation for tax calculations</li>
                  <li>Investigate pricing modifications by user ID #1042</li>
                  <li>Review and consolidate duplicate entries in the system</li>
                  <li>Update transaction approval workflow for high-value sales</li>
                </ul>
              </div>
              
              <div style={styles.buttonGroup}>
                <button style={styles.downloadButton}>Download PDF</button>
                <button style={styles.downloadButton}>Export CSV</button>
                <button style={styles.shareButton}>Share Report</button>
              </div>
            </>
          ) : (
            <div style={styles.noReportSelected}>
              <p>Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  titleLight: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#2d3748',
  },
  titleDark: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#e6f1ff',
  },
  reportsContainer: {
    display: 'flex' as const,
    gap: '2rem',
  },
  reportsList: {
    flex: '1',
    maxWidth: '300px',
  },
  reportsListInner: {
    maxHeight: '600px',
    overflowY: 'auto' as const,
    marginBottom: '1rem',
  },
  reportCard: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    textAlign: 'left' as const,
    width: '100%',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  generateButton: {
    backgroundColor: '#00b7ff',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: '600' as const,
  },
  reportDetail: {
    flex: '2',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  noReportSelected: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    height: '400px',
    color: '#a0aec0',
    fontSize: '1.2rem',
  },
  reportSummary: {
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: '1rem',
    marginBottom: '2rem',
  },
  summaryItem: {
    flex: '1',
    minWidth: '200px',
    backgroundColor: '#f7fafc',
    padding: '1rem',
    borderRadius: '8px',
  },
  reportSection: {
    marginBottom: '2rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '1rem',
  },
  actionsList: {
    paddingLeft: '1.5rem',
    lineHeight: '1.8',
  },
  buttonGroup: {
    display: 'flex' as const,
    gap: '1rem',
  },
  downloadButton: {
    backgroundColor: '#00b7ff',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600' as const,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600' as const,
  },
};

export default AuditReports;