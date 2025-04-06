import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Footer from '../components/Footer';

export default function Home() {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Apply theme to document body
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
    document.body.style.backgroundColor = darkMode ? '#0a192f' : '#f8f9fa';
    document.body.style.color = darkMode ? '#e6f1ff' : '#333';
    document.body.style.margin = '0';
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [darkMode]);

  const runAudit = async () => {
    setLoading(true);
    setReport('');
    const res = await fetch('/api/audit', { method: 'POST' });
    const data = await res.json();
    setReport(data.report || 'No audit report found.');
    setLoading(false);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div style={darkMode ? styles.containerDark : styles.containerLight}>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <main style={darkMode ? styles.mainDark : styles.mainLight}>
        <Hero darkMode={darkMode} />
        <About darkMode={darkMode} />
        
        <div style={styles.auditSection}>
          <h1 style={darkMode ? styles.titleDark : styles.titleLight}>
            🚩 <span style={styles.highlight}>FinFlagger</span> – AI-Powered Sales Audit
          </h1>

          <p style={darkMode ? styles.descriptionDark : styles.descriptionLight}>
            Analyze your sales data, detect anomalies, and receive severity-ranked AI audit reports.
          </p>

          <button 
            style={darkMode ? styles.buttonDark : styles.buttonLight} 
            onClick={runAudit} 
            disabled={loading}
          >
            {loading ? 'Running Audit...' : 'Run Audit'}
          </button>

          {report && <Dashboard report={report} darkMode={darkMode} />}
        </div>
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
}

const styles = {
  containerLight: {
    minHeight: '100vh',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  containerDark: {
    minHeight: '100vh',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    backgroundColor: '#0a192f',
    color: '#e6f1ff',
  },
  mainLight: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    padding: '0',
    margin: '0 auto',
    width: '100%',
    maxWidth: '1200px',
    textAlign: 'center' as const,
  },
  mainDark: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    padding: '0',
    margin: '0 auto',
    width: '100%',
    maxWidth: '1200px',
    textAlign: 'center' as const,
  },
  auditSection: {
    padding: '4rem 2rem',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  titleLight: {
    fontSize: '3rem',
    fontWeight: '700' as const,
    marginBottom: '1.5rem',
    color: '#333',
    lineHeight: '1.2',
  },
  titleDark: {
    fontSize: '3rem',
    fontWeight: '700' as const,
    marginBottom: '1.5rem',
    color: '#e6f1ff',
    lineHeight: '1.2',
  },
  highlight: {
    color: '#00b7ff',
    fontWeight: '800' as const,
  },
  descriptionLight: {
    fontSize: '1.25rem',
    marginBottom: '2.5rem',
    color: '#555',
    maxWidth: '600px',
    lineHeight: '1.6',
  },
  descriptionDark: {
    fontSize: '1.25rem',
    marginBottom: '2.5rem',
    color: '#a8b2d1',
    maxWidth: '600px',
    lineHeight: '1.6',
  },
  buttonLight: {
    backgroundColor: '#00b7ff',
    color: 'white',
    padding: '0.85rem 2.5rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px rgba(0, 183, 255, 0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 183, 255, 0.4)',
    }
  },
  buttonDark: {
    backgroundColor: '#00b7ff',
    color: 'white',
    padding: '0.85rem 2.5rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px rgba(0, 183, 255, 0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 183, 255, 0.4)',
    }
  },
};
