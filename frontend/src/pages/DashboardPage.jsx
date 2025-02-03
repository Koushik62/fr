// import React from 'react';
// import StatusDashboard from '../components/StatusDashboard/StatusDashboard';
// import TweetList from '../components/TweetList/TweetList';
// import HashtagManager from '../components/HashtagManager/HashtagManager';
// import MediaUpload from '../components/MediaUpload/MediaUpload';
// import AgentSettings from '../components/AgentSettings/AgentSettings';
// import './DashboardPage.css';

// const DashboardPage = () => {
//   return (
//     <div className="dashboard-page">
//       <aside className="sidebar">
//         <ul>
//           <li><a href="#status">Status</a></li>
//           <li><a href="#tweets">Tweets</a></li>
//           <li><a href="#hashtags">Hashtags</a></li>
//           <li><a href="#media">Media Upload</a></li>
//           <li><a href="#settings">Agent Settings</a></li>
//         </ul>
//       </aside>
//       <main className="main-content">
//         <section id="status">
//           <StatusDashboard />
//         </section>
//         <section id="tweets">
//           <TweetList />
//         </section>
//         <section id="hashtags">
//           <HashtagManager />
//         </section>
//         <section id="media">
//           <MediaUpload />
//         </section>
//         <section id="settings">
//           <AgentSettings />
//         </section>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;


import React, { useState, useRef } from 'react';
import StatusDashboard from '../components/StatusDashboard/StatusDashboard';
import TweetList from '../components/TweetList/TweetList';
import HashtagManager from '../components/HashtagManager/HashtagManager';
import MediaUpload from '../components/MediaUpload/MediaUpload';
import AgentSettings from '../components/AgentSettings/AgentSettings';
import './DashboardPage.css';

const DashboardPage = () => {
  // Create refs for each section
  const statusRef = useRef(null);
  const tweetsRef = useRef(null);
  const hashtagsRef = useRef(null);
  const mediaRef = useRef(null);
  const settingsRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('status');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // When a sidebar button is clicked, scroll smoothly to that section and update activeSection state
  const handleNavigation = (section) => {
    setActiveSection(section);
    let ref = null;
    switch (section) {
      case 'status':
        ref = statusRef;
        break;
      case 'tweets':
        ref = tweetsRef;
        break;
      case 'hashtags':
        ref = hashtagsRef;
        break;
      case 'media':
        ref = mediaRef;
        break;
      case 'settings':
        ref = settingsRef;
        break;
      default:
        break;
    }
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
              <button onClick={() => handleNavigation('media')}>Media Upload</button>
            </li>
            <li className={activeSection === 'settings' ? 'active' : ''}>
              <button onClick={() => handleNavigation('settings')}>Agent Settings</button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <section ref={statusRef} id="status" className="content-section">
          <header className="content-header">
            <h2>Status</h2>
          </header>
          <div className="content-body">
            <StatusDashboard />
          </div>
        </section>
        <section ref={tweetsRef} id="tweets" className="content-section">
          <header className="content-header">
            <h2>Tweets</h2>
          </header>
          <div className="content-body">
            <TweetList />
          </div>
        </section>
        <section ref={hashtagsRef} id="hashtags" className="content-section">
          <header className="content-header">
            <h2>Hashtags</h2>
          </header>
          <div className="content-body">
            <HashtagManager />
          </div>
        </section>
        <section ref={mediaRef} id="media" className="content-section">
          <header className="content-header">
            <h2>Media Upload</h2>
          </header>
          <div className="content-body">
            <MediaUpload />
          </div>
        </section>
        <section ref={settingsRef} id="settings" className="content-section">
          <header className="content-header">
            <h2>Agent Settings</h2>
          </header>
          <div className="content-body">
            <AgentSettings />
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
