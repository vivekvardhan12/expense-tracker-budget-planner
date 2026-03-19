import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Budgets from './pages/Budgets';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '10px', background: '#333' }}>
        <Link to="/" style={{ color: 'white', marginRight: '10px' }}>
          Dashboard
        </Link>
        <Link to="/budgets" style={{ color: 'white' }}>
          Budgets
        </Link>
      </nav>

      <Routes>
        {/* Default route */}
        <Route path="/" element={<Dashboard />} />

        {/* Budgets */}
        <Route path="/budgets" element={<Budgets />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;