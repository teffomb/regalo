import { motion } from "framer-motion";

export default function AnimatedHeader() {
  return (
    <header className="py-10 sm:py-14 flex flex-col items-center select-none">
      <motion.h1
        className="text-4xl sm:text-6xl font-script text-white drop-shadow-lg"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
        aria-label="¡Bienvenido a tu Regalo de Navidad!"
      >
        {"¡Bienvenido a tu Regalo de Navidad!".split("").map((char, i) => (
          <motion.span
            key={char + i}
            variants={{
              hidden: { opacity: 0, y: 44 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 1500, damping: 9, mass: 0.39 } },
            }}
            style={{ display: char === " " ? "inline-block" : "inline" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>
      <motion.p
        className="mt-6 max-w-lg text-center text-lg sm:text-xl text-gold-glow/90"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
      >
        Abre los regalos y sorpréndete... Haz click en uno y descubre lo especial que tienes dentro. ¡Feliz Navidad!
      </motion.p>
    </header>
  );
}

