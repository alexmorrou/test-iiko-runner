// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KitchenOrder from './KitchenOrder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/order/:orderId" element={<KitchenOrder />} />
      </Routes>
    </Router>
  );
}

export default App;