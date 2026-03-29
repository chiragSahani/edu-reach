import { aboutContent, images } from "../../data/content";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";

export default function AboutSection() {
  return (
    <SectionWrapper id="about" className="bg-white">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left - Images */}
        <div className="relative">
          <img
            src={images.collegeClassroom}
            alt="Classroom"
            className="rounded-xl shadow-lg w-full h-80 object-cover"
          />
          <img
            src={images.tech1}
            alt="Technology"
            className="absolute -bottom-6 -right-6 w-40 h-40 object-cover rounded-lg shadow-xl border-4 border-white hidden md:block"
          />
        </div>

        {/* Right - Content */}
        <div>
          <SectionHeader subtitle={aboutContent.subtitle} title={aboutContent.title} centered={false} />
          <p className="text-gray-600 leading-relaxed mb-8 -mt-6">
            {aboutContent.description}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {aboutContent.highlights.map((item) => (
              <div
                key={item.label}
                className="bg-cream rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-300"
              >
                <p className="text-2xl font-bold text-maroon">{item.value}</p>
                <p className="text-sm text-gray-600 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
