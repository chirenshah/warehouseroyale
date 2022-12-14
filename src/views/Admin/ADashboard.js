import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Components
import Layout from '../../components/layout/Layout';
// Pages
import Home from './pages/home/Home';
import UserList from './pages/userList/UserList';
import User from './pages/user/User';
import NewUser from './pages/newUser/NewUser';
import GameSetup from './pages/gameSetup/GameSetup';
import Messages from './pages/messages/Messages';
// Configs
import { aDashboardSidebarConfig } from '../../configs/sidebarConfigs';

export default function ADashboard() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout sidebarConfig={aDashboardSidebarConfig} />}>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/new-user" element={<NewUser />} />
          <Route path="/game-setup" element={<GameSetup />} />
          <Route path="/messages" element={<Messages />} />
        </Route>
      </Routes>
    </Router>
  );
}
