import React from 'react';
import Link from 'next/link';

const EmptyState: React.FC = () => {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyStateIcon}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#00b7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V12" stroke="#00b7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 16H12.01" stroke="#00b7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 style={styles.emptyStateTitle}>No Anomalies Found</h3>
      <p style={styles.emptyStateText}>
        No anomalies match your current filter criteria. Try adjusting your filters or upload more transaction data.
      </p>
      <Link href="/upload-transactions">
        <button style={styles.uploadButton}>Upload Transactions</button>
      </Link>
    </div>
  );
};

const styles = {
  emptyState: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: '4rem 2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
  emptyStateIcon: {
    marginBottom: '1.5rem',
    opacity: 0.7,
  },
  emptyStateTitle: {
    fontSize: '1.5rem',
    color: '#e6f1ff',
    marginBottom: '1rem',
  },
  emptyStateText: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    maxWidth: '500px',
    marginBottom: '2rem',
  },
  uploadButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(0, 183, 255, 0.1)',
    color: '#00b7ff',
    border: '1px solid #00b7ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
};

export default EmptyState;