import React, { useState, useEffect } from 'react';
import { Anomaly } from '../../types/anomaly';
import { useApi } from '../../context/ApiContext';
import AnomalyFeedback from './AnomalyFeedback';

type AnomalyCardProps = {
  anomaly: Anomaly;
  getSeverityColor: (severity: string) => string;
  getStatusBackgroundColor: (status: string) => string;
  getStatusTextColor: (status: string) => string;
  formatDate: (dateString: string) => string;
};

const AnomalyCard: React.FC<AnomalyCardProps> = ({
  anomaly,
  getSeverityColor,
  getStatusBackgroundColor,
  getStatusTextColor,
  formatDate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [initialFeedback, setInitialFeedback] = useState<{ isTruePositive: boolean; comments: string } | null>(null);
  const { submitAnomalyFeedback, getAnomalyFeedback } = useApi();

  useEffect(() => {
    // Load existing feedback if any
    const loadFeedback = async () => {
      const feedback = await getAnomalyFeedback(anomaly.id);
      if (feedback) {
        setInitialFeedback(feedback);
      }
    };

    loadFeedback();
  }, [anomaly.id, getAnomalyFeedback]);

  const handleCardClick = () => {
    setExpanded(!expanded);
  };

  const handleSubmitFeedback = async (anomalyId: string, isTruePositive: boolean, comments: string) => {
    await submitAnomalyFeedback(anomalyId, isTruePositive, comments);
    setInitialFeedback({ isTruePositive, comments });
  };

  // Create a truncated description for non-expanded view
  const truncatedDescription = anomaly.description.length > 100 
    ? `${anomaly.description.substring(0, 100)}...` 
    : anomaly.description;

  return (
    <div 
      style={styles.anomalyCard} 
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
    >
      <div style={styles.cardHeader}>
        <div style={styles.titleContainer}>
          <h3 style={styles.cardTitle}>{anomaly.title}</h3>
          <div style={{
            ...styles.severityIndicator,
            backgroundColor: getSeverityColor(anomaly.severity)
          }}>
            {anomaly.severity}
          </div>
        </div>
        <div style={styles.metaContainer}>
          <div style={{
            ...styles.statusBadge,
            backgroundColor: getStatusBackgroundColor(anomaly.status),
            color: getStatusTextColor(anomaly.status)
          }}>
            {anomaly.status}
          </div>
          <div style={styles.dateText}>
            {formatDate(anomaly.detectedAt)}
          </div>
        </div>
      </div>
      
      <div style={styles.cardContent}>
        <p style={styles.descriptionText}>
          {expanded ? anomaly.description : truncatedDescription}
        </p>
        
        {expanded && (
          <div style={styles.expandedContent}>
            <div style={styles.detailSection}>
              <h4 style={styles.sectionTitle}>Detection Details</h4>
              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Detection Method:</span>
                  <span style={styles.detailValue}>{anomaly.detectionMethod ?? 'ML Algorithm'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Confidence Score:</span>
                  <span style={styles.detailValue}>{anomaly.confidenceScore ?? '85'}%</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Risk Score:</span>
                  <span style={styles.detailValue}>{anomaly.riskScore ?? '65'}/100</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Affected Accounts:</span>
                  <span style={styles.detailValue}>{anomaly.affectedAccounts ?? '0'}</span>
                </div>
              </div>
            </div>
            
            <div style={styles.detailSection}>
              <h4 style={styles.sectionTitle}>Financial Impact</h4>
              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Category:</span>
                  <span style={styles.detailValue}>{anomaly.category}</span>
                </div>
                {anomaly.amount && (
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Amount:</span>
                    <span style={styles.detailValue}>
                      ${(() => {
                        try {
                          return typeof anomaly.amount === 'number'
                            ? anomaly.amount.toFixed(2)
                            : parseFloat(String(anomaly.amount)).toFixed(2);
                        } catch (e) {
                          return anomaly.amount; // Fallback to displaying the raw value
                        }
                      })()}
                    </span>
                  </div>
                )}
                {anomaly.accountId && (
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Account ID:</span>
                    <span style={styles.detailValue}>{anomaly.accountId}</span>
                  </div>
                )}
                {anomaly.transactionId && (
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Transaction ID:</span>
                    <span style={styles.detailValue}>{anomaly.transactionId}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Add a simple timeline visualization */}
            <div style={styles.detailSection}>
              <h4 style={styles.sectionTitle}>Anomaly Timeline</h4>
              <div style={styles.timeline}>
                <div style={styles.timelineItem}>
                  <div style={styles.timelinePointContainer}>
                    <div style={styles.timelinePoint}></div>
                    {(anomaly.investigatedAt || anomaly.resolvedAt) && (
                      <div style={styles.timelineConnectorLine}></div>
                    )}
                  </div>
                  <div style={styles.timelineContent}>
                    <span style={styles.timelineDate}>{formatDate(anomaly.detectedAt)}</span>
                    <span style={styles.timelineEvent}>Anomaly Detected</span>
                  </div>
                </div>
                {anomaly.investigatedAt && (
                  <div style={styles.timelineItem}>
                    <div style={styles.timelinePointContainer}>
                      <div style={styles.timelinePoint}></div>
                      {anomaly.resolvedAt && (
                        <div style={styles.timelineConnectorLine}></div>
                      )}
                    </div>
                    <div style={styles.timelineContent}>
                      <span style={styles.timelineDate}>{formatDate(anomaly.investigatedAt)}</span>
                      <span style={styles.timelineEvent}>Investigation Started</span>
                    </div>
                  </div>
                )}
                {anomaly.resolvedAt && (
                  <div style={styles.timelineItem}>
                    <div style={styles.timelinePointContainer}>
                      <div style={styles.timelinePoint}></div>
                    </div>
                    <div style={styles.timelineContent}>
                      <span style={styles.timelineDate}>{formatDate(anomaly.resolvedAt)}</span>
                      <span style={styles.timelineEvent}>Anomaly Resolved</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div style={styles.actionButtons}>
              <button 
                style={styles.resolveButton}
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle resolve action
                }}
              >
                Mark as Resolved
              </button>
              <button 
                style={styles.assignButton}
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle assign action
                }}
              >
                Assign to Team
              </button>
              <button 
                style={styles.criticalButton}
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle flag as critical action
                }}
              >
                Flag as Critical
              </button>
            </div>
            
            <div style={styles.actions}>
              <a 
                href={`/anomalies/${anomaly.id}`} 
                style={styles.viewDetailsButton}
                onClick={(e) => e.stopPropagation()}
              >
                View Full Details
              </a>
            </div>
            
            {/* Add the feedback component */}
            <div onClick={(e) => e.stopPropagation()}>
              <AnomalyFeedback 
                anomalyId={anomaly.id}
                onSubmitFeedback={handleSubmitFeedback}
                initialFeedback={initialFeedback}
              />
            </div>
          </div>
        )}
      </div>
      
      <div style={styles.cardFooter}>
        <button style={styles.expandButton} onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}>
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  anomalyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  cardHeader: {
    marginBottom: '1rem',
  },
  titleContainer: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '0.5rem',
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 'bold' as const,
    color: '#e6f1ff',
  },
  severityIndicator: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold' as const,
  },
  metaContainer: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  statusBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  dateText: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  cardContent: {
    flex: 1,
  },
  descriptionText: {
    margin: '0 0 1rem 0',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  expandedContent: {
    marginTop: '1rem',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  detailSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '6px',
    padding: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold' as const,
    marginTop: 0,
    marginBottom: '1rem',
    color: '#e6f1ff',
  },
  detailsGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  detailItem: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  detailLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '0.25rem',
  },
  detailValue: {
    fontSize: '0.95rem',
    color: '#e6f1ff',
  },
  timeline: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  timelineItem: {
    display: 'flex' as const,
    alignItems: 'flex-start',
    gap: '1rem',
    position: 'relative' as const,
  },
  timelinePointContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    width: '20px',
    height: '100%',
  },
  timelinePoint: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#1890ff',
    marginTop: '5px',
    position: 'relative' as const,
    zIndex: 2,
  },
  timelineConnectorLine: {
    width: '2px',
    height: '30px',
    backgroundColor: 'rgba(24, 144, 255, 0.3)',
    marginTop: '4px',
  },
  timelineContent: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    flex: 1,
  },
  timelineDate: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  timelineEvent: {
    fontSize: '0.95rem',
    color: '#e6f1ff',
  },
  actionButtons: {
    display: 'flex' as const,
    gap: '1rem',
    flexWrap: 'wrap' as const,
  },
  resolveButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(82, 196, 26, 0.1)',
    color: '#52c41a',
    border: '1px solid #52c41a',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  assignButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(24, 144, 255, 0.1)',
    color: '#1890ff',
    border: '1px solid #1890ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  criticalButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 77, 79, 0.1)',
    color: '#ff4d4f',
    border: '1px solid #ff4d4f',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  actions: {
    marginTop: '1rem',
  },
  viewDetailsButton: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(24, 144, 255, 0.1)',
    color: '#1890ff',
    border: '1px solid #1890ff',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  cardFooter: {
    marginTop: 'auto',
    paddingTop: '1rem',
    display: 'flex' as const,
    justifyContent: 'center' as const,
  },
  expandButton: {
    backgroundColor: 'transparent',
    color: '#64ffda',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: '0.5rem',
  },
};

export default AnomalyCard;