import React from 'react';

type FilterBarProps = {
  filters: {
    status: string;
    severity: string;
    category: string;
    timeRange: string;
  };
  handleFilterChange: (filterType: string, value: string) => void;
};

const FilterBar: React.FC<FilterBarProps> = ({ filters, handleFilterChange }) => {
  return (
    <div style={styles.filterBar}>
      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>Status</label>
        <select
          style={styles.filterSelect}
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>Severity</label>
        <select
          style={styles.filterSelect}
          value={filters.severity}
          onChange={(e) => handleFilterChange('severity', e.target.value)}
        >
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>Category</label>
        <select
          style={styles.filterSelect}
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="unauthorized_discount">Unauthorized Discount</option>
          <option value="tax_miscalculation">Tax Miscalculation</option>
          <option value="pricing_modification">Pricing Modification</option>
          <option value="suspicious_transaction">Suspicious Transaction</option>
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>Time Range</label>
        <select
          style={styles.filterSelect}
          value={filters.timeRange}
          onChange={(e) => handleFilterChange('timeRange', e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last 90 Days</option>
        </select>
      </div>
    </div>
  );
};

const styles = {
  filterBar: {
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: '1rem',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
  },
  filterGroup: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    minWidth: '150px',
    flex: '1',
  },
  filterLabel: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '0.5rem',
  },
  filterSelect: {
    padding: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#e6f1ff',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
};

export default FilterBar;