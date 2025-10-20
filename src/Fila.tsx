import ReturnArrow from './assets/ReturnArrow.png';
import { useNavigate } from 'react-router-dom';
import iconePequeno from './assets/iconePequeno.svg';
import Button from './Components/Button';
import { toast } from 'sonner';
import Footer from './Components/Footer';
import './Fila.css';
import { useEffect, useState } from 'react';

function Fila() {
  const navigate = useNavigate();
  const [queuePosition, setQueuePosition] = useState(0);
  const MINUTES_PER_CLIENT = 10;

  useEffect(() => {
    // Generate random number between 0 and 10
    const randomValue = Math.floor(Math.random() * 11);
    setQueuePosition(randomValue);
  }, []); // Empty dependency array means this runs once on component mount

  const estimatedTime = queuePosition * MINUTES_PER_CLIENT;

  return (
    <div className="fila">
      <div className="contentHeaderFila">
        <div className="headerFila">
          <button className='returnButtonFila' onClick={() => navigate('/clinicaVitalis')}>
            <img src={ReturnArrow} alt="Voltar" />
          </button>
          <div className="logoImageFila">
            <img src={iconePequeno} alt="Logo Clínica Vitalis" />
          </div>
        </div>
      </div>
      <div className="contentFila">
        <h1 className='contentH1Fila'>
          Status da fila
        </h1>
        <p className='contentPFila'>Você é o {queuePosition}° da fila</p>
        <p className='contentP2Fila'>Tempo estimado: {estimatedTime} minutos</p>

        <div className="progressBar">
          <div
            className="progressBarFill"
            style={{ width: `${(queuePosition / 10) * 100}%` }}
          />
        </div>

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