import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Components
import Layout from '../../components/layout/Layout';
// Pages
import Home from './pages/home/Home';
import MyTeam from './pages/myTeam/MyTeam';
import Offers from './pages/offers/Offers';
import Chat from './pages/chat/Chat';
import OperationRoom from './pages/operationRoom/OperationRoom';
import About from './pages/about/About';
import Game from '../../components/employee_game';
// Configs
import { eDashboardSidebarConfig } from '../../configs/sidebarConfigs';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export default function EDashboard() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route element={<Layout sidebarConfig={eDashboardSidebarConfig} />}>
            <Route path="/" element={<Home />} />
            <Route path="/my-team" element={<MyTeam />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/operation-room" element={<OperationRoom />} />
            <Route path="/about" element={<About />} />
          </Route>
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </DndProvider>
  );
}
