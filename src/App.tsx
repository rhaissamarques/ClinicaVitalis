import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Password from './Password';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ClinicaVitalis" element={<LandingPage />} />
        <Route path="/password" element={<Password />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
