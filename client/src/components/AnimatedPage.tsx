import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedPageProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition: HTMLMotionProps<"div">["transition"] = {
  type: 'spring',
  damping: 20,
  stiffness: 100,
};

const AnimatedPage = ({ children }: AnimatedPageProps) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
