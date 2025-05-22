import React from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <div className="antialiased font-inter text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Layout>
        <Dashboard />
      </Layout>
    </div>
  );
}

export default App;