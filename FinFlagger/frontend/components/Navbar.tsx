import React from 'react';
import Link from 'next/link';

type NavbarProps = {
  darkMode: boolean;
  toggleTheme: () => void;
};

const Navbar = ({ darkMode, toggleTheme }: NavbarProps) => {
  return (
    <nav style={darkMode ? styles.navbarDark : styles.navbarLight}>
      <div style={styles.container}>
        <Link href="/" style={darkMode ? styles.logoDark : styles.logoLight}>
          <span style={styles.logoHighlight}>Fin</span>Flagger
        </Link>
        <div style={styles.links}>
          <Link href="/" style={darkMode ? styles.linkDark : styles.linkLight}>Home</Link>
          <Link href="/about" style={darkMode ? styles.linkDark : styles.linkLight}>About</Link>
          <Link href="/dashboard" style={darkMode ? styles.linkDark : styles.linkLight}>Dashboard</Link>
          <Link href="/contact" style={darkMode ? styles.linkDark : styles.linkLight}>Contact</Link>
        </div>
        <div style={styles.rightSection}>
          <button 
            onClick={toggleTheme} 
            style={darkMode ? styles.themeButtonDark : styles.themeButtonLight}
            aria-label="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button style={darkMode ? styles.buttonDark : styles.buttonLight}>Get Started</button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbarLight: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    padding: '1rem 0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
  },
  navbarDark: {
    backgroundColor: '#0a192f',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    padding: '1rem 0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid #172a45',
  },
  container: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  logoLight: {
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
    color: '#333',
    textDecoration: 'none',
  },
  logoDark: {
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
    color: '#e6f1ff',
    textDecoration: 'none',
  },
  logoHighlight: {
    color: '#00b7ff',
  },
  links: {
    display: 'flex' as const,
    gap: '2rem',
  },
  linkLight: {
    color: '#4a5568',
    textDecoration: 'none',
    fontWeight: '500' as const,
    transition: 'color 0.2s ease',
    ':hover': {
      color: '#00b7ff',
    },
  },
  linkDark: {
    color: '#a8b2d1',
    textDecoration: 'none',
    fontWeight: '500' as const,
    transition: 'color 0.2s ease',
    ':hover': {
      color: '#00b7ff',
    },
  },
  rightSection: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '1rem',
  },
  themeButtonLight: {
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '50%',
    width: '2.5rem',
    height: '2.5rem',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    cursor: 'pointer',
    fontSize: '1.2rem',
    transition: 'all 0.2s ease',
  },
  themeButtonDark: {
    backgroundColor: '#172a45',
    border: '1px solid #2d3748',
    borderRadius: '50%',
    width: '2.5rem',
    height: '2.5rem',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    cursor: 'pointer',
    fontSize: '1.2rem',
    transition: 'all 0.2s ease',
  },
  buttonLight: {
    backgroundColor: '#00b7ff',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.25rem',
    borderRadius: '4px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#0099e6',
    },
  },
  buttonDark: {
    backgroundColor: '#00b7ff',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.25rem',
    borderRadius: '4px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#0099e6',
    },
  },
};

export default Navbar;