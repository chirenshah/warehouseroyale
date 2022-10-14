import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import Game from "./components/employee_game";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { emailPasswordAuth } from "./Database/Auth";
import { ContextProvider } from "./components/views/Manager/dashboard/contexts/ContextProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
    Myteam,
    Performancemetric,
    Recruitmentroom,
} from "./components/views/Manager/dashboard/pages";
import Messenger from "./components/views/Manager/dashboard/pages/Messenger";

function App() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const isManager = false;
    if (!user && window.localStorage.admin) {
        setUser(window.localStorage.admin);
    }
    const Login = (details) => {
        emailPasswordAuth(details.email, details.password, setUser, setError);
    };
    // eslint-disable-next-line
    const Logout = () => {
        setUser("");
    };
    return (
        <div className="App">
            {user ? (
                <DndProvider backend={HTML5Backend}>
                    <ContextProvider>
                        <BrowserRouter>
                            <Routes>
                                {/* dashboard  */}
                                <Route
                                    path="/"
                                    element={isManager ? null : <Game />}
                                />
                                <Route
                                    path="/performancemetric"
                                    element={<Performancemetric />}
                                />

                                {/* pages  */}
                                <Route
                                    path="/recruitmentroom"
                                    element={<Recruitmentroom />}
                                />
                                <Route
                                    path="/messenger"
                                    element={<Messenger />}
                                />
                                <Route path="/Myteam" element={<Myteam />} />
                            </Routes>
                        </BrowserRouter>
                    </ContextProvider>
                </DndProvider>
            ) : (
                <LoginForm Login={Login} error={error} />
            )}
        </div>
    );
}

export default App;
