import ReturnArrow from './assets/ReturnArrow.png';
import { useNavigate } from 'react-router-dom';
import iconePequeno from './assets/iconePequeno.svg';
import Button from './Components/Button';
import { toast } from 'sonner';
import Footer from './Components/Footer';
import './Fila.css';

function Fila() {
  const navigate = useNavigate();

  return (
    <div className="fila">
      <div className="contentHeaderFila">
        <div className="headerFila">
          <button className='returnButtonFila'>
            <img src={ReturnArrow} alt="" onClick={() => navigate('/clinicaVitalis')} />
          </button>
          <div className="logoImageFila">
            <img src={iconePequeno} alt="" />
          </div>
        </div>
      </div>
      <div className="contentFila">
        <h1 className='contentH1Fila'>
          Status da fila
        </h1>
        <p className='contentPFila'>Você é o 4° da fila</p>
        <p className='contentP2Fila'>Tempo estimado: 30 minutos</p>

        <div className="inputAndButtonFila">
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
  );
}

export default Fila;