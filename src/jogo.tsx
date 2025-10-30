import { useEffect, useRef, useState } from 'react';
import backgroundImg from './assets/background.png';
import mascoteImg from './assets/mascote.png';
import pipeTopImg from './assets/pipe-top.png';
import pipeBottomImg from './assets/pipe-bottom.png';
import LoadingCard from './Components/LoadingCard';
import GameOverCard from './Components/GameOverCard';
import ReturnArrow from './assets/ReturnArrow.png';
import { useNavigate } from 'react-router-dom';
import './jogoStyles.css'

const BASE_WIDTH = 360;
const BASE_HEIGHT = 600;

export default function FlappyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const scoreRef = useRef(0);
  const navigate = useNavigate();


  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function getScale() {
      if (!container) return 1;
      const containerWidth = container.clientWidth || 360;
      const maxWidth = Math.min(containerWidth, 400);
      return maxWidth / BASE_WIDTH;
    }

    let scale = getScale();
    let WIDTH = BASE_WIDTH * scale;
    let HEIGHT = BASE_HEIGHT * scale;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    let GRAVITY = 0.15 * scale;
    let JUMP_VELOCITY = -5 * scale;
    let MAX_FALL = 8 * scale;
    let PIPE_SPEED = 1 * scale;
    let PIPE_WIDTH = 80 * scale;
    let PIPE_GAP = 200 * scale;
    let GROUND_HEIGHT = 50 * scale;

    function updateScale() {
      if (!canvas || !container) return;
      scale = getScale();
      WIDTH = BASE_WIDTH * scale;
      HEIGHT = BASE_HEIGHT * scale;
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      
      GRAVITY = 0.15 * scale;
      JUMP_VELOCITY = -5 * scale;
      MAX_FALL = 8 * scale;
      PIPE_SPEED = 1 * scale;
      PIPE_WIDTH = 80 * scale;
      PIPE_GAP = 200 * scale;
      GROUND_HEIGHT = 50 * scale;

      if (bird) {
        bird.width = 48 * scale;
        bird.height = 50 * scale;
        bird.x = 100 * scale;
        bird.y = Math.min(bird.y, HEIGHT - GROUND_HEIGHT - bird.height);
      }
      
      if (ground) {
        ground.y = HEIGHT - GROUND_HEIGHT;
        ground.width = WIDTH;
        ground.x2 = WIDTH;
      }

      pipes.forEach(p => {
        p.width = PIPE_WIDTH;
        p.gap = PIPE_GAP;
      });

      if (bgImage && bgImage.complete && bgImage.naturalWidth > 0) {
        bgX2 = bgImage.width * (HEIGHT / bgImage.height);
      } else {
        bgX2 = WIDTH;
      }
    }

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
        this.width = 48 * scale;
        this.height = 50 * scale;
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
          ctx.save();
          ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
          ctx.rotate((this.angle * Math.PI) / 180);
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(5 * scale, -5 * scale, 3 * scale, 0, Math.PI * 2);
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
        const min = 20 * scale, max = 320 * scale;
        this.height = Math.floor(Math.random() * (max - min + 1)) + min;
        this.topY = this.height - 320 * scale;
        this.bottomY = this.height + this.gap;
      }
      update() { this.x -= PIPE_SPEED; }
      draw(ctx: CanvasRenderingContext2D) {
        const validTop = this.topImg && this.topImg.complete && this.topImg.naturalWidth > 0;
        const validBottom = this.bottomImg && this.bottomImg.complete && this.bottomImg.naturalWidth > 0;
        
        if (validTop && validBottom) {
          ctx.drawImage(this.topImg!, this.x, this.topY, this.width, 390);
          ctx.drawImage(this.bottomImg!, this.x, this.bottomY, this.width, 390);
        } else {
          ctx.fillStyle = '#228B22';
          ctx.fillRect(this.x, this.topY, this.width, 390 * scale);
          ctx.fillRect(this.x, this.bottomY, this.width, 390 * scale);
          ctx.strokeStyle = '#006400';
          ctx.lineWidth = 3 * scale;
          ctx.strokeRect(this.x, this.topY, this.width, 390 * scale);
          ctx.strokeRect(this.x, this.bottomY, this.width, 390 * scale);
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
    }

    let bird: Bird;
    let pipes: Pipe[] = [];
    let ground: Ground;
    let bgImage: HTMLImageElement | null = null;
    let bgX1 = 0, bgX2 = 0, imgWidth = WIDTH;
    let rafId: number;

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
              resolve();
            };
            img.onerror = () => {
              images[key] = null;
              resolve();
            };
            img.src = src;
          })
      )
    ).then(() => {
      bgImage = images['background'];
      bird = new Bird(100 * scale, 350 * scale, images['mascote']);
      pipes = [new Pipe(400 * scale, images['pipe-top'], images['pipe-bottom'])];
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

      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3 * scale;
      ctx.font = 'bold 40px Arial';
      const text = `Pontuação: ${scoreRef.current}`;
      const w = ctx.measureText(text).width;
      ctx.strokeText(text, WIDTH - 10 * scale - w, 50 * scale);
      ctx.fillText(text, WIDTH - 10 * scale - w, 50 * scale);
    }

    function update() {
      bgX1 -= PIPE_SPEED * 0.5;
      bgX2 -= PIPE_SPEED * 0.5;
      if (bgX1 + imgWidth <= 0) bgX1 = bgX2 + imgWidth;
      if (bgX2 + imgWidth <= 0) bgX2 = bgX1 + imgWidth;

      if (!started || over) return;

      bird.update();

      for (const p of pipes) {
        if (!p.passed && bird.x > p.x + p.width) {
          p.passed = true;
          scoreRef.current += 1;
          setScore(scoreRef.current);

          if (scoreRef.current % 5 === 0) PIPE_SPEED += 0.5 * scale;
          pipes.push(new Pipe(WIDTH + 100 * scale, images['pipe-top'], images['pipe-bottom']));
        }
        if (p.hits(bird)) {
          endGame();
          return;
        }
        p.update();
      }

      pipes = pipes.filter(p => p.x + p.width > -50 * scale);

      if (bird.y + bird.height > ground.y || bird.y < 0) endGame();
    }

    function endGame() {
      setOver(true);
      cancelAnimationFrame(rafId);
    }

    function restartGame() {
      PIPE_SPEED = 3 * scale;
      scoreRef.current = 0;
      setScore(0);
      setOver(false);
      setStarted(false);
      bird = new Bird(230 * scale, 350 * scale, images['mascote']);
      pipes = [new Pipe(800 * scale, images['pipe-top'], images['pipe-bottom'])];
      loop();
    }

    function loop() {
      update();
      drawFrame();
      if (!over) rafId = requestAnimationFrame(loop);
    }

    function handleAction(e: Event) {
      e.preventDefault();
      if (loading) return;
      if (over) { restartGame(); return;}
      if (!started) setStarted(true);
      bird.flap();
    }

    canvas.addEventListener('touchstart', handleAction, { passive: false });
    canvas.addEventListener('click', handleAction);

    const handleResize = () => {
      if (canvas && container) {
        updateScale();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('touchstart', handleAction);
      canvas.removeEventListener('click', handleAction);
      window.removeEventListener('resize', handleResize);
    };
  }, [started, over, loading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="contentHeader">
        <div className="header" >
          <button className='returnButton' onClick={() => navigate('/clinicaVitalis')}>
            <img src={ReturnArrow} alt="Voltar" />
          </button>
        </div>
      </div>
      <div ref={containerRef} className="relative w-full max-w-[400px]">
        {loading && <LoadingCard />}

        <canvas 
          ref={canvasRef}
          className="border-4 border-yellow-500 rounded-lg shadow-2xl w-full h-auto touch-none"
        />

        {!started && !over && !loading }

        {over && (
          <GameOverCard
            score={score}
            onRestart={() => {
              setOver(false);
              setStarted(false);
              setScore(0);
              scoreRef.current = 0;
            }}
            onClose={() => setOver(false)}
          />
        )}
      </div>
    </div>
  );
}