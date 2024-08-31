// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapIndex from './map/train/MapIndex';
import Login from './map/train/Login';

const App = () => {
  const isAuthenticated = !!sessionStorage.getItem('token'); // Check for token

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {isAuthenticated ? (
          <Route path="/" element={<MapIndex />} />
        ) : (
          <Route path="/" element={<Login />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
