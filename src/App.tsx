import { BrowserRouter, Route, Routes } from 'react-router';
import Header from './components/MapContents/Header';
import MapDataProvider from './context/MapDataProvider';
import HomePage from './pages/Home';

import './App.css';

export default function App() {
  return (
    <MapDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/header' element={<Header />} />
          <Route path='/' element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </MapDataProvider>
  );
}
