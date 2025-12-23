import { motion } from 'framer-motion';

export default function GarlandSwingDecor({ className = '', style, children }) {
  // Ángulo base y animación swing
  return (
    <motion.div
      className={`absolute ${className}`}
      style={style}
      initial={{ rotate: -10 }}
      animate={{ rotate: [ -10, 7, -7, 11, -10 ] }}
      transition={{ duration: 1.15, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

