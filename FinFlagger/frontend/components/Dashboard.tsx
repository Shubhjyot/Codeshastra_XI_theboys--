type DashboardProps = {
  report: string;
  darkMode?: boolean;
};

export default function Dashboard({ report, darkMode = true }: DashboardProps) {
  return (
    <section style={darkMode ? styles.containerDark : styles.containerLight}>
      <h2 style={darkMode ? styles.headingDark : styles.headingLight}>📋 Audit Report Summary</h2>
      <div style={darkMode ? styles.reportContainerDark : styles.reportContainerLight}>
        <pre style={darkMode ? styles.reportDark : styles.reportLight}>{report}</pre>
      </div>
    </section>
  );
}

const styles = {
  containerLight: {
    marginTop: '2rem',
    padding: '2rem',
    backgroundColor: '#ffffff',
    border: '1px solid #eaeaea',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    textAlign: 'left' as const,
    maxWidth: '1200px',
    margin: '2rem auto',
  },
  containerDark: {
    marginTop: '2rem',
    padding: '2rem',
    backgroundColor: '#172a45',
    border: '1px solid #2d3748',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    textAlign: 'left' as const,
    maxWidth: '1200px',
    margin: '2rem auto',
  },
  headingLight: {
    fontSize: '1.75rem',
    marginBottom: '1.5rem',
    color: '#333',
    fontWeight: '600' as const,
  },
  headingDark: {
    fontSize: '1.75rem',
    marginBottom: '1.5rem',
    color: '#e6f1ff',
    fontWeight: '600' as const,
  },
  reportContainerLight: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #eaeaea',
  },
  reportContainerDark: {
    backgroundColor: '#0a192f',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #2d3748',
  },
  reportLight: {
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    fontSize: '0.95rem',
    color: '#333',
    fontFamily: 'monospace',
    margin: 0,
  },
  reportDark: {
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    fontSize: '0.95rem',
    color: '#a8b2d1',
    fontFamily: 'monospace',
    margin: 0,
  },
};
  