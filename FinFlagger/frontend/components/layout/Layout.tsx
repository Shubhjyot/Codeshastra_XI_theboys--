import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <header>
          <h1>{title || 'FinFlagger'}</h1>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;