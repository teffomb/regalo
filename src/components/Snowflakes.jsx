import { useSnowflakes } from '../utils/snowflakes';

export default function Snowflakes() {
  const canvasRef = useSnowflakes(80);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-0"
      style={{
        top: 0,
        left: 0,
        background: 'none',
        mixBlendMode: 'lighten',
      }}
    />
  );
}

