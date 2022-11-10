import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Components
import Layout from "../../components/layout/Layout";
// Pages
import Home from "./pages/home/Home";
import MyTeam from "./pages/myTeam/MyTeam";
import RecruitmentRoom from "./pages/recruitmentRoom/RecruitmentRoom";
import Messenger from "./pages/messenger/Messenger";
import OperationRoom from "./pages/operationRoom/OperationRoom";
import About from "./pages/about/About";
import Game from "../../components/employee_game";
// Configs
import { mDashboardSidebarConfig } from "../../configs/sidebarConfigs";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function MDashboard() {
    return (
        <Router>
            <Routes>
                <Route
                    element={<Layout sidebarConfig={mDashboardSidebarConfig} />}
                >
                    <Route path="/" element={<Home />} />
                    <Route path="my-team" element={<MyTeam />} />
                    <Route
                        path="recruitment-room"
                        element={<RecruitmentRoom />}
                    />
                    <Route
                        path="game"
                        element={
                            // <DndProvider backend={HTML5Backend}>
                            <Game />
                            // </DndProvider>
                        }
                    />

                    <Route path="messenger" element={<Messenger />} />
                    <Route path="operationroom" element={<OperationRoom />} />
                    <Route path="about" element={<About />} />
                </Route>
            </Routes>
        </Router>
    );
}
