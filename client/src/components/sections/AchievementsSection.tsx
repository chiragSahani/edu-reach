import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { achievementsContent } from "../../data/content";

function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!isInView) return;
    // Extract numeric part for animation
    const match = value.match(/^([₹]?)(\d+)(.*)/);
    if (!match) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseInt(numStr, 10);
    const duration = 1500;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setDisplay(`${prefix}${current}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <p ref={ref} className="text-3xl md:text-4xl font-bold text-white font-heading">
      {display}
    </p>
  );
}

export default function AchievementsSection() {
  return (
    <motion.section
      className="bg-maroon py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {achievementsContent.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedValue value={stat.value} />
              <p className="text-white/80 mt-2 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
