import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import logo from './logo.svg';
import './App.css';
import './styles/theme.css';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;