import React from 'react';
import { useAuthContext } from './hooks/useAuthContext';
import LoginForm from './components/LoginForm';
import Game from './components/employee_game';
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { DndProvider } from "react-dnd";
import { emailPasswordAuth } from './Database/Auth';
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
  const { user, isAuthReady } = useAuthContext();

  const role = localStorage.getItem('warehouse_user_role');

  return isAuthReady && user && role === 'admin' ? (
    <ADashboard />
  ) : role === 'manager' ? (
    <MDashboard />
  ) : role === 'employee' ? (
    <EDashboard />
  ) : (
    <LoginForm />
  );
}

export default App;
