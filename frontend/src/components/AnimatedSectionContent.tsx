import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  id: string;
  name: string;
  description: string;
  price: number;
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
  price,
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
        <h2 className="text-h2 text-customwhite font-customblack mb-3 uppercase tracking-wide">
          {name}
        </h2>

        <p className="text-customwhite mb-5 leading-relaxed max-w-md">
          {description}
        </p>

        <p className="text-2xl font-h2 text-customyellow mb-6">
          {price.toLocaleString()} ₽
        </p>
        <button className="mt-6 px-10 py-3 bg-customyellow text-customgrey rounded-lg font-h2 hover:bg-customyellow transition">
          записаться
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
