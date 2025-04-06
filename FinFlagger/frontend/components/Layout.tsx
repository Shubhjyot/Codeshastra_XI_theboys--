import React, { useState } from 'react';
import { useRouter } from 'next/router';

type LayoutProps = {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode?: () => void;
};

const Layout: React.FC<LayoutProps> = ({ children, darkMode, toggleDarkMode }) => {
  const router = useRouter();
  
  const handleNavigation = (path: string) => {
    // Force a hard navigation to ensure page changes
    window.location.href = path;
  };
  
  return (
    <div style={darkMode ? styles.darkMode : styles.lightMode}>
      <header style={styles.header}>
        {/* Logo section */}
        <div style={styles.logo}>
          <div 
            onClick={() => handleNavigation('/')}
            style={styles.logoLink}
          >
            {/* Remove the img tag below */}
            <span style={styles.logoText}>FinFlagger</span>
          </div>
        </div>
        
        {/* Navigation links */}
        <nav style={styles.nav}>
          <div 
            onClick={() => handleNavigation('/')}
            style={{
              ...styles.navLink,
              ...(router.pathname === '/' ? styles.activeNavLink : {})
            }}
          >
            Dashboard
          </div>
          
          <div 
            onClick={() => handleNavigation('/anomalies')}
            style={{
              ...styles.navLink,
              ...(router.pathname.startsWith('/anomalies') ? styles.activeNavLink : {})
            }}
          >
            Anomalies
          </div>
          
          <div 
            onClick={() => handleNavigation('/alerts')}
            style={{
              ...styles.navLink,
              ...(router.pathname.startsWith('/alerts') ? styles.activeNavLink : {})
            }}
          >
            Alerts
          </div>
          
          <div 
            onClick={() => handleNavigation('/audit-reports')}
            style={{
              ...styles.navLink,
              ...(router.pathname.startsWith('/audit-reports') ? styles.activeNavLink : {})
            }}
          >
            Audit Reports
          </div>
          
          <div 
            onClick={() => handleNavigation('/settings')}
            style={{
              ...styles.navLink,
              ...(router.pathname.startsWith('/settings') ? styles.activeNavLink : {})
            }}
          >
            Settings
          </div>
        </nav>
        
        {/* Right side actions */}
        <div style={styles.actionsContainer}>
          <div 
            onClick={() => handleNavigation('/upload-transaction')}
            style={styles.uploadButton}
          >
            Upload Document
          </div>
          
          {/* User profile */}
          <div 
            onClick={() => handleNavigation('/profile')}
            style={styles.userProfile}
          >
            <div style={styles.userAvatar}>
              <i className="fas fa-user"></i>
            </div>
          </div>
        </div>
      </header>
      
      <main style={styles.main}>
        {children}
      </main>
      
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} FinFlagger. All rights reserved.</p>
      </footer>
      
      {toggleDarkMode && (
        <button 
          style={styles.themeToggle} 
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      )}
    </div>
  );
};

const styles = {
  darkMode: {
    backgroundColor: '#0a192f',
    color: '#e6f1ff',
    minHeight: '100vh',
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  lightMode: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    minHeight: '100vh',
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  header: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '1rem 2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  logo: {
    display: 'flex' as const,
    alignItems: 'center' as const,
  },
  logoLink: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
  },
  logoImage: {
    height: '32px',
    marginRight: '0.5rem',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
  },
  nav: {
    display: 'flex' as const,
    gap: '1.5rem',
  },
  navLink: {
    cursor: 'pointer',
    padding: '0.5rem 0',
    position: 'relative' as const,
    transition: 'color 0.3s ease',
  },
  activeNavLink: {
    color: '#64ffda',
    fontWeight: 'bold' as const,
    '&::after': {
      content: '""',
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      width: '100%',
      height: '2px',
      backgroundColor: '#64ffda',
    },
  },
  actionsContainer: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '1rem',
  },
  uploadButton: {
    backgroundColor: '#1890ff',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  userProfile: {
    cursor: 'pointer',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  main: {
    flex: 1,
    padding: '2rem',
  },
  footer: {
    padding: '1rem 2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center' as const,
  },
  themeToggle: {
    position: 'fixed' as const,
    bottom: '2rem',
    right: '2rem',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '1.2rem',
  },
};

export default Layout;