import './LandingPage.css';
import Button from './Components/Button';
import Input from './Components/Input';
import bgLanding from './assets/bgLandingPage.png';
import LogoLandingPage from './assets/LogoLandingPage.png';
import { useNavigate } from 'react-router-dom';
import Footer from './Components/Footer';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="body">
      <div className="bgLanding">
        <img src={bgLanding} alt="Background Landing" />
      </div>
      <div className="logoLanding">
        <img src={LogoLandingPage} alt="Logo Clinica Vitalis" />
      </div>
      <div className="content">
        <h1 className='content-h1'>Bem-vindo(a) à Clinica Vitalis</h1>
        <p className='content-p'>
          Acompanhe sua posição na fila ou relaxe com uma pausa leve enquanto espera.
        </p>
      </div>
      <div className='buttons'>
        <Button variant='primary' onClick={() => navigate('/password')}>
          Ver a minha posição na fila
        </Button>
        <Button variant='primary' onClick={() => navigate('/jogo')}>
          Jogar enquanto espero
        </Button>
      </div>
      <Footer 
        text='Seu tempo importa. Seu bem-estar também.'
      />
    </div>
  );
}

export default LandingPage;
