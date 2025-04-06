import React from 'react';
import { ReportOptions } from '../../types/anomaly';

interface ReportModalProps {
  showReportModal: boolean;
  setShowReportModal: (show: boolean) => void;
  reportOptions: ReportOptions;
  handleReportOptionChange: (option: keyof ReportOptions, value: any) => void;
  handleMultiSelectChange: (option: 'categories' | 'statuses' | 'severities', value: string, checked: boolean) => void;
  generateCustomReport: () => void;
  generatingReport: boolean;
}

const ReportModal: React.FC<ReportModalProps> = ({
  showReportModal,
  setShowReportModal,
  reportOptions,
  handleReportOptionChange,
  handleMultiSelectChange,
  generateCustomReport,
  generatingReport
}) => {
  if (!showReportModal) return null;
  
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Generate Custom Report</h2>
          <button 
            style={styles.closeButton} 
            onClick={() => setShowReportModal(false)}
          >
            ×
          </button>
        </div>
        
        <div style={styles.modalBody}>
          <div style={styles.reportOption}>
            <label htmlFor="report-time-range" style={styles.reportLabel}>Time Period</label>
            <select 
              id="report-time-range"
              style={styles.reportSelect}
              value={reportOptions.timeRange}
              onChange={(e) => handleReportOptionChange('timeRange', e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div style={styles.reportOption}>
            <label style={styles.reportLabel}>Anomaly Categories</label>
            <div style={styles.checkboxGroup}>
              {['Unusual Transaction', 'Pattern Deviation', 'Regulatory Violation', 'Fraud Attempt'].map(category => (
                <div key={category} style={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    checked={reportOptions.categories.includes(category)}
                    onChange={(e) => handleMultiSelectChange('categories', category, e.target.checked)}
                  />
                  <label htmlFor={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}>
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div style={styles.reportOption}>
            <label style={styles.reportLabel}>Status Types</label>
            <div style={styles.checkboxGroup}>
              {['Open', 'Investigating', 'Resolved', 'False Positive'].map(status => (
                <div key={status} style={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id={`status-${status.toLowerCase().replace(/\s+/g, '-')}`}
                    checked={reportOptions.statuses.includes(status)}
                    onChange={(e) => handleMultiSelectChange('statuses', status, e.target.checked)}
                  />
                  <label htmlFor={`status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div style={styles.reportOption}>
            <label style={styles.reportLabel}>Severity Levels</label>
            <div style={styles.checkboxGroup}>
              {['High', 'Medium', 'Low'].map(severity => (
                <div key={severity} style={styles.checkboxItem}>
                  <input 
                    type="checkbox"
                    id={`severity-${severity.toLowerCase()}`}
                    checked={reportOptions.severities.includes(severity)}
                    onChange={(e) => handleMultiSelectChange('severities', severity, e.target.checked)}
                  />
                  <label htmlFor={`severity-${severity.toLowerCase()}`}>
                    {severity}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div style={styles.reportOption}>
            <label htmlFor="report-format" style={styles.reportLabel}>Report Format</label>
            <select 
              id="report-format"
              style={styles.reportSelect}
              value={reportOptions.format}
              onChange={(e) => handleReportOptionChange('format', e.target.value as any)}
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          
          <div style={styles.reportOption}>
            <div style={styles.checkboxItem}>
              <input 
                type="checkbox"
                id="include-details"
                checked={reportOptions.includeDetails}
                onChange={(e) => handleReportOptionChange('includeDetails', e.target.checked)}
              />
              <label htmlFor="include-details">
                Include detailed anomaly descriptions
              </label>
            </div>
          </div>
        </div>
        
        <div style={styles.modalFooter}>
          <button 
            style={styles.cancelButton} 
            onClick={() => setShowReportModal(false)}
          >
            Cancel
          </button>
          <button 
            style={styles.generateButton} 
            onClick={generateCustomReport}
            disabled={generatingReport}
          >
            {generatingReport ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#1a2233',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto' as const,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  modalHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  modalTitle: {
    margin: 0,
    color: '#e6f1ff',
    fontSize: '1.5rem',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
  },
  modalBody: {
    padding: '1.5rem',
    maxHeight: '60vh',
    overflow: 'auto' as const,
  },
  modalFooter: {
    padding: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex' as const,
    justifyContent: 'flex-end' as const,
    gap: '1rem',
  },
  reportOption: {
    marginBottom: '1.5rem',
  },
  reportLabel: {
    display: 'block' as const,
    marginBottom: '0.5rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.95rem',
  },
  reportSelect: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    fontSize: '0.95rem',
  },
  checkboxGroup: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  checkboxItem: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '0.5rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  generateButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(0, 183, 255, 0.1)',
    color: '#00b7ff',
    border: '1px solid #00b7ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
};

export default ReportModal;