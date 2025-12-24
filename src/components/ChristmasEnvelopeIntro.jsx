import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function ChristmasEnvelopeIntro({ onFinish }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Ocultar después de la animación (~3s)
    const timer = setTimeout(() => {
      setShow(false);
      if (onFinish) setTimeout(onFinish, 450);
    }, 3200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  // Variants para secuenciar la animación
  const containerVar = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.12 } },
    exit: { opacity: 0, transition: { duration: 0.6 } }
  };

  const envelopeVar = {
    hidden: { scale: 0.86, y: 40, opacity: 0 },
    visible: { scale: 1, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 160, damping: 18, mass: 0.9 } },
    exit: { scale: 0.9, y: -120, opacity: 0, transition: { duration: 0.45, ease: 'easeIn' } }
  };

  const flapVar = {
    closed: { rotateX: 0 },
    // Abrir la tapa hacia abajo: usar rotateX positivo y origen en la parte superior
    open: { rotateX: 150, transition: { delay: 0.6, duration: 0.9, type: 'spring', stiffness: 90, damping: 14 } }
  };

  const cardVar = {
    hidden: { y: 36, opacity: 0, scale: 0.92 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { delay: 0.95, type: 'spring', stiffness: 200, damping: 16 } }
  };

  const ribbonVar = {
    hidden: { opacity: 0, scale: 0.7, y: 6 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { delay: 1.6, duration: 0.45, type: 'spring', stiffness: 220, damping: 18 } }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center"
          variants={containerVar}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Contenedor con perspective para dar 3D al giro de la tapa */}
          <motion.div
            className="relative w-[360px] h-[250px] flex flex-col items-center justify-center drop-shadow-2xl"
            style={{ perspective: 1100 }}
            variants={envelopeVar}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Fondo del sobre */}
            <div
              className="absolute left-0 top-0 w-full h-full bg-[#f4e7cf] border-4 border-[#b58d5b] rounded-b-2xl rounded-t-lg"
              style={{ zIndex: 1 }}
            />

            {/* Tapa del sobre (animada en 3D) */}
            <motion.div
              className="absolute left-0 top-0 w-full h-[96px] origin-top rounded-t-2xl"
              style={{
                background: 'linear-gradient(180deg, #d27842 55%, #fff8ee 100%)',
                zIndex: 4,
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                borderBottomLeftRadius: 48,
                borderBottomRightRadius: 48,
                borderBottom: '3px solid #ce8050',
                transformStyle: 'preserve-3d'
              }}
              variants={flapVar}
              initial="closed"
              animate="open"
            />

            {/* Tarjeta navideña */}
            <motion.div
              className="absolute top-8 left-[18px] w-[310px] h-[144px] rounded-lg bg-[#fff4d6] border-2 border-[#b58d5b] flex flex-col items-center justify-center shadow-lg"
              variants={cardVar}
              initial="hidden"
              animate="visible"
              style={{ zIndex: 7 }}
            >
              <div className="text-[#b67227] text-lg font-script mb-1 mt-3">¡Feliz Navidad!</div>
              <div className="text-[#95511c] font-semibold text-base text-center px-2">Abre los regalos y encuentra<br />magia y cariño en cada uno.</div>
              <div className="mt-2 text-xs text-[#915612]">🎁✨ Con mucho aprecio ✨🎁</div>
            </motion.div>

            {/* Lazo decorativo */}
            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-row items-center gap-1"
              style={{ zIndex: 12 }}
              variants={ribbonVar}
              initial="hidden"
              animate="visible"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e1aa75] to-[#faf6f0] border border-[#b58d5b] shadow-md flex items-center justify-center text-lg">🎀</div>
            </motion.div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
