import './GameOverCard.css';

interface GameOverCardProps {
  score: number;
  onRestart: () => void;
}

export default function GameOverCard({ score, onRestart }: GameOverCardProps) {
  return (
    <div className="gameover-card">
      <div className="gameover-card-content">
        <h2>Game Over!</h2>
        <p>
          Sua pontuação: <span>{score}</span>
        </p>
        <button onClick={onRestart}>Jogar Novamente</button>
      </div>
    </div>
  );
}
