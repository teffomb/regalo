import React, { useState, useEffect, useRef } from "react";
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

  // Estados para manejo robusto de carga de video: reintentos y fallback
  const [videoSrc, setVideoSrc] = useState(selectedGift?.media || '');
  const [imageFallback, setImageFallback] = useState(false);
  const [tryIndex, setTryIndex] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const videoRef = useRef(null);
  const [resolveTrigger, setResolveTrigger] = useState(0);

  // Poster para video: si la ruta tiene '/public' la corregimos a la ruta en public root
  const posterSrc = selectedGift?.url ? selectedGift.url.replace(/^\/public/, '') : '/regalo.png';
  // Poster absoluto (usar origin en producción para evitar problemas de rutas relativas)
  const origin = typeof window !== 'undefined' && window.location ? window.location.origin : '';
  const posterAbs = posterSrc && origin ? `${origin}${posterSrc.startsWith('/') ? posterSrc : '/' + posterSrc}` : posterSrc;

  // Intentar abrir el video directo en nueva pestaña descargándolo como Blob (fallback)
  const openDirectVideo = async () => {
    const url = videoSrc || selectedGift?.media;
    if (!url) {
      window.open('https://www.google.com/search?q=' + encodeURIComponent(selectedGift?.media || ''), '_blank');
      return;
    }
    try {
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error('no se pudo obtener el recurso');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      // liberar después de un tiempo
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (e) {
      // Si falla, abrir búsqueda en Google
      window.open('https://www.google.com/search?q=' + encodeURIComponent(url), '_blank');
    }
  };

  // Resetear estado cuando cambia el regalo seleccionado
  useEffect(() => {
    const original = selectedGift?.media || '';
    // Si es el regalo 1 forzamos la URL absoluta a videoprincipal y salteamos las comprobaciones.
    try { console.debug('[video-resolve] selectedGift', selectedGift); } catch(e) {}
    if (selectedGift?.id === 1) {
      const originLocal = typeof window !== 'undefined' && window.location ? window.location.origin : '';
      const forced = originLocal ? `${originLocal}/videoprincipal.mp4` : '/videoprincipal.mp4';
      // Intentar comprobar el recurso primero con HEAD (con timeout) para detectar rewrites o bloqueos
      (async () => {
        try {
          const ctrl = new AbortController();
          const to = setTimeout(() => ctrl.abort(), 4000);
          const res = await fetch(forced, { method: 'HEAD', signal: ctrl.signal });
          clearTimeout(to);
          const ct = res.headers.get('content-type') || '';
          if (res.ok && ct.includes('video')) {
            setVideoSrc(forced);
            setTryIndex(0);
            setLoadFailed(false);
            setLoadingVideo(true);
            try { console.debug('[video-resolve] regalo 1 OK ->', forced, 'CT=', ct); } catch (e) {}
          } else {
            // Si no devuelve video o no ok, activamos fallback a imagen
            try { console.warn('[video-resolve] regalo 1 HEAD no ok or not video', forced, res.status, ct); } catch(e) {}
            setImageFallback(true);
            setLoadFailed(false);
            setLoadingVideo(false);
          }
        } catch (e) {
          try { console.warn('[video-resolve] regalo 1 HEAD failed', forced, e && e.name); } catch(e) {}
          setImageFallback(true);
          setLoadFailed(false);
          setLoadingVideo(false);
        }
      })();
      // Salimos de la flow principal para que no se ejecute la detección por defecto
      return () => {};
    }
    // Forzar asignación inmediata para evitar usar una ruta cacheada previa
    setVideoSrc(original);
    setLoadFailed(false);
    // Log para depuración: mostrar qué URL se usará para este regalo
    try { console.debug('[video-resolve] regalo', selectedGift?.id, '->', original); } catch(e) {}

    const alt1 = original.replace(/^\//, ''); // sin slash inicial
    const alt2 = './' + alt1; // con ./
    const alt3 = original.startsWith('/') ? original : '/' + original; // asegurando leading slash
    const candidates = Array.from(new Set([original, alt1, alt2, alt3]));

    let cancelled = false;
    const controller = new AbortController();

    async function findWorkingUrl() {
      if (!original) {
        setVideoSrc('');
        setTryIndex(0);
        setLoadFailed(false);
        setLoadingVideo(false);
        return;
      }
      setTryIndex(0);
      setLoadFailed(false);
      setLoadingVideo(true);

      // En lugar de HEAD/Range (que puede fallar en plataformas como Vercel por rewrites),
      // creamos un elemento <video> temporal y esperamos a 'loadedmetadata' / 'canplaythrough'.
      // Esto deja que el navegador determine si la URL sirve media real.
      const origin = typeof window !== 'undefined' && window.location ? window.location.origin : '';
      // Construir lista de intentos priorizando rutas absolutas con origin (importante en Vercel)
      const expanded = [];
      for (const c of candidates) {
        if (origin && !c.startsWith('http')) {
          // Priorizar la variante con origin (https://mi-app/...)
          expanded.push(`${origin}/${c.replace(/^\//, '')}`);
          expanded.push(`${origin}${c}`);
        }
        // mantener también la variante relativa
        expanded.push(c);
        if (c.startsWith('http')) expanded.push(c);
      }
      const tryList = Array.from(new Set(expanded));

      const tryLoadWithVideoElement = (url, timeoutMs = 4000) => new Promise((resolve) => {
        let settled = false;
        const temp = document.createElement('video');
        temp.preload = 'metadata';
        temp.muted = true;
        temp.playsInline = true;
        temp.src = url;
        // Si carga metadata o puede reproducir, consideramos la URL válida
        const onSuccess = () => {
          if (settled) return;
          settled = true;
          cleanup();
          resolve(true);
        };
        const onError = () => {
          if (settled) return;
          settled = true;
          cleanup();
          resolve(false);
        };
        const cleanup = () => {
          temp.removeEventListener('loadedmetadata', onSuccess);
          temp.removeEventListener('canplaythrough', onSuccess);
          temp.removeEventListener('error', onError);
          try { temp.src = ''; } catch (e) {}
          try { clearTimeout(timer); } catch (e) {}
        };
        temp.addEventListener('loadedmetadata', onSuccess);
        temp.addEventListener('canplaythrough', onSuccess);
        temp.addEventListener('error', onError);
        // timeout
        const timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          cleanup();
          resolve(false);
        }, timeoutMs);
      });

      for (let i = 0; i < tryList.length && !cancelled; i++) {
        const url = tryList[i];
        try {
          // Intentamos cargar con el elemento de video temporal
          const ok = await tryLoadWithVideoElement(url, 3500);
          if (ok) {
            setVideoSrc(url);
            setTryIndex(i);
            setLoadFailed(false);
            setLoadingVideo(false);
            return;
          }
        } catch (e) {
          // continuar
        }
      }

      // si no encontramos ninguna ruta válida, marcamos fallo para mostrar fallback
      if (!cancelled) {
        setVideoSrc(original);
        setTryIndex(candidates.length - 1);
        setLoadFailed(true);
        setLoadingVideo(false);
      }
    }

    findWorkingUrl();

    // Timeout de seguridad: si tras X ms no hay resultado, mostrar fallback
    const timeoutId = setTimeout(() => {
      if (!cancelled && !videoRef.current) {
        setLoadingVideo(false);
      }
    }, 10000);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [selectedGift, resolveTrigger]);

  // Forzar recarga del elemento <video> cuando cambia videoSrc
  useEffect(() => {
    if (!videoRef.current) return;
    try {
      // Llamamos load para que el elemento reprocesa el <source>
      videoRef.current.load();
      // Intentamos play (silenciado) para forzar buffering en navegadores que lo permiten
      const playPromise = videoRef.current.play && videoRef.current.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => { /* autoplay puede fallar si no está permitido */ });
      }
      setLoadingVideo(true);
    } catch (e) {
      // ignorar
    }
  }, [videoSrc]);

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
               loadFailed ? (
                 <div className="w-full flex flex-col items-center justify-center p-6 text-center">
                   <p className="text-white mb-3">No se pudo cargar el video.</p>
                   <div className="flex gap-3">
                     <button
                       className="px-3 py-1 rounded bg-amber-600 text-white"
                       onClick={() => {
                         // Intentar recargar manualmente: forzar re-resolve de la URL en producción
                         setLoadFailed(false);
                         setTryIndex(0);
                         setVideoSrc('');
                         setResolveTrigger((s) => s + 1);
                       }}
                     >Reintentar</button>
                    <a
                      className="px-3 py-1 rounded bg-slate-700 text-white"
                      href={videoSrc || selectedGift.media}
                      target="_blank"
                      rel="noreferrer"
                    >Abrir en nueva pestaña</a>
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white"
                      onClick={openDirectVideo}
                    >Ver directo</button>
                    <a
                      className="px-3 py-1 rounded bg-indigo-600 text-white"
                      href={`https://www.google.com/search?tbm=vid&q=${encodeURIComponent(videoSrc || selectedGift.media || '')}`}
                      target="_blank"
                      rel="noreferrer"
                    >Ver en Google</a>
                   </div>
                 </div>
               ) : (
               <div className="relative w-full">
                 {loadingVideo && (
                   <div className="absolute inset-0 flex items-center justify-center z-20">
                     <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                   </div>
                 )}
                 <video
                   ref={videoRef}
                   poster={posterAbs}
                   autoPlay
                   muted
                   controls
                   playsInline
                   preload="metadata"
                   loop
                   className={`rounded-xl w-full ${mediaSizeClass} bg-black shadow-sm object-contain`}
                   // Forzamos capas compuestas para mejor rendimiento en GPU
                   style={{ willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                   onLoadedData={() => {
                     setLoadingVideo(false);
                     setLoadFailed(false);
                   }}
                   onCanPlayThrough={() => {
                     setLoadingVideo(false);
                     setLoadFailed(false);
                   }}
                   onError={() => {
                     // Si falla en la carga, para el regalo 1 mostramos la imagen en lugar del video.
                     if (selectedGift?.id === 1) {
                       setImageFallback(true);
                       setLoadFailed(false);
                       setLoadingVideo(false);
                       return;
                     }
                     // Generar alternativas de ruta y reintentar para los demás
                     const original = selectedGift?.media || '';
                     const alt1 = original.replace(/^\//, ''); // sin slash inicial
                     const alt2 = './' + alt1; // con ./
                     const alt3 = original.startsWith('/') ? original : '/' + original; // asegurando leading slash
                     const candidates = Array.from(new Set([original, alt1, alt2, alt3]));
                     const nextIndex = tryIndex + 1;
                     if (nextIndex < candidates.length) {
                       setTryIndex(nextIndex);
                       setVideoSrc(candidates[nextIndex]);
                     } else {
                       console.warn('Video load failed for', original, 'candidates:', candidates);
                       setLoadFailed(true);
                       setLoadingVideo(false);
                     }
                   }}
                 >
                   {/* Usar <source> para mayor compatibilidad y para que cambiar src reprocese la carga */}
                   <source src={videoSrc} type="video/mp4" />
                   Tu navegador no soporta video HTML5.
                 </video>
               </div>
               ) : (
               <div className="w-full flex flex-col items-center justify-center p-6 text-center">
                 <p className="text-white mb-3">No se pudo cargar el video.</p>
                 <div className="flex gap-3">
                   <button
                     className="px-3 py-1 rounded bg-amber-600 text-white"
                     onClick={() => {
                       // Intentar recargar manualmente: forzar re-resolve de la URL en producción
                       setLoadFailed(false);
                       setTryIndex(0);
                       setVideoSrc('');
                       setResolveTrigger((s) => s + 1);
                     }}
                   >Reintentar</button>
                  <a
                    className="px-3 py-1 rounded bg-slate-700 text-white"
                    href={videoSrc || selectedGift.media}
                    target="_blank"
                    rel="noreferrer"
                  >Abrir en nueva pestaña</a>
                  <button
                    className="px-3 py-1 rounded bg-blue-600 text-white"
                    onClick={openDirectVideo}
                  >Ver directo</button>
                  <a
                    className="px-3 py-1 rounded bg-indigo-600 text-white"
                    href={`https://www.google.com/search?tbm=vid&q=${encodeURIComponent(videoSrc || selectedGift.media || '')}`}
                    target="_blank"
                    rel="noreferrer"
                  >Ver en Google</a>
                 </div>
               </div>
               )
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
+        {imageFallback && (
+          <div className="w-full flex items-center justify-center">
+            <img src={posterAbs || '/regalo.png'} alt={`Contenido del regalo ${selectedGift?.id}`} className={`rounded-xl w-full ${mediaSizeClass} object-contain`} />
+          </div>
+        )}
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
