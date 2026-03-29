import { useState, useEffect, useCallback } from "react";
import { quotesContent } from "../../data/content";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuotesSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const prev = () => goTo((current - 1 + quotesContent.length) % quotesContent.length);
  const next = useCallback(() => goTo((current + 1) % quotesContent.length), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused]);

  return (
    <section
      className="py-16 bg-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-3xl mx-auto px-4 text-center">
        <Quote className="w-10 h-10 text-maroon/30 mx-auto mb-6" />

        <div className="relative min-h-[120px] flex items-center justify-center" aria-live="polite">
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-maroon transition-colors duration-200"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="px-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-heading text-2xl md:text-3xl text-gray-800 italic leading-relaxed mb-4">
                &ldquo;{quotesContent[current].text}&rdquo;
              </p>
              <p className="text-maroon font-semibold">&mdash; {quotesContent[current].author}</p>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-maroon transition-colors duration-200"
            aria-label="Next quote"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {quotesContent.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current ? "bg-maroon w-6" : "bg-gray-300"
              }`}
              aria-label={`Go to quote ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
