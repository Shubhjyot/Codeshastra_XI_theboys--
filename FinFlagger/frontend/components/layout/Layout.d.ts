import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

declare const Layout: React.FC<LayoutProps>;
export default Layout;