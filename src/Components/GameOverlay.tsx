import React from 'react';

interface GameOverlayProps {
  loading: boolean;
  started: boolean;
  over: boolean;
  score: number;
  onRestart: () => void;
}

export default function GameOverlay({
  loading,
  started,
  over,
  score,
  onRestart,
}: GameOverlayProps) {
  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white rounded-lg z-10">
        <div className="text-2xl font-bold">Carregando...</div>
      </div>
    );
  }

  if (!started && !over) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-80 text-white p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-3">Como Jogar</h3>
          <p className="text-lg mb-2">Pressione ESPAÇO ou clique para pular</p>
          <p className="text-sm text-gray-300">Evite os obstáculos!</p>
        </div>
      </div>
    );
  }

  if (over) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-90 text-white p-8 rounded-lg text-center">
          <h2 className="text-4xl font-bold mb-4 text-red-400">Game Over!</h2>
          <p className="text-2xl mb-6">
            Sua pontuação:{' '}
            <span className="text-yellow-400 font-bold">{score}</span>
          </p>
          <button
            onClick={onRestart}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
          >
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  return null;
}
