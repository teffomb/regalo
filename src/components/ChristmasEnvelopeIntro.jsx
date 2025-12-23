import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function ChristmasEnvelopeIntro({ onFinish }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Ocultar después de la animación (3 seg)
    const timer = setTimeout(() => {
      setShow(false);
      // Callback después de la animación para mostrar el resto
      if (onFinish) setTimeout(onFinish, 500);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/75 z-[9999] flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7 } }}
          style={{transition: 'opacity .7s'}}
        >
          {/* Sobre de navidad animado */}
          <motion.div
            className="relative w-[340px] h-[230px] flex flex-col items-center justify-center drop-shadow-2xl"
            initial={{ scale: 0.94, y: 50, opacity: 0.4 }}
            animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", stiffness: 250, damping: 22, duration: 1.3 } }}
            exit={{ scale: 0.92, y: -180, opacity: 0, transition: { duration: 0.4, ease: "backIn" } }}
          >
            {/* Fondo del sobre */}
            <div className="absolute left-0 top-0 w-full h-full bg-[#f4e7cf] border-4 border-[#b58d5b] rounded-b-2xl rounded-t-lg" style={{ zIndex: 1 }} />
            {/* Tapa del sobre (animada) */}
            <motion.div
              className="absolute left-0 top-0 w-full h-[92px] origin-bottom rounded-t-2xl"
              style={{ background: 'linear-gradient(180deg, #d27842 55%, #fff8ee 100%)', zIndex: 3, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomLeftRadius: 44, borderBottomRightRadius: 44, borderBottom: '3px solid #ce8050' }}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: 80 }}
              transition={{ delay: 0.9, duration: 1.07, type: 'spring', stiffness: 123, damping: 17 }}
            />
            {/* Tarjeta navideña */}
            <motion.div
              className="absolute top-7 left-[16px] w-[308px] h-[140px] rounded-lg bg-[#fff4d6] border-2 border-[#b58d5b] flex flex-col items-center justify-center shadow-lg"
              initial={{ y: 60, opacity: 0, scale: 0.86 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 1.65, type: 'spring', stiffness: 220, damping: 17 }}
              style={{ zIndex: 7 }}
            >
              <div className="text-[#b67227] text-lg font-script mb-1 mt-3">¡Feliz Navidad!</div>
              <div className="text-[#95511c] font-semibold text-base text-center px-2">Abre los regalos y encuentra<br />magia y cariño en cada uno.</div>
              <div className="mt-2 text-xs text-[#915612]">🎁✨ Con mucho aprecio ✨🎁</div>
            </motion.div>
            {/* Lazo decorativo */}
            <motion.div
              className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-row items-center gap-1" 
              style={{zIndex:12}}
              initial={{ opacity: 0, scale: 0.73 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.13, duration: 0.44, ease: 'backOut' }}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#e1aa75] to-[#faf6f0] border border-[#b58d5b] shadow-md flex items-center justify-center text-lg">🎀</div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

