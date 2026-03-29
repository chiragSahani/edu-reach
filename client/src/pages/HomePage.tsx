import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import AchievementsSection from "../components/sections/AchievementsSection";
import CoursesSection from "../components/sections/CoursesSection";
import QuotesSection from "../components/sections/QuotesSection";
import MentorsSection from "../components/sections/MentorsSection";
import StudentLifeSection from "../components/sections/StudentLifeSection";
import EventsGallery from "../components/sections/EventsGallery";
import CounselorCTA from "../components/sections/CounselorCTA";
import HiringStatsSection from "../components/sections/HiringStatsSection";
import Footer from "../components/Footer";
import SignupPopup from "../components/SignupPopup";
import CallPopup from "../components/CallPopup";
import Button from "../components/ui/Button";

export default function HomePage() {
  const { user } = useAuth();
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);

  const handleReachMentors = () => {
    if (!user && !sessionStorage.getItem("popupShown")) {
      setShowSignupPopup(true);
      sessionStorage.setItem("popupShown", "true");
    }
  };

  return (
    <main id="main-content">
      {/* Always visible sections */}
      <HeroSection />
      <AboutSection />
      <AchievementsSection />
      <CoursesSection />
      <QuotesSection />

      {/* Mentors section — visible to all, triggers popup for non-logged */}
      <MentorsSection onReachMentors={handleReachMentors} />

      {/* Everything below Mentors is ONLY visible to logged-in users */}
      {user ? (
        <>
          <StudentLifeSection />
          <EventsGallery />
          <CounselorCTA onOpenCall={() => setShowCallPopup(true)} />
          <HiringStatsSection />
          <Footer />
        </>
      ) : (
        <>
          <motion.section
            className="py-20 bg-cream text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-2xl mx-auto px-4">
              <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
                Want to See More?
              </h2>
              <p className="text-gray-500 mb-8">
                Sign up to explore campus life, events, placement statistics, and talk to our AI counselor.
              </p>
              <Button onClick={() => setShowSignupPopup(true)} size="lg">
                Sign Up to Unlock
              </Button>
            </div>
          </motion.section>
          <Footer />
        </>
      )}

      {/* Popups */}
      <SignupPopup show={showSignupPopup} onClose={() => setShowSignupPopup(false)} />
      <CallPopup open={showCallPopup} onClose={() => setShowCallPopup(false)} />
    </main>
  );
}
