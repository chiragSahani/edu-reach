import { campusFeatures } from "../../data/content";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";

export default function StudentLifeSection() {
  return (
    <SectionWrapper id="campus" className="bg-white">
      <SectionHeader subtitle="Beyond the Classroom" title="Campus & Student Life" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {campusFeatures.map((feature) => (
          <div key={feature.title} className="group relative rounded-xl overflow-hidden h-64 cursor-pointer">
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
              <div className="w-full p-4">
                <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
                <p className="text-white/90 text-sm mt-1 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500">
                  {feature.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
