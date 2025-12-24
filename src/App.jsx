import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { giftsConfig } from "./giftsConfig";
import AnimatedHeader from "./components/AnimatedHeader";
import Snowflakes from "./components/Snowflakes";
import GiftCard from "./components/GiftCard";
import GarlandSwingDecor from "./components/GarlandSwingDecor";
import ChristmasLightsBorder from "./components/ChristmasLightsBorder";
import ChristmasEnvelopeIntro from "./components/ChristmasEnvelopeIntro";

function GiftGridView({ onGiftSelect }) {
  return (
    <motion.section
      className="relative grid grid-cols-2 sm:grid-cols-3 gap-7 md:gap-12 px-6 sm:px-16 pt-7 pb-14 z-10"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.87 }}
      transition={{ type: 'spring', duration: 0.15, bounce: 0.7, stiffness: 1100, damping: 14, mass: 0.38, velocity: 2.2 }}
    >
      {giftsConfig.map((regalo, idx) => (
        <GiftCard key={regalo.id} regalo={regalo} onClick={onGiftSelect} customDelay={0.06 * idx} />
      ))}
      {/* Decoraciones de esquinas swing */}
      <GarlandSwingDecor className="-top-5 -left-9"><span role="img" aria-label="Guirnalda">🌲</span></GarlandSwingDecor>
      <GarlandSwingDecor className="-top-8 -right-8"><span role="img" aria-label="Esfera">🔴</span></GarlandSwingDecor>
      <GarlandSwingDecor className="-bottom-10 left-2"><span role="img" aria-label="Guirnalda">🟢</span></GarlandSwingDecor>
      <GarlandSwingDecor className="-bottom-9 right-7"><span role="img" aria-label="Esfera">🟠</span></GarlandSwingDecor>
    </motion.section>
  );
}

function GiftContentModal({ selectedGift, onBack }) {
  // Mejora visual: modal más sutil y responsive, media con aspect-ratio y anchuras responsivas
  // Detectamos si el contenido es video para ajustar el contenedor y evitar efectos pesados que provoquen lag
  const isVideo = selectedGift?.tipo === 'video';
  const containerClass = isVideo
    ? 'relative flex flex-col items-center justify-center gap-3 bg-black/80 rounded-xl px-4 py-4 sm:px-6 sm:py-6 w-[92vw] sm:w-[80vw] max-w-[920px] max-h-[88vh] overflow-hidden z-50'
    : 'relative flex flex-col items-center justify-center gap-4 bg-[#07110d]/70 backdrop-blur-sm rounded-2xl px-6 py-6 sm:px-8 sm:py-8 max-w-[95vw] sm:max-w-[720px] md:max-w-[920px] lg:max-w-[1100px] w-[90vw] max-h-[90vh] shadow-xl drop-shadow-2xl ring-1 ring-yellow-600/20 overflow-hidden z-50';

  // Reducimos la altura máxima y limitamos el ancho del reproductor para evitar escalado excesivo
  // Usamos object-contain para evitar que el video se estire y max-height menor para que no quede "lag" visual
  const mediaSizeClass = 'w-full max-w-[900px] sm:max-w-[720px] md:max-w-[920px] lg:max-w-[1100px] aspect-video max-h-[60vh]';

  // Poster para video: si la ruta tiene '/public' la corregimos a la ruta en public root
  const posterSrc = selectedGift?.url ? selectedGift.url.replace(/^\/public/, '') : '/regalo.png';

  // Puede renderizar image, video o lo que se asigne a media
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 rounded-3xl overflow-y-auto p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 800, damping: 24 }}
    >
      <ChristmasLightsBorder />
      <div className={containerClass}>
         {selectedGift.tipo === 'image' ? (
           <img
            src={selectedGift.media}
            alt={`Contenido de regalo ${selectedGift.id}`}
            className={`rounded-xl w-full ${mediaSizeClass} object-cover drop-shadow-md animate-fadeIn`}
           />
         ) : selectedGift.tipo === 'video' ? (
           <div className="w-full flex items-center justify-center">
             {selectedGift.media && selectedGift.media.endsWith('.mp4') ? (
               <video
                 src={selectedGift.media}
                 poster={posterSrc}
                 autoPlay
                 muted
                 controls
                 playsInline
                 preload="metadata"
                 loop
                 className={`rounded-xl w-full ${mediaSizeClass} bg-black shadow-sm object-contain`}
                 // Forzamos capas compuestas para mejor rendimiento en GPU
                 style={{ willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
               />
             ) : (
               <iframe
                 src={selectedGift.media}
                 title={`Video YouTube Regalo ${selectedGift.id}`}
                 allow="autoplay; encrypted-media; picture-in-picture"
                 allowFullScreen
                 loading="lazy"
                 className={`rounded-xl w-full ${mediaSizeClass} bg-black shadow-sm object-contain`}
                 style={{ border: 0 }}
               />
             )}
           </div>
         ) : null}
         {/* Botón de volver */}
         <motion.button
           className="mt-3 px-3 py-1.5 bg-gradient-to-br from-bosque to-borgo rounded-full shadow-lg text-sm font-script text-white select-none active:scale-90 focus:outline-gold-glow/70 focus:outline-2 focus:outline-offset-4"
           whileHover={{ scale: 1.06, rotate: 2 }}
           whileTap={{ scale: 0.97, rotate: -3 }}
           transition={{ type:'spring', stiffness: 380, damping: 18 }}
           onClick={onBack}
         >
           Volver
         </motion.button>
       </div>
     </motion.div>
   );
}

export default function App() {
  const [selectedGiftId, setSelectedGiftId] = useState(null);
  const [introDone, setIntroDone] = useState(false);
  const selectedGift = selectedGiftId
    ? giftsConfig.find((g) => g.id === selectedGiftId)
    : null;

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_60%_0%,#013220_70%,#800020_100%)]">
      <Snowflakes />
      {!introDone && (
        <ChristmasEnvelopeIntro onFinish={() => setIntroDone(true)} />
      )}
      {introDone && (
        <>
          <AnimatedHeader />
          <AnimatePresence mode="wait" initial={false}>
            {selectedGift ? (
              <GiftContentModal
                key="modal-content"
                selectedGift={selectedGift}
                onBack={() => setSelectedGiftId(null)}
              />
            ) : (
              <GiftGridView
                key="gift-grid"
                onGiftSelect={setSelectedGiftId}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </main>
  );
}
