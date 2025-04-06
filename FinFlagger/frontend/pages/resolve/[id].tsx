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
}

const ResolveAnomalyPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [anomaly, setAnomaly] = useState<Anomaly | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolution, setResolution] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      };
      
      setAnomaly(mockAnomaly);
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to success page or dashboard
      router.push('/dashboard?resolved=true');
    }, 1500);
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
          <h1 style={styles.title}>Resolve Anomaly</h1>
        </div>

        <div style={styles.formCard}>
          <div style={styles.anomalySummary}>
            <h2 style={styles.summaryTitle}>Anomaly Summary</h2>
            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>ID:</span>
                <span style={styles.summaryValue}>{anomaly.id}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Type:</span>
                <span style={styles.summaryValue}>{anomaly.type}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Severity:</span>
                <span style={styles.summaryValue}>{anomaly.severity}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Date:</span>
                <span style={styles.summaryValue}>{anomaly.date}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Amount:</span>
                <span style={styles.summaryValue}>{anomaly.amount}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="resolution">Resolution Details</label>
              <textarea 
                id="resolution"
                style={styles.textarea}
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Describe how this anomaly was resolved..."
                required
                rows={4}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="actionTaken">Action Taken</label>
              <select 
                id="actionTaken"
                style={styles.select}
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                required
              >
                <option value="">Select an action...</option>
                <option value="false_positive">False Positive - No Action Required</option>
                <option value="corrected">Transaction Corrected</option>
                <option value="refunded">Customer Refunded</option>
                <option value="policy_update">Policy Updated</option>
                <option value="employee_training">Employee Training Conducted</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={styles.buttonGroup}>
              <Link href={`/anomaly/${id}`}>
                <button type="button" style={styles.cancelButton}>Cancel</button>
              </Link>
              <button 
                type="submit" 
                style={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Mark as Resolved'}
              </button>
            </div>
          </form>
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
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  anomalySummary: {
    marginBottom: '2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '1.5rem',
  },
  summaryTitle: {
    fontSize: '1.3rem',
    color: '#e6f1ff',
    marginBottom: '1rem',
  },
  summaryGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  summaryItem: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  summaryLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '0.25rem',
  },
  summaryValue: {
    fontSize: '1.1rem',
    color: '#e6f1ff',
  },
  form: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  label: {
    fontSize: '1rem',
    color: '#e6f1ff',
  },
  textarea: {
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical' as const,
  },
  select: {
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  buttonGroup: {
    display: 'flex' as const,
    justifyContent: 'flex-end' as const,
    gap: '1rem',
    marginTop: '1rem',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#e6f1ff',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500' as const,
    transition: 'all 0.2s ease',
  },
  submitButton: {
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

export default ResolveAnomalyPage;