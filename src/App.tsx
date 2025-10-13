import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Password from './Password';
import Fila from './Fila';
import { Toaster } from 'sonner';
import Jogo from './jogo';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/ClinicaVitalis" element={<LandingPage />} />
        <Route path="/password" element={<Password />} />
        <Route path= "/fila" element={<Fila />} />
        <Route path= "/jogo" element={<Jogo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
