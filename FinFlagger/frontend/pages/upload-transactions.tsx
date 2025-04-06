import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useApi } from '../context/ApiContext';
import { useRouter } from 'next/router';

type TransactionUploadProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const TransactionUpload = ({ darkMode, toggleDarkMode }: TransactionUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { uploadTransactionFile } = useApi();
  const router = useRouter();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (selectedFile: File) => {
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv' || fileExtension === 'xlsx' || fileExtension === 'xls') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a CSV or Excel file');
      setFile(null);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Call API to upload file
      const result = await uploadTransactionFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Redirect to the analysis page or show success
      setTimeout(() => {
        if (result?.reportId) {
          router.push(`/audit-reports/${result.reportId}`);
        } else {
          router.push('/audit-reports');
        }
      }, 1000);
      
    } catch (err) {
      setError('An error occurred while uploading the file. Please try again.');
      console.error(err);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Layout darkMode={darkMode}>
      <div style={styles.container}>
        <h1 style={styles.title}>Upload Transaction Data</h1>
        <p style={styles.description}>
          Upload your transaction data in CSV or Excel format for anomaly detection analysis.
          Our AI will analyze the data and generate a comprehensive audit report.
        </p>

        <div style={styles.uploadContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div 
              style={{
                ...styles.dropzone,
                ...(dragActive ? styles.dropzoneActive : {}),
                ...(file ? styles.dropzoneWithFile : {})
              }}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                id="file-upload" 
                onChange={handleFileInputChange}
                accept=".csv,.xlsx,.xls"
                style={styles.fileInput}
              />
              
              {!file ? (
                <div style={styles.dropzoneContent}>
                  <div style={styles.uploadIcon}>
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16L12 8" stroke="#00b7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11L12 8 15 11" stroke="#00b7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#00b7ff" strokeWidth="2"/>
                    </svg>
                  </div>
                  <p style={styles.dropzoneText}>
                    Drag and drop your file here, or <label htmlFor="file-upload" style={styles.browseLink}>browse</label>
                  </p>
                  <p style={styles.supportedFormats}>Supported formats: CSV, XLSX, XLS</p>
                </div>
              ) : (
                <div style={styles.fileInfo}>
                  <div style={styles.fileIcon}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#00b7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="#00b7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 13H8" stroke="#00b7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 17H8" stroke="#00b7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 9H9H8" stroke="#00b7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={styles.fileDetails}>
                    <p style={styles.fileName}>{file.name}</p>
                    <p style={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button 
                    type="button" 
                    style={styles.removeButton}
                    onClick={() => setFile(null)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {error && <p style={styles.errorText}>{error}</p>}

            {isUploading && (
              <div style={styles.progressContainer}>
                <div style={styles.progressBarOuter}>
                  <div 
                    style={{
                      ...styles.progressBarInner,
                      width: `${uploadProgress}%`
                    }}
                  ></div>
                </div>
                <p style={styles.progressText}>{uploadProgress}% Uploaded</p>
              </div>
            )}

            <div style={styles.formActions}>
              <button 
                type="submit" 
                style={styles.submitButton}
                disabled={!file || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload and Analyze'}
              </button>
            </div>
          </form>
        </div>

        <div style={styles.infoSection}>
          <h2 style={styles.infoTitle}>How It Works</h2>
          <div style={styles.infoSteps}>
            <div style={styles.infoStep}>
              <div style={styles.infoStepNumber}>1</div>
              <h3 style={styles.infoStepTitle}>Upload</h3>
              <p style={styles.infoStepText}>Upload your transaction data file in CSV or Excel format.</p>
            </div>
            <div style={styles.infoStep}>
              <div style={styles.infoStepNumber}>2</div>
              <h3 style={styles.infoStepTitle}>Analysis</h3>
              <p style={styles.infoStepText}>Our AI analyzes the data to detect anomalies and patterns.</p>
            </div>
            <div style={styles.infoStep}>
              <div style={styles.infoStepNumber}>3</div>
              <h3 style={styles.infoStepTitle}>Results</h3>
              <p style={styles.infoStepText}>View a detailed report with identified anomalies and insights.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
    color: '#e6f1ff',
  },
  title: {
    fontSize: '2rem',
    color: '#e6f1ff',
    fontWeight: 'bold' as const,
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  uploadContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '3rem',
  },
  form: {
    width: '100%',
  },
  dropzone: {
    border: '2px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    marginBottom: '1.5rem',
  },
  dropzoneActive: {
    borderColor: '#00b7ff',
    backgroundColor: 'rgba(0, 183, 255, 0.05)',
  },
  dropzoneWithFile: {
    borderStyle: 'solid',
    borderColor: 'rgba(0, 183, 255, 0.5)',
  },
  dropzoneContent: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: '1rem',
  },
  uploadIcon: {
    marginBottom: '1rem',
  },
  dropzoneText: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  browseLink: {
    color: '#00b7ff',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  supportedFormats: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: '0.5rem',
  },
  fileInput: {
    display: 'none',
  },
  fileInfo: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '1rem',
  },
  fileIcon: {
    flexShrink: 0,
  },
  fileDetails: {
    flex: 1,
    textAlign: 'left' as const,
  },
  fileName: {
    fontSize: '1.1rem',
    color: '#e6f1ff',
    marginBottom: '0.25rem',
    wordBreak: 'break-all' as const,
  },
  fileSize: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  removeButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    color: '#ff6b6b',
    border: '1px solid #ff6b6b',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: '1rem',
  },
  progressContainer: {
    marginBottom: '1.5rem',
  },
  progressBarOuter: {
    width: '100%',
    height: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#00b7ff',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right' as const,
  },
  formActions: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    marginTop: '1rem',
  },
  submitButton: {
    padding: '0.75rem 2rem',
    backgroundColor: 'rgba(0, 183, 255, 0.2)',
    color: '#00b7ff',
    border: '1px solid #00b7ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '500' as const,
    transition: 'all 0.2s ease',
  },
  infoSection: {
    marginTop: '3rem',
  },
  infoTitle: {
    fontSize: '1.5rem',
    color: '#e6f1ff',
    marginBottom: '1.5rem',
    textAlign: 'center' as const,
  },
  infoSteps: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    gap: '2rem',
    flexWrap: 'wrap' as const,
  },
  infoStep: {
    flex: '1',
    minWidth: '200px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center' as const,
    position: 'relative' as const,
  },
  infoStepNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 183, 255, 0.2)',
    color: '#00b7ff',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '1.2rem',
    fontWeight: 'bold' as const,
    margin: '0 auto 1rem auto',
  },
  infoStepTitle: {
    fontSize: '1.2rem',
    color: '#e6f1ff',
    marginBottom: '0.75rem',
  },
  infoStepText: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.5',
  },
};

export default TransactionUpload;