import React from 'react';
import Link from 'next/link';

type FooterProps = {
  darkMode?: boolean;
};

const Footer = ({ darkMode = true }: FooterProps) => {
  return (
    <footer style={darkMode ? styles.footerDark : styles.footerLight}>
      <div style={styles.container}>
        <div style={styles.grid}>
          <div style={styles.column}>
            <h3 style={darkMode ? styles.columnTitleDark : styles.columnTitleLight}>FinFlagger</h3>
            <p style={darkMode ? styles.descriptionDark : styles.descriptionLight}>
              Advanced financial auditing powered by artificial intelligence.
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={darkMode ? styles.socialLinkDark : styles.socialLinkLight}>Twitter</a>
              <a href="#" style={darkMode ? styles.socialLinkDark : styles.socialLinkLight}>LinkedIn</a>
              <a href="#" style={darkMode ? styles.socialLinkDark : styles.socialLinkLight}>GitHub</a>
            </div>
          </div>
          
          <div style={styles.column}>
            <h3 style={darkMode ? styles.columnTitleDark : styles.columnTitleLight}>Product</h3>
            <ul style={styles.linkList}>
              <li><Link href="/features" style={darkMode ? styles.linkDark : styles.linkLight}>Features</Link></li>
              <li><Link href="/pricing" style={darkMode ? styles.linkDark : styles.linkLight}>Pricing</Link></li>
              <li><Link href="/case-studies" style={darkMode ? styles.linkDark : styles.linkLight}>Case Studies</Link></li>
              <li><Link href="/documentation" style={darkMode ? styles.linkDark : styles.linkLight}>Documentation</Link></li>
            </ul>
          </div>
          
          <div style={styles.column}>
            <h3 style={darkMode ? styles.columnTitleDark : styles.columnTitleLight}>Company</h3>
            <ul style={styles.linkList}>
              <li><Link href="/about" style={darkMode ? styles.linkDark : styles.linkLight}>About Us</Link></li>
              <li><Link href="/careers" style={darkMode ? styles.linkDark : styles.linkLight}>Careers</Link></li>
              <li><Link href="/blog" style={darkMode ? styles.linkDark : styles.linkLight}>Blog</Link></li>
              <li><Link href="/contact" style={darkMode ? styles.linkDark : styles.linkLight}>Contact</Link></li>
            </ul>
          </div>
          
          <div style={styles.column}>
            <h3 style={darkMode ? styles.columnTitleDark : styles.columnTitleLight}>Legal</h3>
            <ul style={styles.linkList}>
              <li><Link href="/privacy" style={darkMode ? styles.linkDark : styles.linkLight}>Privacy Policy</Link></li>
              <li><Link href="/terms" style={darkMode ? styles.linkDark : styles.linkLight}>Terms of Service</Link></li>
              <li><Link href="/security" style={darkMode ? styles.linkDark : styles.linkLight}>Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div style={styles.bottom}>
          <p style={darkMode ? styles.copyrightDark : styles.copyrightLight}>© {new Date().getFullYear()} FinFlagger. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footerLight: {
    backgroundColor: '#f8f9fa',
    color: '#4a5568',
    padding: '4rem 0 2rem',
    borderTop: '1px solid #eaeaea',
  },
  footerDark: {
    backgroundColor: '#0a192f',
    color: '#a8b2d1',
    padding: '4rem 0 2rem',
    borderTop: '1px solid #172a45',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  grid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2rem',
  },
  column: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
  },
  columnTitleLight: {
    fontSize: '1.25rem',
    fontWeight: '600' as const,
    marginBottom: '1.5rem',
    color: '#2d3748',
  },
  columnTitleDark: {
    fontSize: '1.25rem',
    fontWeight: '600' as const,
    marginBottom: '1.5rem',
    color: '#e6f1ff',
  },
  descriptionLight: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
    color: '#4a5568',
  },
  descriptionDark: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
    color: '#a8b2d1',
  },
  socialLinks: {
    display: 'flex' as const,
    gap: '1rem',
  },
  socialLinkLight: {
    color: '#4a5568',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s ease',
  },
  socialLinkDark: {
    color: '#a8b2d1',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s ease',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  linkLight: {
    color: '#4a5568',
    textDecoration: 'none',
    fontSize: '0.95rem',
    display: 'block',
    marginBottom: '0.75rem',
    transition: 'color 0.2s ease',
  },
  linkDark: {
    color: '#a8b2d1',
    textDecoration: 'none',
    fontSize: '0.95rem',
    display: 'block',
    marginBottom: '0.75rem',
    transition: 'color 0.2s ease',
  },
  bottom: {
    borderTop: '1px solid #eaeaea',
    marginTop: '3rem',
    paddingTop: '2rem',
    textAlign: 'center' as const,
  },
  copyrightLight: {
    fontSize: '0.9rem',
    color: '#4a5568',
  },
  copyrightDark: {
    fontSize: '0.9rem',
    color: '#a8b2d1',
  },
};

export default Footer;