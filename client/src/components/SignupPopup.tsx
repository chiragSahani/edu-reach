import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import Modal from "./ui/Modal";

interface SignupPopupProps {
  show: boolean;
  onClose: () => void;
}

export default function SignupPopup({ show, onClose }: SignupPopupProps) {
  return (
    <Modal open={show} onClose={onClose}>
      <div className="p-8 text-center">
        <div className="w-14 h-14 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-7 h-7 text-maroon" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">Unlock Full Access</h3>
        <p className="text-gray-500 text-sm mb-6">
          Sign up to explore our mentors, campus life, placements, and get AI-powered counseling.
        </p>
        <Link
          to="/signup"
          onClick={onClose}
          className="block w-full bg-maroon text-white py-3 rounded-lg font-semibold hover:bg-maroon-dark transition-colors duration-200 mb-3"
        >
          Create Free Account
        </Link>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" onClick={onClose} className="text-maroon font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </Modal>
  );
}
