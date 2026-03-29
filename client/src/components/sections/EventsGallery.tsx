import { eventsGallery } from "../../data/content";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";

export default function EventsGallery() {
  return (
    <SectionWrapper className="bg-white">
      <SectionHeader subtitle="Life at EduReach" title="Events & Highlights" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {eventsGallery.map((item) => (
          <div key={item.title} className="group relative overflow-hidden rounded-lg aspect-square">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end">
              <p className="text-white text-sm font-medium p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
