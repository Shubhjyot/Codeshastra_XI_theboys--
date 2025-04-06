import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useApi } from '../../context/ApiContext';
import Link from 'next/link';

type AnomalyDetailProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const AnomalyDetailPage = ({ darkMode, toggleDarkMode }: AnomalyDetailProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [anomaly, setAnomaly] = useState<any>(null);
  const [relatedTransactions, setRelatedTransactions] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { fetchAnomalyById } = useApi();
  
  useEffect(() => {
    if (id) {
      const loadAnomalyDetails = async () => {
        try {
          // Convert id to string if it's an array
          const anomalyId = Array.isArray(id) ? id[0] : id;
          const data = await fetchAnomalyById(anomalyId);
          
          if (data) {
            setAnomaly(data);
            // In a real app, you would fetch related transactions and notes
            // For now, we'll use mock data
            setRelatedTransactions(mockRelatedTransactions);
            setNotes(mockNotes);
          } else {
            setError('Failed to load anomaly details');
          }
        } catch (err) {
          setError('An error occurred while fetching anomaly details');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      loadAnomalyDetails();
    }
  }, [id, fetchAnomalyById]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const newNoteObj = {
      id: Date.now(),
      text: newNote,
      author: 'Admin User',
      timestamp: new Date().toISOString(),
    };
    
    setNotes([...notes, newNoteObj]);
    setNewNote('');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return '#ff4d4f';
      case 'medium':
        return '#faad14';
      case 'low':
        return '#52c41a';
      default:
        return '#1890ff';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (error || !anomaly) {
    return (
      <Layout darkMode={darkMode}>
        <div style={styles.errorContainer}>
          <h2>Error Loading Anomaly</h2>
          <p>{error ?? 'Anomaly not found'}</p>
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
          <h1 style={styles.title}>Anomaly Investigation</h1>
        </div>

        <div style={styles.anomalyCard}>
          <div style={styles.anomalyHeader}>
            <div>
              <h2 style={styles.anomalyTitle}>{anomaly.title}</h2>
              <p style={styles.anomalyId}>ID: {anomaly.id}</p>
            </div>
            <div style={{
              ...styles.severityBadge,
              backgroundColor: getSeverityColor(anomaly.severity)
            }}>
              {anomaly.severity} Severity
            </div>
          </div>
          
          <div style={styles.anomalyMeta}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Detected:</span>
              <span style={styles.metaValue}>{formatDate(anomaly.detectedAt)}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Category:</span>
              <span style={styles.metaValue}>{anomaly.category}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Status:</span>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: anomaly.status === 'Open' ? 'rgba(24, 144, 255, 0.1)' : 'rgba(82, 196, 26, 0.1)',
                color: anomaly.status === 'Open' ? '#1890ff' : '#52c41a',
              }}>
                {anomaly.status}
              </span>
            </div>
          </div>
          
          <div style={styles.tabsContainer}>
            <div 
              style={{
                ...styles.tab,
                ...(activeTab === 'overview' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </div>
            <div 
              style={{
                ...styles.tab,
                ...(activeTab === 'transactions' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('transactions')}
            >
              Related Transactions
            </div>
            <div 
              style={{
                ...styles.tab,
                ...(activeTab === 'notes' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('notes')}
            >
              Investigation Notes
            </div>
          </div>
          
          <div style={styles.tabContent}>
            {activeTab === 'overview' && (
              <div>
                <h3 style={styles.sectionTitle}>Description</h3>
                <p style={styles.description}>{anomaly.description}</p>
                
                <h3 style={styles.sectionTitle}>Detection Details</h3>
                <div style={styles.detailsGrid}>
                  <div style={styles.detailCard}>
                    <h4 style={styles.detailTitle}>Detection Method</h4>
                    <p style={styles.detailValue}>{anomaly.detectionMethod}</p>
                  </div>
                  <div style={styles.detailCard}>
                    <h4 style={styles.detailTitle}>Confidence Score</h4>
                    <p style={styles.detailValue}>{anomaly.confidenceScore}%</p>
                  </div>
                  <div style={styles.detailCard}>
                    <h4 style={styles.detailTitle}>Risk Score</h4>
                    <p style={styles.detailValue}>{anomaly.riskScore}/100</p>
                  </div>
                  <div style={styles.detailCard}>
                    <h4 style={styles.detailTitle}>Affected Accounts</h4>
                    <p style={styles.detailValue}>{anomaly.affectedAccounts?.length || 0}</p>
                  </div>
                </div>
                
                <h3 style={styles.sectionTitle}>Anomaly Timeline</h3>
                <div style={styles.timeline}>
                  {anomaly.timeline?.map((event: any, index: number) => (
                    <div key={index} style={styles.timelineItem}>
                      <div style={styles.timelineDot}></div>
                      <div style={styles.timelineContent}>
                        <p style={styles.timelineDate}>{formatDate(event.timestamp)}</p>
                        <p style={styles.timelineEvent}>{event.event}</p>
                        {event.user && <p style={styles.timelineUser}>By: {event.user}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'transactions' && (
              <div>
                <h3 style={styles.sectionTitle}>Related Transactions</h3>
                <div style={styles.transactionsTable}>
                  <div style={styles.tableHeader}>
                    <div style={styles.tableHeaderCell}>Transaction ID</div>
                    <div style={styles.tableHeaderCell}>Date</div>
                    <div style={styles.tableHeaderCell}>Amount</div>
                    <div style={styles.tableHeaderCell}>Type</div>
                    <div style={styles.tableHeaderCell}>Status</div>
                    <div style={styles.tableHeaderCell}>Actions</div>
                  </div>
                  {relatedTransactions.map((transaction) => (
                    <div key={transaction.id} style={styles.tableRow}>
                      <div style={styles.tableCell}>{transaction.id}</div>
                      <div style={styles.tableCell}>{formatDate(transaction.date)}</div>
                      <div style={styles.tableCell}>${transaction.amount.toFixed(2)}</div>
                      <div style={styles.tableCell}>{transaction.type}</div>
                      <div style={styles.tableCell}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: transaction.status === 'Completed' 
                            ? 'rgba(82, 196, 26, 0.1)' 
                            : transaction.status === 'Pending' 
                              ? 'rgba(250, 173, 20, 0.1)' 
                              : 'rgba(255, 77, 79, 0.1)',
                          color: transaction.status === 'Completed' 
                            ? '#52c41a' 
                            : transaction.status === 'Pending' 
                              ? '#faad14' 
                              : '#ff4d4f',
                        }}>
                          {transaction.status}
                        </span>
                      </div>
                      <div style={styles.tableCell}>
                        <button style={styles.viewButton}>View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'notes' && (
              <div>
                <h3 style={styles.sectionTitle}>Investigation Notes</h3>
                
                <div style={styles.notesContainer}>
                  {notes.length === 0 ? (
                    <p style={styles.emptyNotes}>No investigation notes yet. Add the first note below.</p>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} style={styles.noteCard}>
                        <div style={styles.noteHeader}>
                          <span style={styles.noteAuthor}>{note.author}</span>
                          <span style={styles.noteTimestamp}>{formatDate(note.timestamp)}</span>
                        </div>
                        <p style={styles.noteText}>{note.text}</p>
                      </div>
                    ))
                  )}
                </div>
                
                <div style={styles.addNoteContainer}>
                  <textarea
                    style={styles.noteInput}
                    placeholder="Add a new investigation note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={4}
                  />
                  <button 
                    style={styles.addNoteButton}
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                  >
                    Add Note
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div style={styles.actionButtons}>
            <button style={{
              ...styles.actionButton,
              backgroundColor: 'rgba(82, 196, 26, 0.1)',
              color: '#52c41a',
              borderColor: '#52c41a',
            }}>
              Mark as Resolved
            </button>
            <button style={{
              ...styles.actionButton,
              backgroundColor: 'rgba(24, 144, 255, 0.1)',
              color: '#1890ff',
              borderColor: '#1890ff',
            }}>
              Assign to Team
            </button>
            <button style={{
              ...styles.actionButton,
              backgroundColor: 'rgba(255, 77, 79, 0.1)',
              color: '#ff4d4f',
              borderColor: '#ff4d4f',
            }}>
              Flag as Critical
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Mock data for development
const mockRelatedTransactions = [
  {
    id: 'TRX-001',
    date: '2023-06-15T10:30:00Z',
    amount: 5000.00,
    type: 'Wire Transfer',
    status: 'Completed',
    source: 'Account #1234',
    destination: 'Account #5678'
  },
  {
    id: 'TRX-002',
    date: '2023-06-15T11:45:00Z',
    amount: 2500.00,
    type: 'ACH Transfer',
    status: 'Pending',
    source: 'Account #5678',
    destination: 'Account #9012'
  },
  {
    id: 'TRX-003',
    date: '2023-06-16T09:15:00Z',
    amount: 7500.00,
    type: 'Wire Transfer',
    status: 'Failed',
    source: 'Account #1234',
    destination: 'Account #3456'
  },
  {
    id: 'TRX-004',
    date: '2023-06-17T14:20:00Z',
    amount: 3000.00,
    type: 'ACH Transfer',
    status: 'Completed',
    source: 'Account #5678',
    destination: 'Account #1234'
  }
];

const mockNotes = [
  {
    id: 1,
    text: 'Initial investigation shows unusual pattern of transactions from Account #1234. Will need to check account history for the past 3 months.',
    author: 'John Smith',
    timestamp: '2023-06-16T09:30:00Z'
  },
  {
    id: 2,
    text: 'Contacted account owner for verification. Awaiting response.',
    author: 'Jane Doe',
    timestamp: '2023-06-16T14:45:00Z'
  },
  {
    id: 3,
    text: 'Account owner confirmed they did not authorize these transactions. Proceeding with fraud investigation protocol.',
    author: 'John Smith',
    timestamp: '2023-06-17T11:20:00Z'
  }
];

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    marginBottom: '2rem',
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '1rem',
  },
  title: {
    fontSize: '1.8rem',
    color: '#e6f1ff',
    margin: 0,
  },
  loadingContainer: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    height: '50vh',
  },
  errorContainer: {
    textAlign: 'center' as const,
    padding: '3rem',
  },
  anomalyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  anomalyHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: '1.5rem',
  },
  anomalyTitle: {
    fontSize: '1.5rem',
    color: '#e6f1ff',
    margin: 0,
    marginBottom: '0.5rem',
  },
  anomalyId: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
  severityBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '500' as const,
    color: 'white',
  },
  anomalyMeta: {
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  metaItem: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '0.5rem',
  },
  metaLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  metaValue: {
    fontSize: '0.95rem',
    color: '#e6f1ff',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '500' as const,
  },
  tabsContainer: {
    display: 'flex' as const,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '1.5rem',
  },
  tab: {
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.7)',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    color: '#00b7ff',
    borderBottom: '2px solid #00b7ff',
  },
  tabContent: {
    minHeight: '300px',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    color: '#e6f1ff',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  detailsGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  detailCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '1rem',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  detailTitle: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
    marginBottom: '0.5rem',
  },
  detailValue: {
    fontSize: '1.2rem',
    color: '#e6f1ff',
    margin: 0,
  },
  timeline: {
    position: 'relative' as const,
    marginLeft: '1rem',
    paddingLeft: '2rem',
    borderLeft: '2px solid rgba(255, 255, 255, 0.1)',
  },
  timelineItem: {
    position: 'relative' as const,
    marginBottom: '1.5rem',
  },
  timelineDot: {
    position: 'absolute' as const,
    left: '-2.1rem',
    top: '0.25rem',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#00b7ff',
  },
  timelineContent: {
    padding: '0.5rem 0',
  },
  timelineDate: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
    marginBottom: '0.25rem',
  },
  timelineEvent: {
    fontSize: '1rem',
    color: '#e6f1ff',
    margin: 0,
    marginBottom: '0.25rem',
  },
  timelineUser: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
  transactionsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden' as const,
  },
  tableHeader: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  tableHeaderCell: {
    fontSize: '0.9rem',
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tableRow: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'background-color 0.2s ease',
  },
  tableCell: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.8)',
    display: 'flex' as const,
    alignItems: 'center' as const,
  },
  viewButton: {
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(0, 183, 255, 0.1)',
    color: '#00b7ff',
    border: '1px solid #00b7ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  notesContainer: {
    marginBottom: '2rem',
  },
  emptyNotes: {
    textAlign: 'center' as const,
    color: 'rgba(255, 255, 255, 0.6)',
    padding: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '4px',
  },
  noteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  noteHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    marginBottom: '0.5rem',
  },
  noteAuthor: {
    fontSize: '0.9rem',
    fontWeight: '500' as const,
    color: '#00b7ff',
  },
  noteTimestamp: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  noteText: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.5',
    margin: 0,
  },
  addNoteContainer: {
    marginTop: '1rem',
  },
  noteInput: {
    width: '100%',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    color: '#e6f1ff',
    fontSize: '0.95rem',
    resize: 'vertical' as const,
    marginBottom: '1rem',
  },
  addNoteButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'rgba(0, 183, 255, 0.1)',
    color: '#00b7ff',
    border: '1px solid #00b7ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  actionButtons: {
    display: 'flex' as const,
    gap: '1rem',
    marginTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '1.5rem',
  },
  actionButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500' as const,
    border: '1px solid',
  },
};

export default AnomalyDetailPage;