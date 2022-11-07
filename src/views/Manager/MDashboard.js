import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Components
import Layout from '../../components/layout/Layout';
// Pages
import Home from './pages/home/Home';
import MyTeam from './pages/myTeam/MyTeam';
import RecruitmentRoom from './pages/recruitmentRoom/RecruitmentRoom';
import Messenger from './pages/messenger/Messenger';
import OperationRoom from './pages/operationRoom/OperationRoom';
import About from './pages/about/About';
// Configs
import { mDashboardSidebarConfig } from '../../configs/sidebarConfigs';

export default function MDashboard() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout sidebarConfig={mDashboardSidebarConfig} />}>
          <Route path="/" element={<Home />} />
          <Route path="/my-team" element={<MyTeam />} />
          <Route path="/recruitment-room" element={<RecruitmentRoom />} />
          <Route path="/messenger" element={<Messenger />} />
          <Route path="/operation-room" element={<OperationRoom />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
}
