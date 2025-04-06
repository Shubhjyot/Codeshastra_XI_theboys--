import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useApi } from '../../context/ApiContext';
import Link from 'next/link';

type AuditReportDetailProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const AuditReportDetailPage = ({ darkMode, toggleDarkMode }: AuditReportDetailProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchReportById } = useApi();
  
  // New state for interactive filters
  const [timeRange, setTimeRange] = useState('all');
  const [severityFilter, setSeverityFilter] = useState<string[]>(['High', 'Medium', 'Low']);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [isChartExpanded, setIsChartExpanded] = useState(false);

  useEffect(() => {
    if (id) {
      const loadReport = async () => {
        try {
          // Convert id to string if it's an array (take the first element)
          const reportId = Array.isArray(id) ? id[0] : id;
          const data = await fetchReportById(reportId);
          if (data) {
            setReport(data);
            setFilteredData(data);
            // Initialize category filter with all available categories
            if (data.details && data.details.categories) {
              setCategoryFilter(Object.keys(data.details.categories));
            }
          } else {
            setError('Failed to load report details');
          }
        } catch (err) {
          setError('An error occurred while fetching report details');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      loadReport();
    }
  }, [id, fetchReportById]);

  // Apply filters to the data
  useEffect(() => {
    if (!report) return;
    
    // Create a deep copy of the report to avoid mutating the original
    const filtered = JSON.parse(JSON.stringify(report));
    
    // Filter categories based on selected categories
    if (categoryFilter.length > 0 && filtered.details && filtered.details.categories) {
      const filteredCategories: {[key: string]: number} = {};
      let totalAnomalies = 0;
      
      Object.entries(report.details.categories).forEach(([category, count]: [string, any]) => {
        if (categoryFilter.includes(category)) {
          filteredCategories[category] = count;
          totalAnomalies += count;
        }
      });
      
      filtered.details.categories = filteredCategories;
      filtered.anomalies = totalAnomalies;
    }
    
    // Filter severity breakdown based on selected severities
    if (severityFilter.length > 0 && filtered.details && filtered.details.severityBreakdown) {
      const filteredSeverities: {[key: string]: number} = {};
      
      Object.entries(report.details.severityBreakdown).forEach(([severity, count]: [string, any]) => {
        if (severityFilter.includes(severity)) {
          filteredSeverities[severity] = count;
        }
      });
      
      filtered.details.severityBreakdown = filteredSeverities;
    }
    
    // Apply time range filter (this would need actual time data in your reports)
    // This is a placeholder implementation
    if (timeRange !== 'all' && report.details && report.details.timeData) {
      // Filter time-based data according to selected range
      // Implementation depends on your actual data structure
    }
    
    setFilteredData(filtered);
  }, [report, categoryFilter, severityFilter, timeRange]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Toggle category filter
  const toggleCategoryFilter = (category: string) => {
    if (categoryFilter.includes(category)) {
      setCategoryFilter(categoryFilter.filter(c => c !== category));
    } else {
      setCategoryFilter([...categoryFilter, category]);
    }
  };

  // Toggle severity filter
  const toggleSeverityFilter = (severity: string) => {
    if (severityFilter.includes(severity)) {
      setSeverityFilter(severityFilter.filter(s => s !== severity));
    } else {
      setSeverityFilter([...severityFilter, severity]);
    }
  };

  if (loading) {
    return (
      <Layout darkMode={darkMode}>
        <div style={styles.loadingContainer}>
          <p>Loading report details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !report) {
    return (
      <Layout darkMode={darkMode}>
        <div style={styles.errorContainer}>
          <h2>Error Loading Report</h2>
          <p>{error ?? 'Report not found'}</p>
          <Link href="/audit-reports">
            <button style={styles.backButton}>Back to Reports</button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout darkMode={darkMode}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Link href="/audit-reports">
            <button style={styles.backButton}>← Back to Reports</button>
          </Link>
          <h1 style={styles.title}>Audit Report Details</h1>
        </div>

        {/* Interactive Filters */}
        <div style={styles.filtersContainer}>
          <div style={styles.filterGroup}>
            <h4 style={styles.filterTitle}>Time Range</h4>
            <div style={styles.filterOptions}>
              <button 
                style={{
                  ...styles.filterButton,
                  backgroundColor: timeRange === 'all' ? 'rgba(0, 183, 255, 0.2)' : 'transparent'
                }}
                onClick={() => setTimeRange('all')}
              >
                All Time
              </button>
              <button 
                style={{
                  ...styles.filterButton,
                  backgroundColor: timeRange === 'month' ? 'rgba(0, 183, 255, 0.2)' : 'transparent'
                }}
                onClick={() => setTimeRange('month')}
              >
                Last Month
              </button>
              <button 
                style={{
                  ...styles.filterButton,
                  backgroundColor: timeRange === 'week' ? 'rgba(0, 183, 255, 0.2)' : 'transparent'
                }}
                onClick={() => setTimeRange('week')}
              >
                Last Week
              </button>
              <button 
                style={{
                  ...styles.filterButton,
                  backgroundColor: timeRange === 'day' ? 'rgba(0, 183, 255, 0.2)' : 'transparent'
                }}
                onClick={() => setTimeRange('day')}
              >
                Last 24h
              </button>
            </div>
          </div>
          
          <div style={styles.filterGroup}>
            <h4 style={styles.filterTitle}>Severity</h4>
            <div style={styles.filterOptions}>
              {report.details.severityBreakdown && Object.keys(report.details.severityBreakdown).map((severity) => (
                <button 
                  key={severity}
                  style={{
                    ...styles.filterButton,
                    backgroundColor: severityFilter.includes(severity) ? 'rgba(0, 183, 255, 0.2)' : 'transparent',
                    borderLeft: `4px solid ${getSeverityColor(severity)}`
                  }}
                  onClick={() => toggleSeverityFilter(severity)}
                >
                  {severity}
                </button>
              ))}
            </div>
          </div>
          
          <div style={styles.filterGroup}>
            <h4 style={styles.filterTitle}>Categories</h4>
            <div style={styles.filterOptions}>
              {report.details.categories && Object.keys(report.details.categories).map((category) => (
                <button 
                  key={category}
                  style={{
                    ...styles.filterButton,
                    backgroundColor: categoryFilter.includes(category) ? 'rgba(0, 183, 255, 0.2)' : 'transparent',
                    borderLeft: `4px solid ${getCategoryColor(category)}`
                  }}
                  onClick={() => toggleCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.reportCard}>
          <div style={styles.reportHeader}>
            <h2 style={styles.reportTitle}>{filteredData.name}</h2>
            <span style={styles.reportStatus}>{filteredData.status}</span>
          </div>
          
          <div style={styles.reportMeta}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Date:</span>
              <span style={styles.metaValue}>{formatDate(filteredData.date)}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Report ID:</span>
              <span style={styles.metaValue}>#{filteredData.id}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Anomalies:</span>
              <span style={styles.metaValue}>{filteredData.anomalies}</span>
            </div>
          </div>
          
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Summary</h3>
            <p style={styles.sectionContent}>{filteredData.summary}</p>
          </div>
          
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Key Metrics</h3>
            <div style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <h4 style={styles.metricTitle}>Total Transactions</h4>
                <p style={styles.metricValue}>{filteredData.details.totalTransactions.toLocaleString()}</p>
              </div>
              <div style={styles.metricCard}>
                <h4 style={styles.metricTitle}>Total Value</h4>
                <p style={styles.metricValue}>{filteredData.details.totalValue}</p>
              </div>
              <div style={styles.metricCard}>
                <h4 style={styles.metricTitle}>Anomaly Rate</h4>
                <p style={styles.metricValue}>{filteredData.details.anomalyRate}</p>
              </div>
              <div style={styles.metricCard}>
                <h4 style={styles.metricTitle}>Potential Loss</h4>
                <p style={styles.metricValue}>{filteredData.details.potentialLoss}</p>
              </div>
            </div>
          </div>
          
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Anomaly Categories</h3>
              <button 
                style={styles.expandButton}
                onClick={() => setIsChartExpanded(!isChartExpanded)}
              >
                {isChartExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>
            <div style={{
              ...styles.chartContainer,
              height: isChartExpanded ? '400px' : 'auto',
              transition: 'height 0.3s ease'
            }}>
              {Object.entries(filteredData.details.categories).map(([category, count]: [string, any]) => (
                <div key={category} style={styles.categoryBar}>
                  <div style={styles.categoryLabel}>{category}</div>
                  <div style={styles.barContainer}>
                    <div 
                      style={{
                        ...styles.bar,
                        width: `${(count / filteredData.anomalies) * 100}%`,
                        backgroundColor: getCategoryColor(category)
                      }}
                    ></div>
                    <span style={styles.barValue}>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Severity Breakdown</h3>
            <div style={styles.severityContainer}>
              {Object.entries(filteredData.details.severityBreakdown).map(([severity, count]: [string, any]) => (
                <div key={severity} style={styles.severityItem}>
                  <div style={{
                    ...styles.severityCircle,
                    backgroundColor: getSeverityColor(severity)
                  }}></div>
                  <div style={styles.severityLabel}>{severity}</div>
                  <div style={styles.severityCount}>{count}</div>
                  <div style={styles.severityPercentage}>
                    {Math.round((count / filteredData.anomalies) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={styles.actions}>
            <button style={styles.actionButton}>Export as PDF</button>
            <button style={styles.actionButton}>Export as CSV</button>
            <button style={styles.actionButton}>Share Report</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper functions for colors
const getCategoryColor = (category: string) => {
  const colors: {[key: string]: string} = {
    'Unauthorized Discount': '#ff6b6b',
    'Tax Miscalculation': '#ffd166',
    'Pricing Modification': '#06d6a0',
    'Suspicious Transaction': '#118ab2'
  };
  return colors[category] || '#00b7ff';
};

const getSeverityColor = (severity: string) => {
  if (severity === 'High') return '#ff6b6b';
  if (severity === 'Medium') return '#ffd166';
  return '#06d6a0';
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
  
  // New styles for interactive elements
  filtersContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  filterGroup: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  filterTitle: {
    fontSize: '1rem',
    color: '#e6f1ff',
    margin: 0,
  },
  filterOptions: {
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
  },
  filterButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    color: '#e6f1ff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
  },
  sectionHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '0.5rem',
  },
  expandButton: {
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  
  // Keep all existing styles...
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
  reportCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  reportHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '1rem',
  },
  reportTitle: {
    fontSize: '1.8rem',
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
    marginBottom: '2.5rem',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#e6f1ff',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '0.5rem',
  },
  sectionContent: {
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  metricsGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  metricCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
  metricTitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '0.5rem',
    fontWeight: 'normal' as const,
  },
  metricValue: {
    fontSize: '1.8rem',
    color: '#00b7ff',
    fontWeight: '500' as const,
  },
  chartContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  categoryBar: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '1rem',
  },
  categoryLabel: {
    width: '180px',
    fontSize: '0.9rem',
    color: '#e6f1ff',
  },
  barContainer: {
    flex: '1',
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '1rem',
  },
  bar: {
    height: '24px',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  barValue: {
    fontSize: '0.9rem',
    color: '#e6f1ff',
    minWidth: '30px',
  },
  severityContainer: {
    display: 'flex' as const,
    justifyContent: 'space-around' as const,
    marginTop: '1rem',
  },
  severityItem: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: '0.5rem',
  },
  severityCircle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
  },
  severityLabel: {
    fontSize: '1rem',
    color: '#e6f1ff',
    marginTop: '0.5rem',
  },
  severityCount: {
    fontSize: '1.5rem',
    color: '#00b7ff',
    fontWeight: '500' as const,
  },
  severityPercentage: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actions: {
    display: 'flex' as const,
    gap: '1rem',
    marginTop: '2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '1.5rem',
  },
  actionButton: {
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
    gap: '1rem',
  },
};

export default AuditReportDetailPage;