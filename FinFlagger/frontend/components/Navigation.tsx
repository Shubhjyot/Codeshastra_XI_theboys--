import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

type NavigationProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const Navigation = ({ darkMode, toggleDarkMode }: NavigationProps) => {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link href="/">
          <span style={styles.logoText}>FinFlagger</span>
        </Link>
      </div>
      
      <div style={styles.links}>
        <Link href="/dashboard">
          <span style={isActive('/dashboard') ? styles.activeLink : styles.link}>
            Dashboard
          </span>
        </Link>
        <Link href="/alerts">
          <span style={isActive('/alerts') ? styles.activeLink : styles.link}>
            Alerts
          </span>
        </Link>
        <Link href="/anomalies">
          <span style={isActive('/anomalies') ? styles.activeLink : styles.link}>
            Anomalies
          </span>
        </Link>
        <Link href="/audit-reports">
          <span style={isActive('/audit-reports') ? styles.activeLink : styles.link}>
            Audit Reports
          </span>
        </Link>
        <Link href="/upload-transactions">
          <span style={isActive('/upload-transactions') ? styles.activeLink : styles.link}>
            <span style={styles.navIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Upload Transactions
          </span>
        </Link>
      </div>
      
      <div style={styles.actions}>
        <button 
          style={styles.themeToggle}
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <div style={styles.userMenu}>
          <span style={styles.userName}>Admin User</span>
          <div style={styles.userAvatar}>AU</div>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '1rem 2rem',
    backgroundColor: 'rgba(10, 25, 47, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  logo: {
    display: 'flex' as const,
    alignItems: 'center' as const,
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
    color: '#00b7ff',
    cursor: 'pointer',
  },
  links: {
    display: 'flex' as const,
    gap: '2rem',
  },
  link: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  activeLink: {
    color: '#00b7ff',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500' as const,
    cursor: 'pointer',
  },
  actions: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '1.5rem',
  },
  themeToggle: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#e6f1ff',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  userMenu: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '0.75rem',
    cursor: 'pointer',
  },
  userName: {
    color: '#e6f1ff',
    fontSize: '0.9rem',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#00b7ff',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '500' as const,
  },
  navIcon: {
    marginRight: '0.75rem',
    display: 'flex' as const,
    alignItems: 'center' as const,
  }
};

export default Navigation;