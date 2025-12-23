import { useRef, useEffect } from 'react';

export function useSnowflakes(num = 70) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let snowflakes = [];
    for (let i = 0; i < num; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 2,
        d: Math.random() * 1 + 0.5,
        speed: Math.random() * 1.5 + 0.5,
        vel: Math.random() * 0.06 - 0.03,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fff';
      for (let flake of snowflakes) {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF';
        ctx.fill();
      }
      ctx.restore();
    }
    function animate() {
      for (let flake of snowflakes) {
        flake.x += flake.vel;
        flake.y += Math.pow(flake.d, 2) + flake.speed;
        if (flake.x > width || flake.x < 0) flake.vel *= -1;
        if (flake.y > height) {
          flake.x = Math.random() * width;
          flake.y = -flake.r;
        }
      }
      draw();
      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [num]);
  return ref;
}

