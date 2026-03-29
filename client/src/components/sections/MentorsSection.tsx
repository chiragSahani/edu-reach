import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import { mentorsContent } from "../../data/content";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import { useEffect } from "react";

interface MentorsSectionProps {
  onReachMentors?: () => void;
}

export default function MentorsSection({ onReachMentors }: MentorsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  const triggered = useRef(false);

  useEffect(() => {
    if (isInView && !triggered.current && onReachMentors) {
      triggered.current = true;
      onReachMentors();
    }
  }, [isInView, onReachMentors]);

  return (
    <div ref={sectionRef}>
      <SectionWrapper id="mentors" className="bg-cream">
        <SectionHeader subtitle="Learn from the Best" title="Popular Mentors" />

        <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
          {mentorsContent.map((mentor, i) => (
            <motion.div
              key={mentor.name}
              className="min-w-[260px] md:min-w-0 bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <img src={mentor.image} alt={mentor.name} className="w-full h-56 object-cover" />
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold text-gray-900">{mentor.name}</h3>
                <p className="text-maroon text-sm font-medium mb-2">{mentor.role}</p>
                <p className="text-gray-500 text-sm mb-2">{mentor.bio}</p>
                <p className="text-xs text-gray-400">Teaches: {mentor.teaches}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
}
