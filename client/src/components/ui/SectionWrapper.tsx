import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: ReactNode;
  narrow?: boolean;
}

export default function SectionWrapper({ id, className = "bg-white", children, narrow }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      className={`py-20 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className={`${narrow ? "max-w-3xl" : "max-w-7xl"} mx-auto px-4 sm:px-6 lg:px-8`}>
        {children}
      </div>
    </motion.section>
  );
}
