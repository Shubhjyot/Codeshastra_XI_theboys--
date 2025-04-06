import React from 'react';
import Layout from '../components/Layout';
import AnomalyDashboard from '../components/AnomalyDashboard';

const DashboardPage = () => {
  // Get the darkMode value from your app state or context if needed
  const darkMode = true; // You can replace this with your actual darkMode state

  return (
    <Layout darkMode={darkMode}>
      <AnomalyDashboard darkMode={darkMode} />
    </Layout>
  );
};

export default DashboardPage;