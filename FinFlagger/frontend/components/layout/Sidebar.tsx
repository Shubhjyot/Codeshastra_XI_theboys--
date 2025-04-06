import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  DashboardOutlined, 
  AlertOutlined, 
  FileTextOutlined, 
  AreaChartOutlined, 
  SettingOutlined 
} from '@ant-design/icons';

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: <DashboardOutlined /> },
  { name: 'Anomalies', path: '/anomalies', icon: <AlertOutlined /> },
  { name: 'Reports', path: '/reports', icon: <FileTextOutlined /> },
  { name: 'Analytics', path: '/analytics', icon: <AreaChartOutlined /> },
  { name: 'Settings', path: '/settings', icon: <SettingOutlined /> },
];

const Sidebar = () => {
  const router = useRouter();
  
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>FinFlagger</h2>
      </div>
      <nav>
        <ul>
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={router.pathname === item.path ? 'active' : ''}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;