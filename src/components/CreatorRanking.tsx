import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// define props types
type CreatorRankingProps = {
  rankNumber: string;
  name: string;
  videoCount: number;
};

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

const CreatorRanking = ({
  rankNumber,
  name,
  videoCount,
}: CreatorRankingProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useParallax(scrollYProgress, 300);
  return (
    <div
      className="flex flex-col w-full justify-center min-h-screen items-start
     font-bold text-6xl md:text-8xl text-white pb-10 space-y-2 relative snap-center max-w-7xl"
    >
      <h2 className="text-red-600">{name}</h2>
      <h2 className="text-6xl">{videoCount} Videos</h2>
      <motion.div
        ref={ref}
        style={{
          y,
        }}
        className="absolute sm:left-[calc(50%+130px)] left-[calc(50%+50px)] text-red-400"
      >
        <h2>{rankNumber}</h2>
      </motion.div>
    </div>
  );
};

export default CreatorRanking;
