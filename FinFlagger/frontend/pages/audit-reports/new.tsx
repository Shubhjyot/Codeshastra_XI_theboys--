import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';

const NewAuditReportPage = () => {
  const router = useRouter();
  const darkMode = true;
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    type: 'sales',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit this data to your API
    console.log('Submitting new audit report:', formData);
    
    // Redirect to the audit reports page
    router.push('/audit-reports');
  };

  return (
    <Layout darkMode={darkMode}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button 
            style={styles.backButton}
            onClick={() => router.push('/audit-reports')}
          >
            ← Back to Audit Reports
          </button>
          <h1 style={styles.title}>Generate New Audit Report</h1>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>Report Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., June 2023 Sales Audit"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="startDate" style={styles.label}>Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="endDate" style={styles.label}>End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="type" style={styles.label}>Report Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="sales">Sales Transactions</option>
              <option value="inventory">Inventory Management</option>
              <option value="financial">Financial Statements</option>
              <option value="employee">Employee Activities</option>
              <option value="custom">Custom Audit</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="description" style={styles.label}>Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a brief description of this audit report..."
              style={styles.textarea}
              rows={4}
            />
          </div>

          <div style={styles.formActions}>
            <button 
              type="button" 
              style={styles.cancelButton}
              onClick={() => router.push('/audit-reports')}
            >
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Generate Report
            </button>
          </div>
        </form>
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
    marginBottom: '2rem',
  },
  backButton: {
    backgroundColor: 'transparent',
    color: '#e6f1ff',
    border: 'none',
    padding: '0.5rem 0',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex' as const,
    alignItems: 'center' as const,
    marginBottom: '1rem',
  },
  title: {
    fontSize: '2rem',
    color: '#e6f1ff',
    fontWeight: 'bold' as const,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  formGroup: {
    marginBottom: '1.5rem',
    width: '100%',
  },
  formRow: {
    display: 'flex' as const,
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block' as const,
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    color: '#e6f1ff',
    fontSize: '1rem',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    color: '#e6f1ff',
    fontSize: '1rem',
    appearance: 'none' as const,
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    color: '#e6f1ff',
    fontSize: '1rem',
    resize: 'vertical' as const,
  },
  formActions: {
    display: 'flex' as const,
    justifyContent: 'flex-end' as const,
    gap: '1rem',
    marginTop: '2rem',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    color: '#e6f1ff',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1890ff',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '500' as const,
    cursor: 'pointer',
  },
};

export default NewAuditReportPage;