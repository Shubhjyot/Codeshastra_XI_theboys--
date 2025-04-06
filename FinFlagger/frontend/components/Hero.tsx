import React, { useEffect, useRef } from 'react';

type HeroProps = {
  darkMode: boolean;
};

const Hero = ({ darkMode }: HeroProps) => {
  const appMockupRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let animationFrameId: number;
    let hover = 0;
    let direction = 1;
    
    const animate = () => {
      if (appMockupRef.current) {
        hover += 0.1 * direction;
        
        // Create a subtle floating effect
        if (hover > 5) direction = -1;
        if (hover < -5) direction = 1;
        
        appMockupRef.current.style.transform = `translateY(${hover/2}px)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section style={darkMode ? styles.heroDark : styles.heroLight}>
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.greeting}>AI-Powered Financial Security 🔒</div>
          <h1 style={styles.title}>
            We're <span style={styles.highlight}>FinFlagger</span>
          </h1>
          <p style={darkMode ? styles.subtitleDark : styles.subtitleLight}>
            We use AI to detect financial anomalies and provide comprehensive audit reports that simplify compliance and protect your business.
          </p>
          <div style={styles.buttonGroup}>
            <a 
              href="http://localhost:8501" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.primaryButton}
            >
              Get Started
            </a>
            <button style={darkMode ? styles.secondaryButtonDark : styles.secondaryButtonLight}>Learn More</button>
          </div>
        </div>
        <div style={styles.imageContainer}>
          <div style={darkMode ? styles.imagePlaceholderDark : styles.imagePlaceholderLight}>
            <div ref={appMockupRef} style={styles.appMockupContainer}>
              <div style={styles.appMockup}>
                {/* App content remains the same */}
                <div style={styles.appHeader}>
                  <div style={styles.appLogo}>🚩 FinFlagger</div>
                  <div style={styles.appControls}>
                    <div style={styles.appControlDot}></div>
                    <div style={styles.appControlDot}></div>
                    <div style={styles.appControlDot}></div>
                  </div>
                </div>
                <div style={styles.appContent}>
                  <div style={styles.appSidebar}>
                    <div style={styles.sidebarItem}>📊 Dashboard</div>
                    <div style={styles.sidebarItem}>🔍 Audits</div>
                    <div style={styles.sidebarItem}>⚠️ Alerts</div>
                    <div style={styles.sidebarItem}>📈 Reports</div>
                    <div style={styles.sidebarItem}>⚙️ Settings</div>
                  </div>
                  <div style={styles.appMainContent}>
                    <div style={styles.appTitle}>Financial Audit Report</div>
                    <div style={styles.appChart}>
                      <div style={{...styles.chartBar, height: '60%', backgroundColor: '#00b7ff'}}></div>
                      <div style={{...styles.chartBar, height: '80%', backgroundColor: '#00b7ff'}}></div>
                      <div style={{...styles.chartBar, height: '40%', backgroundColor: '#ff4757'}}></div>
                      <div style={{...styles.chartBar, height: '70%', backgroundColor: '#00b7ff'}}></div>
                      <div style={{...styles.chartBar, height: '90%', backgroundColor: '#00b7ff'}}></div>
                    </div>
                    <div style={styles.appMetrics}>
                      <div style={styles.metric}>
                        <div style={styles.metricValue}>98%</div>
                        <div style={styles.metricLabel}>Accuracy</div>
                      </div>
                      <div style={styles.metric}>
                        <div style={styles.metricValue}>3</div>
                        <div style={styles.metricLabel}>Anomalies</div>
                      </div>
                      <div style={styles.metric}>
                        <div style={styles.metricValue}>24h</div>
                        <div style={styles.metricLabel}>Analysis</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={styles.appShadow}></div>
            </div>
          </div>
        </div>
      </div>
      <div style={styles.decorations}>
        <div style={{...styles.decorationItem, top: '20%', left: '10%'}}>+</div>
        <div style={{...styles.decorationItem, top: '70%', left: '15%'}}>○</div>
        <div style={{...styles.decorationItem, top: '30%', right: '15%'}}>×</div>
        <div style={{...styles.decorationItem, top: '80%', right: '10%'}}>□</div>
      </div>
    </section>
  );
};

const styles = {
  heroLight: {
    backgroundColor: '#f8f9fa',
    padding: '6rem 0 4rem',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  heroDark: {
    backgroundColor: '#0a192f',
    padding: '6rem 0 4rem',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  container: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    position: 'relative' as const,
    zIndex: 2,
  },
  content: {
    flex: '1',
    paddingRight: '2rem',
  },
  greeting: {
    fontSize: '1.25rem',
    color: '#00b7ff',
    marginBottom: '1rem',
    fontWeight: '500' as const,
  },
  title: {
    fontSize: '4rem',
    fontWeight: 'bold' as const,
    color: '#2d3748',
    marginBottom: '1.5rem',
    lineHeight: '1.1',
  },
  highlight: {
    color: '#00b7ff',
    fontWeight: '800' as const,
  },
  subtitleLight: {
    fontSize: '1.25rem',
    color: '#4a5568',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  subtitleDark: {
    fontSize: '1.25rem',
    color: '#a8b2d1',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  buttonGroup: {
    display: 'flex' as const,
    gap: '1rem',
  },
  primaryButton: {
    backgroundColor: '#00b7ff',
    color: 'white',
    border: 'none',
    padding: '0.85rem 2rem',
    borderRadius: '8px',
    fontWeight: '600' as const,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px rgba(0, 183, 255, 0.3)',
  },
  secondaryButtonLight: {
    backgroundColor: 'transparent',
    color: '#00b7ff',
    border: '1px solid #00b7ff',
    padding: '0.85rem 2rem',
    borderRadius: '8px',
    fontWeight: '600' as const,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  secondaryButtonDark: {
    backgroundColor: 'transparent',
    color: '#00b7ff',
    border: '1px solid #00b7ff',
    padding: '0.85rem 2rem',
    borderRadius: '8px',
    fontWeight: '600' as const,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  imageContainer: {
    flex: '1',
  },
  imagePlaceholderLight: {
    backgroundColor: '#e2e8f0',
    borderRadius: '16px',
    height: '450px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden',
    perspective: '1000px',
  },
  imagePlaceholderDark: {
    backgroundColor: '#172a45',
    borderRadius: '16px',
    height: '450px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden',
    perspective: '1000px',
  },
  appMockupContainer: {
    position: 'relative' as const,
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.1s ease',
  },
  appMockup: {
    width: '380px',
    height: '380px',
    backgroundColor: '#0a192f',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transformStyle: 'preserve-3d' as const,
    transform: 'translateZ(20px)',
  },
  appHeader: {
    backgroundColor: '#172a45',
    padding: '12px 16px',
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  appLogo: {
    color: '#00b7ff',
    fontWeight: 'bold' as const,
    fontSize: '16px',
  },
  appControls: {
    display: 'flex' as const,
    gap: '6px',
  },
  appControlDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  appContent: {
    display: 'flex' as const,
    height: 'calc(100% - 45px)',
  },
  appSidebar: {
    width: '120px',
    backgroundColor: '#172a45',
    padding: '16px 0',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  },
  sidebarItem: {
    padding: '10px 16px',
    color: '#a8b2d1',
    fontSize: '14px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  appMainContent: {
    flex: '1',
    padding: '20px',
    backgroundColor: '#0a192f',
  },
  appTitle: {
    color: '#e6f1ff',
    fontSize: '18px',
    fontWeight: 'bold' as const,
    marginBottom: '20px',
  },
  appChart: {
    height: '150px',
    display: 'flex' as const,
    alignItems: 'flex-end' as const,
    justifyContent: 'space-between' as const,
    padding: '0 10px',
    marginBottom: '20px',
  },
  chartBar: {
    width: '30px',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.3s ease',
  },
  appMetrics: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    gap: '15px', // Added gap for more spacing between metrics
  },
  metric: {
    backgroundColor: '#172a45',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    width: '30%',
  },
  metricValue: {
    color: '#00b7ff',
    fontSize: '24px',
    fontWeight: 'bold' as const,
  },
  metricLabel: {
    color: '#a8b2d1',
    fontSize: '12px',
    marginTop: '4px',
  },
  appShadow: {
    position: 'absolute' as const,
    width: '380px',
    height: '20px',
    bottom: '-30px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    filter: 'blur(15px)',
    transform: 'translateZ(-20px)',
  },
  decorations: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  decorationItem: {
    position: 'absolute' as const,
    fontSize: '2rem',
    color: '#00b7ff',
    opacity: 0.2,
    fontWeight: 'bold' as const,
  },
};

export default Hero;