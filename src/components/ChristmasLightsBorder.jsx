import { motion } from 'framer-motion';

const bulbColors = ["#FFD700","#6EF7D2","#FF5CAD","#FFFFFF","#FB4043","#57C7FF","#B897FF"];
const numBulbs = 22;

function LightBulb({ color, idx }) {
  return (
    <motion.div
      key={idx}
      className="w-5 h-5 rounded-full shadow-xl border-2 border-white"
      style={{ backgroundColor: color, margin: 2, boxShadow: `0 0 12px 3px ${color}` }}
      animate={{ scale: [1,1.4,1], opacity: [0.7,1,0.7] }}
      transition={{ duration: 1.8 + Math.random()*1.5, repeat: Infinity, delay: idx*0.08, ease: "easeInOut" }}
    />
  );
}

export default function ChristmasLightsBorder({ className = "" }) {
  return (
    <>
      {/* top border */}
      <div className={`absolute left-0 right-0 top-0 flex justify-between px-3 z-20 pointer-events-none ${className}`} style={{height:'25px'}}>
        {[...Array(numBulbs)].map((_,i) => (
          <LightBulb color={bulbColors[i % bulbColors.length]} idx={i} key={i} />
        ))}
      </div>
      {/* bottom border */}
      <div className={`absolute left-0 right-0 bottom-0 flex justify-between px-3 z-20 pointer-events-none ${className}`} style={{height:'24px'}}>
        {[...Array(numBulbs)].map((_,i) => (
          <LightBulb color={bulbColors[(i+2) % bulbColors.length]} idx={i+200} key={i+100} />
        ))}
      </div>
      {/* left border (vertical string of bulbs) */}
      <div className="absolute top-16 bottom-16 left-0 flex flex-col justify-between px-1 z-20 pointer-events-none" style={{width:'24px'}}>
        {[...Array(12)].map((_,i) => (
          <LightBulb color={bulbColors[(i+3)%bulbColors.length]} idx={i+300} key={i+900} />
        ))}
      </div>
      {/* right border (vertical string of bulbs) */}
      <div className="absolute top-16 bottom-16 right-0 flex flex-col justify-between px-1 z-20 pointer-events-none" style={{width:'24px'}}>
        {[...Array(12)].map((_,i) => (
          <LightBulb color={bulbColors[(i+5) % bulbColors.length]} idx={i+400} key={i+1100} />
        ))}
      </div>
    </>
  );
}
