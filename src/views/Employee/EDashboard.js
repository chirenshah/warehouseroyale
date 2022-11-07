import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Components
import Layout from '../../components/layout/Layout';
// Pages
import Home from './pages/home/Home';
import MyTeam from './pages/myTeam/MyTeam';
import Offers from './pages/offers/Offers';
import Chat from './pages/chat/Chat';
import About from './pages/about/About';
// Configs
import { eDashboardSidebarConfig } from '../../configs/sidebarConfigs';

export default function EDashboard() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout sidebarConfig={eDashboardSidebarConfig} />}>
          <Route path="/" element={<Home />} />
          <Route path="/my-team" element={<MyTeam />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
}
