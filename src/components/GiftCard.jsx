import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
export function useBellSFX() {
  return () => {};
}

const elegantVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.39, ease: 'easeOut' } },
  hover: {
    y: -8,
    boxShadow: '0 6px 46px 8px #FFD70026,0 0 0px 0px #FFFFFF00',
    transition: {
      y: { type: 'spring', stiffness: 210, damping: 20 },
      boxShadow: { duration: 0.2 }
    }
  },
  tap: {
    scale: 0.97,
    y: -3,
    boxShadow: '0 3px 24px 2px #FFD70022',
    transition: { type: 'spring', stiffness: 450, damping: 30 }
  }
};

export default function GiftCard({ regalo, onClick, customDelay = 0 }) {
  const triggerBell = useBellSFX();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      variants={elegantVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className="cursor-pointer relative flex justify-center items-center bg-white/10 rounded-xl aspect-square shadow-lg ring-2 ring-gold-glow/30 hover:z-10 duration-200"
      style={{ willChange: 'transform, box-shadow' }}
      transition={{ delay: customDelay, type: 'spring', stiffness: 350, damping: 23 }}
      onMouseEnter={() => { setIsHovered(true); triggerBell(); }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(regalo.id)}
      tabIndex={0}
      aria-label={`Abrir regalo ${regalo.id}`}
    >
      <motion.img
        src={isHovered ? '/abrir.png' : regalo.url.replace('/public','')}
        alt={regalo.alt}
        className={`drop-shadow-xl select-none transition-all duration-300 w-40 sm:w-56 md:w-64 ${isHovered ? 'scale-125 z-10' : 'scale-100'}`}
        draggable="false"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          delay: 0.10 + customDelay,
          opacity: { duration: 0.32 },
          scale: { type: 'spring', stiffness: 380, damping: 19 },
          y: { type: 'spring', stiffness: 420, damping: 33 },
        }}
      />
      <span className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_0_18px_5px_rgba(255,215,0,0.06)]" />
    </motion.div>
  );
}

GiftCard.propTypes = {
  regalo: PropTypes.shape({ id: PropTypes.number, url: PropTypes.string, alt: PropTypes.string }).isRequired,
  onClick: PropTypes.func.isRequired,
  customDelay: PropTypes.number,
};
