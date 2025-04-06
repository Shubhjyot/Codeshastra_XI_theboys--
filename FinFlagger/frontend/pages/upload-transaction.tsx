import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

const UploadTransactionPage = () => {
  const router = useRouter();
  const darkMode = true;
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Redirect after "upload" completes
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }, 3000);
  };

  return (
    <Layout darkMode={darkMode}>
      <div style={styles.container}>
        <h1 style={styles.title}>Upload Transaction Document</h1>
        
        <div style={styles.uploadContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* File upload area */}
            <div style={styles.fileUploadArea}>
              <input
                type="file"
                id="transaction-file"
                onChange={handleFileChange}
                style={styles.fileInput}
                accept=".csv,.xlsx,.xls,.json,.txt"
                disabled={uploading}
              />
              <label htmlFor="transaction-file" style={styles.fileLabel}>
                {file ? file.name : 'Choose a file or drag it here'}
              </label>
              {!file && (
                <p style={styles.supportedFormats}>
                  Supported formats: CSV, Excel, JSON, TXT
                </p>
              )}
            </div>
            
            {/* Selected file info */}
            {file && !uploading && (
              <div style={styles.selectedFile}>
                <div style={styles.fileInfo}>
                  <span style={styles.fileName}>{file.name}</span>
                  <span style={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFile(null)}
                  style={styles.removeFileButton}
                >
                  Remove
                </button>
              </div>
            )}
            
            {/* Upload progress */}
            {uploading && (
              <div style={styles.progressContainer}>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${uploadProgress}%`
                    }}
                  ></div>
                </div>
                <span style={styles.progressText}>{uploadProgress}%</span>
              </div>
            )}
            
            {/* Form actions */}
            <div style={styles.formActions}>
              <button 
                type="button" 
                onClick={() => router.push('/')}
                style={styles.cancelButton}
                disabled={uploading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={{
                  ...styles.uploadButton,
                  opacity: (!file || uploading) ? 0.7 : 1
                }}
                disabled={!file || uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Explanatory content */}
        <div style={styles.explanationContainer}>
          <h2 style={styles.explanationTitle}>How It Works</h2>
          <div style={{
            ...styles.explanationSteps,
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <div 
              style={{
                ...styles.stepBox,
                transform: hoveredStep === 1 ? 'translateY(-5px)' : 'none'
              }}
              onMouseEnter={() => setHoveredStep(1)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div style={styles.stepNumber}>1</div>
              <h3 style={styles.stepTitle}>Upload Your Transaction Data</h3>
              <p style={styles.stepDescription}>
                Upload your transaction data in CSV, Excel, JSON, or TXT format. The system supports files up to 50MB in size.
              </p>
            </div>
            
            <div 
              style={{
                ...styles.stepBox,
                transform: hoveredStep === 2 ? 'translateY(-5px)' : 'none'
              }}
              onMouseEnter={() => setHoveredStep(2)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div style={styles.stepNumber}>2</div>
              <h3 style={styles.stepTitle}>Automated Analysis</h3>
              <p style={styles.stepDescription}>
                Our AI-powered system will automatically analyze your transaction data to identify patterns and potential anomalies.
              </p>
            </div>
            
            <div 
              style={{
                ...styles.stepBox,
                transform: hoveredStep === 3 ? 'translateY(-5px)' : 'none'
              }}
              onMouseEnter={() => setHoveredStep(3)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div style={styles.stepNumber}>3</div>
              <h3 style={styles.stepTitle}>Review Results</h3>
              <p style={styles.stepDescription}>
                Once processing is complete, you'll be redirected to the dashboard where you can review any detected anomalies and insights.
              </p>
            </div>
          </div>
          
          <div style={styles.securityNote}>
            <h3 style={styles.securityTitle}>Data Security</h3>
            <p style={styles.securityDescription}>
              Your data is encrypted during transit and storage. We use industry-standard security measures to protect your information.
              All uploaded files are processed in an isolated environment and are not shared with third parties.
            </p>
          </div>
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
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#e6f1ff',
  },
  uploadContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  form: {
    width: '100%',
  },
  fileUploadArea: {
    border: '2px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '3rem 2rem',
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
    position: 'relative' as const,
  },
  fileInput: {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    opacity: 0,
    cursor: 'pointer',
  },
  fileLabel: {
    fontSize: '1.2rem',
    color: '#e6f1ff',
    display: 'block' as const,
    marginBottom: '0.5rem',
  },
  supportedFormats: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  selectedFile: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    marginBottom: '1.5rem',
  },
  fileInfo: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  fileName: {
    fontSize: '1rem',
    color: '#e6f1ff',
    marginBottom: '0.25rem',
  },
  fileSize: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  removeFileButton: {
    backgroundColor: 'transparent',
    color: '#ff4d4f',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  progressContainer: {
    marginBottom: '1.5rem',
  },
  progressBar: {
    height: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1890ff',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formActions: {
    display: 'flex' as const,
    justifyContent: 'flex-end' as const,
    gap: '1rem',
    marginTop: '1rem',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#e6f1ff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  uploadButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  
  // Explanation section styles
  explanationContainer: {
    marginTop: '3rem',
    padding: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  explanationTitle: {
    fontSize: '1.5rem',
    color: '#e6f1ff',
    marginBottom: '1.5rem',
    textAlign: 'center' as const,
  },
  explanationSteps: {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    gap: '1.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap' as const,
    '@media (max-width: 768px)': {
      flexDirection: 'column' as const,
    },
    },
  stepBox: {
    flex: '1',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '1.5rem',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    textAlign: 'center' as const,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'transform 0.2s ease',
    cursor: 'default',
    // Remove the &:hover as it won't work in inline styles
  },
  stepNumber: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#1890ff',
    color: 'white',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
    marginBottom: '1rem',
  },
  stepTitle: {
    fontSize: '1.1rem',
    color: '#e6f1ff',
    marginBottom: '0.75rem',
  },
  stepDescription: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.5',
  },
  securityNote: {
    backgroundColor: 'rgba(24, 144, 255, 0.1)',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid rgba(24, 144, 255, 0.2)',
  },
  securityTitle: {
    fontSize: '1.1rem',
    color: '#e6f1ff',
    marginBottom: '0.5rem',
    textAlign: 'center' as const,
  },
  securityDescription: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.5',
    textAlign: 'center' as const,
  },
};

export default UploadTransactionPage;