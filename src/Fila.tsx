import ReturnArrow from './assets/ReturnArrow.png';
import logoPassword from './assets/logoPassword.svg';
import './PasswordStyles.css';
import { useNavigate } from 'react-router-dom';
import Button from './Components/Button';
import Footer from './Components/Footer';
import { toast } from 'sonner';

function Fila() {
  const navigate = useNavigate();

  return (
    <div className="fila">
      <div className="contentHeader">
        <div className="header">
          <button className='returnButton' onClick={() => navigate('/clinicaVitalis')}>
            <img src={ReturnArrow} alt="Voltar" />
          </button>
        </div>
        <div className="logoImage">
          <img src={logoPassword} alt="" />
        </div>
      </div>
      <div className="content">
        <h1 className='contentH1'>
          Status da fila
        </h1>
        <p className='contentP'>Você é o 4° da fila</p>
        <p className="contentp2">Tempo estimado: 30 minutos</p>

        <div className="inputAndButton">
          <Button
            variant='primary'
            onClick={() => toast.success("Notificações ativadas!")}
          >
            Ativar notificações
          </Button>

          <Button
            variant='secondary'
            onClick={() => navigate('/jogo')}
          >
            Jogar enquanto espero
          </Button>
        </div>
      </div>
      <Footer
        text='Transparência no seu atendimento'
      />
    </div>

  )
}

export default Fila;