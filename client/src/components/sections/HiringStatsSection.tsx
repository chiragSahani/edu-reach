import { topRecruiters, deptPlacements, images } from "../../data/content";
import { TrendingUp } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function AnimatedBar({ pct }: { pct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="w-full bg-gray-100 rounded-full h-3">
      <motion.div
        className="bg-maroon h-3 rounded-full"
        initial={{ width: 0 }}
        animate={isInView ? { width: `${pct}%` } : { width: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

export default function HiringStatsSection() {
  return (
    <SectionWrapper id="placements" className="bg-cream">
      <SectionHeader subtitle="Where Our Students Go" title="Placement Highlights 2023-24" />

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <img src={images.tech4} alt="Tech" className="w-10 h-10 rounded-lg object-cover" />
            <h3 className="font-heading text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-maroon" />
              Average Package by Department
            </h3>
          </div>
          <div className="space-y-4">
            {deptPlacements.map((item) => (
              <div key={item.dept}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{item.dept}</span>
                  <span className="text-maroon font-semibold">{item.avg}</span>
                </div>
                <AnimatedBar pct={item.pct} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <img src={images.recruter1} alt="Fest" className="rounded-lg h-28 w-full object-cover" loading="lazy" />
            <img src={images.recruter2} alt="Event" className="rounded-lg h-28 w-full object-cover" loading="lazy" />
            <img src={images.moreStudents} alt="Students" className="rounded-lg h-28 w-full object-cover" loading="lazy" />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-heading text-lg font-semibold text-gray-800 mb-4">
              Top Recruiters
            </h3>
            <div className="flex flex-wrap gap-2">
              {topRecruiters.map((company) => (
                <span
                  key={company}
                  className="px-3 py-1.5 bg-cream text-gray-700 rounded-full text-sm border border-gray-200 hover:border-maroon hover:text-maroon transition-colors duration-200"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
