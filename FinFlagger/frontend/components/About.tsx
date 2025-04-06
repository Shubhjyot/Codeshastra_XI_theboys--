import React, { useEffect, useRef } from 'react';

type AboutProps = {
  darkMode?: boolean;
};

const About = ({ darkMode = true }: AboutProps) => {
  const cube3DRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let animationFrameId: number;
    let rotation = 0;
    
    const animate = () => {
      if (cube3DRef.current) {
        rotation += 0.5;
        cube3DRef.current.style.transform = `rotateY(${rotation}deg) rotateX(${rotation/2}deg)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section style={darkMode ? styles.aboutDark : styles.aboutLight}>
      <div style={styles.container}>
        <div style={styles.cube3DContainer}>
          <div ref={cube3DRef} style={styles.cube3D}>
            <div style={{...styles.cubeFace, ...styles.cubeFront, backgroundColor: darkMode ? '#00b7ff' : '#00b7ff'}}></div>
            <div style={{...styles.cubeFace, ...styles.cubeBack, backgroundColor: darkMode ? '#0099e6' : '#0099e6'}}></div>
            <div style={{...styles.cubeFace, ...styles.cubeRight, backgroundColor: darkMode ? '#33c6ff' : '#33c6ff'}}></div>
            <div style={{...styles.cubeFace, ...styles.cubeLeft, backgroundColor: darkMode ? '#66d4ff' : '#66d4ff'}}></div>
            <div style={{...styles.cubeFace, ...styles.cubeTop, backgroundColor: darkMode ? '#99e2ff' : '#99e2ff'}}></div>
            <div style={{...styles.cubeFace, ...styles.cubeBottom, backgroundColor: darkMode ? '#cceeff' : '#cceeff'}}></div>
          </div>
        </div>
        
        <h2 style={darkMode ? styles.titleDark : styles.titleLight}>About FinFlagger</h2>
        <div style={styles.content}>
          <div style={styles.textContent}>
            <p style={darkMode ? styles.paragraphDark : styles.paragraphLight}>
              FinFlagger is an advanced financial auditing platform that leverages artificial intelligence to detect anomalies, 
              ensure compliance, and provide comprehensive audit reports for businesses of all sizes.
            </p>
            <p style={darkMode ? styles.paragraphDark : styles.paragraphLight}>
              Our mission is to simplify the complex world of financial auditing, making it accessible, efficient, and accurate 
              for organizations to maintain financial integrity and compliance.
            </p>
            <div style={styles.features}>
              <div style={darkMode ? styles.featureDark : styles.featureLight}>
                <div style={styles.featureIcon}>🔍</div>
                <h3 style={darkMode ? styles.featureTitleDark : styles.featureTitleLight}>Anomaly Detection</h3>
                <p style={darkMode ? styles.featureTextDark : styles.featureTextLight}>Automatically identify unusual patterns and potential issues in financial data</p>
              </div>
              <div style={darkMode ? styles.featureDark : styles.featureLight}>
                <div style={styles.featureIcon}>📊</div>
                <h3 style={darkMode ? styles.featureTitleDark : styles.featureTitleLight}>Comprehensive Reports</h3>
                <p style={darkMode ? styles.featureTextDark : styles.featureTextLight}>Generate detailed audit reports with actionable insights</p>
              </div>
              <div style={darkMode ? styles.featureDark : styles.featureLight}>
                <div style={styles.featureIcon}>🔒</div>
                <h3 style={darkMode ? styles.featureTitleDark : styles.featureTitleLight}>Compliance Assurance</h3>
                <p style={darkMode ? styles.featureTextDark : styles.featureTextLight}>Ensure adherence to financial regulations and standards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  aboutLight: {
    padding: '5rem 0',
    backgroundColor: '#ffffff',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  aboutDark: {
    padding: '5rem 0',
    backgroundColor: '#0a192f',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    position: 'relative' as const,
    zIndex: 1,
  },
  titleLight: {
    fontSize: '2.5rem',
    fontWeight: 'bold' as const,
    color: '#2d3748',
    marginBottom: '2.5rem',
    textAlign: 'center' as const,
  },
  titleDark: {
    fontSize: '2.5rem',
    fontWeight: 'bold' as const,
    color: '#e6f1ff',
    marginBottom: '2.5rem',
    textAlign: 'center' as const,
  },
  content: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
  },
  textContent: {
    maxWidth: '800px',
  },
  paragraphLight: {
    fontSize: '1.125rem',
    color: '#4a5568',
    lineHeight: '1.8',
    marginBottom: '1.5rem',
  },
  paragraphDark: {
    fontSize: '1.125rem',
    color: '#a8b2d1',
    lineHeight: '1.8',
    marginBottom: '1.5rem',
  },
  features: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    marginTop: '3rem',
  },
  featureLight: {
    backgroundColor: '#f7fafc',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center' as const,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
  },
  featureDark: {
    backgroundColor: '#172a45',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center' as const,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    },
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  featureTitleLight: {
    fontSize: '1.25rem',
    fontWeight: '600' as const,
    color: '#2d3748',
    marginBottom: '0.75rem',
  },
  featureTitleDark: {
    fontSize: '1.25rem',
    fontWeight: '600' as const,
    color: '#e6f1ff',
    marginBottom: '0.75rem',
  },
  featureTextLight: {
    fontSize: '1rem',
    color: '#4a5568',
    lineHeight: '1.6',
  },
  featureTextDark: {
    fontSize: '1rem',
    color: '#a8b2d1',
    lineHeight: '1.6',
  },
  // 3D Cube styles
  cube3DContainer: {
    position: 'absolute' as const,
    top: '50px',
    right: '100px',
    width: '100px',
    height: '100px',
    perspective: '1000px',
    zIndex: 0,
  },
  cube3D: {
    width: '100%',
    height: '100%',
    position: 'relative' as const,
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.5s',
    animation: 'float 6s ease-in-out infinite',
  },
  cubeFace: {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    opacity: 0.7,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 0 20px rgba(0, 183, 255, 0.5)',
  },
  cubeFront: {
    transform: 'translateZ(50px)',
  },
  cubeBack: {
    transform: 'rotateY(180deg) translateZ(50px)',
  },
  cubeRight: {
    transform: 'rotateY(90deg) translateZ(50px)',
  },
  cubeLeft: {
    transform: 'rotateY(-90deg) translateZ(50px)',
  },
  cubeTop: {
    transform: 'rotateX(90deg) translateZ(50px)',
  },
  cubeBottom: {
    transform: 'rotateX(-90deg) translateZ(50px)',
  },
};

export default About;