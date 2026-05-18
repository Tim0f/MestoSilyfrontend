import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  id: string;
  name: string;
  description: string;
  direction: 1 | -1;
}

const variants = {
  enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, y: 0 },
  exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -40 : 40 }),
};

export default function AnimatedSectionContent({
  id,
  name,
  description,
  direction,
}: Props) {
  return (
    <AnimatePresence custom={direction} mode="popLayout">
      <motion.div
        key={id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <h2 className="text-3xl text-customwhite font-black mb-3 uppercase tracking-wide">
          {name}
        </h2>

        <p className="text-customwhite mb-5 leading-relaxed max-w-md">
          {description}
        </p>

        <button className="mt-6 px-10 py-3 bg-customyellow text-[#2b2422] rounded-lg font-h2 hover:bg-[#eab97c] transition">
          записаться
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
