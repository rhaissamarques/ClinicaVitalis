import { useEffect, useRef, useState } from 'react';
import backgroundImg from './assets/background.jpg';
import mascoteImg from './assets/mascote.png';
import pipeTopImg from './assets/pipe-top.png';
import pipeBottomImg from './assets/pipe-bottom.png';

const WIDTH = 360;
const HEIGHT = 600;
const GRAVITY = 0.5;
const JUMP_VELOCITY = -8;
const MAX_FALL = 16;
let PIPE_SPEED = 3;
const PIPE_WIDTH = 80;
const PIPE_GAP = 200;
const GROUND_HEIGHT = 70;

export default function FlappyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    class Bird {
      x: number;
      y: number;
      vy: number;
      width: number;
      height: number;
      angle: number;
      image: HTMLImageElement | null;
      constructor(x: number, y: number, image: HTMLImageElement | null) {
        this.x = x;
        this.y = y;
        this.vy = 0;
        this.width = 48;
        this.height = 50;
        this.angle = 0;
        this.image = image;
      }
      flap() { this.vy = JUMP_VELOCITY; }
      update() {
        this.vy += GRAVITY;
        if (this.vy > MAX_FALL) this.vy = MAX_FALL;
        this.y += this.vy;
        this.angle = Math.max(-25, Math.min(90, this.vy * 4));
      }
      draw(ctx: CanvasRenderingContext2D) {
        const validImage = this.image && this.image.complete && this.image.naturalWidth > 0;
        
        if (validImage) {
          ctx.save();
          ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
          ctx.rotate((this.angle * Math.PI) / 180);
          ctx.drawImage(this.image!, -this.width / 2, -this.height / 2, this.width, this.height);
          ctx.restore();
        } else {
          // Fallback: desenha um círculo amarelo
          ctx.save();
          ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
          ctx.rotate((this.angle * Math.PI) / 180);
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(5, -5, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      getRect() { return { x: this.x, y: this.y, width: this.width, height: this.height }; }
    }

    class Pipe {
      x: number;
      width: number;
      gap: number;
      passed: boolean;
      height: number;
      topY: number;
      bottomY: number;
      topImg: HTMLImageElement | null;
      bottomImg: HTMLImageElement | null;
      constructor(x: number, topImg: HTMLImageElement | null, bottomImg: HTMLImageElement | null) {
        this.x = x;
        this.width = PIPE_WIDTH;
        this.gap = PIPE_GAP;
        this.passed = false;
        this.topImg = topImg;
        this.bottomImg = bottomImg;
        this.height = 0;
        this.topY = 0;
        this.bottomY = 0;
        this.resetHeight();
      }
      resetHeight() {
        const min = 20, max = 320;
        this.height = Math.floor(Math.random() * (max - min + 1)) + min;
        this.topY = this.height - 320;
        this.bottomY = this.height + this.gap;
      }
      update() { this.x -= PIPE_SPEED; }
      draw(ctx: CanvasRenderingContext2D) {
        const validTop = this.topImg && this.topImg.complete && this.topImg.naturalWidth > 0;
        const validBottom = this.bottomImg && this.bottomImg.complete && this.bottomImg.naturalWidth > 0;
        
        if (validTop && validBottom) {
          ctx.drawImage(this.topImg!, this.x, this.topY, this.width, 320);
          ctx.drawImage(this.bottomImg!, this.x, this.bottomY, this.width, 320);
        } else {
          // Fallback: desenha retângulos verdes
          ctx.fillStyle = '#228B22';
          ctx.fillRect(this.x, this.topY, this.width, 320);
          ctx.fillRect(this.x, this.bottomY, this.width, 320);
          ctx.strokeStyle = '#006400';
          ctx.lineWidth = 3;
          ctx.strokeRect(this.x, this.topY, this.width, 320);
          ctx.strokeRect(this.x, this.bottomY, this.width, 320);
        }
      }
      hits(bird: Bird) {
        const r = bird.getRect();
        const withinX = r.x + r.width > this.x && r.x < this.x + this.width;
        if (!withinX) return false;
        if (r.y < this.height) return true;
        if (r.y + r.height > this.bottomY) return true;
        return false;
      }
    }

    class Ground {
      y: number;
      x1: number;
      x2: number;
      width: number;
      constructor(y: number) {
        this.y = y;
        this.x1 = 0;
        this.x2 = WIDTH;
        this.width = WIDTH;
      }
      update() {
        this.x1 -= PIPE_SPEED;
        this.x2 -= PIPE_SPEED;
        if (this.x1 + this.width < 0) this.x1 = this.x2 + this.width;
        if (this.x2 + this.width < 0) this.x2 = this.x1 + this.width;
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(this.x1, this.y, this.width, GROUND_HEIGHT);
        ctx.fillRect(this.x2, this.y, this.width, GROUND_HEIGHT);
        ctx.fillStyle = '#228B22';
        for (let i = 0; i < 20; i++) {
          ctx.fillRect(this.x1 + i * 25, this.y, 15, 8);
          ctx.fillRect(this.x2 + i * 25, this.y, 15, 8);
        }
      }
    }

    let bird: Bird;
    let pipes: Pipe[] = [];
    let ground: Ground;
    let bgImage: HTMLImageElement | null = null;
    let bgX1 = 0, bgX2 = 0, imgWidth = WIDTH;
    let rafId: number;

    // Usando as imagens importadas
    const sources = [
      { key: 'background', src: backgroundImg },
      { key: 'mascote', src: mascoteImg },
      { key: 'pipe-top', src: pipeTopImg },
      { key: 'pipe-bottom', src: pipeBottomImg },
    ];

    const images: Record<string, HTMLImageElement | null> = {};

    Promise.all(
      sources.map(
        ({ key, src }) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              images[key] = img;
              console.log(`✓ Imagem carregada: ${key}`);
              resolve();
            };
            img.onerror = () => {
              console.warn(`⚠️ Falha ao carregar imagem: ${key}. Usando fallback.`);
              images[key] = null;
              resolve();
            };
            img.src = src;
          })
      )
    ).then(() => {
      bgImage = images['background'];
      bird = new Bird(100, 350, images['mascote']);
      pipes = [new Pipe(600, images['pipe-top'], images['pipe-bottom'])];
      ground = new Ground(HEIGHT - GROUND_HEIGHT);
      
      if (bgImage && bgImage.complete && bgImage.naturalWidth > 0) {
        bgX2 = bgImage.width * (HEIGHT / bgImage.height);
      } else {
        bgX2 = WIDTH;
      }
      
      setLoading(false);
      loop();
    });

    function drawBackground() {
      if (!ctx) return;
      
      if (bgImage && bgImage.complete && bgImage.naturalWidth > 0) {
        const imgHeight = HEIGHT;
        const aspectRatio = bgImage.width / bgImage.height;
        imgWidth = imgHeight * aspectRatio;
        ctx.drawImage(bgImage, bgX1, 0, imgWidth, imgHeight);
        ctx.drawImage(bgImage, bgX2, 0, imgWidth, imgHeight);
      } else {
        // Fallback: desenha um gradiente de céu
        const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }
    }

    function drawFrame() {
      if (!ctx) return;
      drawBackground();
      pipes.forEach(p => p.draw(ctx));
      bird.draw(ctx);
      ground.draw(ctx);

      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.font = 'bold 40px Arial';
      const text = `Pontuação: ${score}`;
      const w = ctx.measureText(text).width;
      ctx.strokeText(text, WIDTH - 10 - w, 50);
      ctx.fillText(text, WIDTH - 10 - w, 50);
    }

    function update() {
      bgX1 -= PIPE_SPEED * 0.5;
      bgX2 -= PIPE_SPEED * 0.5;
      if (bgX1 + imgWidth <= 0) bgX1 = bgX2 + imgWidth;
      if (bgX2 + imgWidth <= 0) bgX2 = bgX1 + imgWidth;

      if (!started || over) return;

      bird.update();
      ground.update();
      let addPipe = false;

      for (const p of pipes) {
        if (!p.passed && bird.x > p.x + p.width) {
          p.passed = true;
          addPipe = true;
        }
        if (p.hits(bird)) {
          endGame();
          return;
        }
        p.update();
      }

      if (addPipe) {
        setScore(prev => {
          const newScore = prev + 1;
          if (newScore % 10 === 0) PIPE_SPEED += 0.5;
          return newScore;
        });
        pipes.push(new Pipe(WIDTH + 100, images['pipe-top'], images['pipe-bottom']));
      }

      pipes = pipes.filter(p => p.x + p.width > -50);

      if (bird.y + bird.height > ground.y || bird.y < 0) endGame();
    }

    function endGame() {
      setOver(true);
      cancelAnimationFrame(rafId);
    }

    function restartGame() {
      PIPE_SPEED = 3;
      setScore(0);
      setOver(false);
      setStarted(false);
      bird = new Bird(230, 350, images['mascote']);
      pipes = [new Pipe(600, images['pipe-top'], images['pipe-bottom'])];
      loop();
    }

    function loop() {
      update();
      drawFrame();
      if (!over) rafId = requestAnimationFrame(loop);
    }

    function handleAction(e: KeyboardEvent | MouseEvent) {
      if (loading) return;
      if (e instanceof KeyboardEvent && e.code !== 'Space') return;
      e.preventDefault();
      if (over) { 
        restartGame(); 
        return; 
      }
      if (!started) {
        setStarted(true);
      }
      if (bird) bird.flap();
    }

    document.addEventListener('keydown', handleAction);
    canvas.addEventListener('click', handleAction);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', handleAction);
      canvas.removeEventListener('click', handleAction);
    };
  }, [started, over, loading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white rounded-lg z-10">
            <div className="text-2xl font-bold">Carregando...</div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="border-4 border-yellow-500 rounded-lg shadow-2xl"
        />

        {!started && !over && !loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-80 text-white p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-3">Como Jogar</h3>
              <p className="text-lg mb-2">Pressione ESPAÇO ou clique para pular</p>
              <p className="text-sm text-gray-300">Evite os obstáculos!</p>
            </div>
          </div>
        )}

        {over && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-90 text-white p-8 rounded-lg text-center">
              <h2 className="text-4xl font-bold mb-4 text-red-400">Game Over!</h2>
              <p className="text-2xl mb-6">Sua pontuação: <span className="text-yellow-400 font-bold">{score}</span></p>
              <button
                onClick={() => {
                  setOver(false);
                  setStarted(false);
                  setScore(0);
                  PIPE_SPEED = 3;
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
              >
                Jogar Novamente
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-white text-center">
        <p className="text-sm">Use ESPAÇO ou clique para jogar</p>
      </div>
    </div>
  );
}