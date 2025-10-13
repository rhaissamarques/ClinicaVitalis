import ReturnArrow from './assets/ReturnArrow.png';
import logoPassword from './assets/logoPassword.png'
import './PasswordStyles.css';
import { useNavigate } from 'react-router-dom';
import Button from './Components/Button';
import Input from './Components/Input';
import { useState } from 'react';


function Password() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState('');

  return (
    <div className="password">
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
          Acompanhe seu atendimento
        </h1>
        <p className='contentP'>Digite o número da sua senha e acompanhe o tempo de espera em tempo real.</p>

        <div className="inputAndButton">
          <Input
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder='Digite sua senha (ex: A23)'
          />
          <Button variant='primary' onClick={() => navigate('/password')}>
            Confirmar
          </Button>
        </div>
      </div>
      <footer className='footer'>
        <p>Transparência no seu atendimento.</p>
      </footer>
    </div>

  )
}

export default Password;