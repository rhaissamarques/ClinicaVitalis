import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameOverCard.css';
import useClickOutside from './useClickOutside';

interface GameOverCardProps {
  score: number;
  onRestart: () => void;
  onClose: () => void;
}

export default function GameOverCard({ score, onRestart, onClose }: GameOverCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useClickOutside(cardRef, onClose);

  const handleClose = () => {
    onClose();
    navigate('/ClinicaVitalis');
  };

  return (
    <div className="gameover-card">
      <div ref={cardRef} className="gameover-card-content">
        <h2>Game Over!</h2>
        <p>
          Sua pontuação: <span>{score}</span>
        </p>

        <div className="buttons">
          <button onClick={onRestart}>Jogar Novamente</button>
          <button onClick={handleClose} className="close-btn">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
