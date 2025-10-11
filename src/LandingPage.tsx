import './LandingPage.css';
import Button from './Components/Button';
import Input from './Components/Input';
import React, { useState } from "react";

function LandingPage() {
  const [name, setName] = useState('');
  return (
    <>
      {/* <div>
        <Button variant='primary' onClick={() => alert('Clicou!')}>
          Ver a minha posição na fila
        </Button>
        <Button variant='primary' onClick={() => alert('Clicou!')}>
          Jogar enquanto espero
        </Button>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite sua senha (ex: A23)"
          variant="outlined"
          size="medium"
        />
      </div> */}
      
    </>
  );
}

export default LandingPage;
