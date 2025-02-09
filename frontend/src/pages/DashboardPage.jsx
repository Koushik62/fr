import React, { useState } from 'react';
import StatusDashboard from '../components/StatusDashboard/StatusDashboard';
import TweetList from '../components/TweetList/TweetList';
import Broadcast from '../components/HashtagManager/Broadcast';
import LogsViewer from '../components/MediaUpload/LogsViewer';
import AgentSettings from '../components/AgentSettings/AgentSettings';
import './DashboardPage.css';

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('status');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Update the active section when a sidebar button is clicked
  const handleNavigation = (section) => {
    setActiveSection(section);
  };

  // Conditionally render the selected component
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'status':
        return (
          <section id="status" className="content-section">
            <header className="content-header">
              <h2>Status</h2>
            </header>
            <div className="content-body">
              <StatusDashboard />
            </div>
          </section>
        );
      case 'tweets':
        return (
          <section id="tweets" className="content-section">
            <header className="content-header">
              <h2>Tweets</h2>
            </header>
            <div className="content-body">
              <TweetList />
            </div>
          </section>
        );
      case 'hashtags':
        return (
          <section id="hashtags" className="content-section">
            <header className="content-header">
              <h2>Hashtags</h2>
            </header>
            <div className="content-body">
              <Broadcast />
            </div>
          </section>
        );
      case 'media':
        return (
          <section id="media" className="content-section">
            <header className="content-header">
              <h2>Media Upload</h2>
            </header>
            <div className="content-body">
              <LogsViewer/>
            </div>
          </section>
        );
      case 'settings':
        return (
          <section id="settings" className="content-section">
            <header className="content-header">
              <h2>Agent Settings</h2>
            </header>
            <div className="content-body">
              <AgentSettings />
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`dashboard-page ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>{sidebarOpen ? 'Social Dashboard' : 'SD'}</h1>
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav>
          <ul>
            <li className={activeSection === 'status' ? 'active' : ''}>
              <button onClick={() => handleNavigation('status')}>Status</button>
            </li>
            <li className={activeSection === 'tweets' ? 'active' : ''}>
              <button onClick={() => handleNavigation('tweets')}>Tweets</button>
            </li>
            <li className={activeSection === 'hashtags' ? 'active' : ''}>
              <button onClick={() => handleNavigation('hashtags')}>Hashtags</button>
            </li>
            <li className={activeSection === 'media' ? 'active' : ''}>
              <button onClick={() => handleNavigation('media')}>Logs</button>
            </li>
            
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default DashboardPage;
