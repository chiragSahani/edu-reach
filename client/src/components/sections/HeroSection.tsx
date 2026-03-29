import { motion } from "framer-motion";
import { images, siteConfig } from "../../data/content";

export default function HeroSection() {
  return (
    <section id="hero" className="relative h-[85vh] min-h-[500px]" aria-label="Hero section">
      <img src={images.hero} alt="EduReach Campus" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-maroon/70" />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.p
            className="text-white/80 text-sm tracking-widest uppercase mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {siteConfig.established} &middot; Hyderabad, Telangana
          </motion.p>
          <motion.h1
            className="font-heading text-4xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Welcome to <br />
            <span className="text-amber-300">{siteConfig.name} College</span>
          </motion.h1>
          <motion.p
            className="text-white/90 text-lg md:text-xl max-w-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {siteConfig.tagline}. Premier engineering institution with 92% placement rate
            and partnerships with Google, Microsoft &amp; Amazon.
          </motion.p>
          <motion.a
            href="#courses"
            className="inline-block bg-white text-maroon px-6 py-3 rounded-lg font-semibold hover:bg-amber-300 hover:text-maroon-dark transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Explore Programs
          </motion.a>
        </div>
      </div>
    </section>
  );
}
