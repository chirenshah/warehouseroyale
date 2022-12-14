import React from 'react';
import { useAuthContext } from './hooks/useAuthContext';
import LoginForm from './components/LoginForm';
import Game from './components/employee_game';
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { DndProvider } from "react-dnd";
// import { ContextProvider } from "./components/views/Manager/dashboard/contexts/ContextProvider";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import {
//     Myteam,
//     Performancemetric,
//     Recruitmentroom,
// } from "./components/views/Manager/dashboard/pages";
// import Messenger from "./components/views/Manager/dashboard/pages/Messenger";
// Views
import ADashboard from './views/Admin/ADashboard';
import MDashboard from './views/Manager/MDashboard';
import EDashboard from './views/Employee/EDashboard';

function App() {
  const { user } = useAuthContext();

  return user && user.role === 'admin' ? (
    <ADashboard />
  ) : user && user.role === 'manager' ? (
    <MDashboard />
  ) : user && user.role === 'employee' ? (
    <EDashboard />
  ) : (
    <LoginForm />
  );
}

export default App;
