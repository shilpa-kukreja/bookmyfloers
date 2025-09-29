import { useEffect, useRef } from 'react';

const IncenseSmoke = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class SmokeParticle {
      constructor(x, y) {
        this.x = x + (Math.random() * 10 - 5);
        this.y = y;
        this.alpha = 0.3 + Math.random() * 0.03; // very thin
        this.size = 20 + Math.random() * 40;
        this.vx = Math.sin(Math.random() * Math.PI * 2) * 0.05;
        this.vy = -0.3 - Math.random() * 0.1;
        this.life = 250 + Math.random() * 100;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 0.01 - 0.01;
      }

      update() {
        this.x += this.vx + Math.sin(this.rotation) * 0.1;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.alpha -= 0.0005; // very slow fade
        this.life--;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `rgba(255,255,255,${this.alpha})`);
        gradient.addColorStop(0.4, `rgba(255,255,255,${this.alpha * 0.5})`);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Add fewer, gentler smoke particles
      for (let i = 0; i < 1; i++) {
        particles.current.push(new SmokeParticle(mouse.current.x, mouse.current.y));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => p.life > 0 && p.alpha > 0);

      for (const p of particles.current) {
        p.update();
        p.draw(ctx);
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default IncenseSmoke;
