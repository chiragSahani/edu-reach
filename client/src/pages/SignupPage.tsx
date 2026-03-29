import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, User, Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { registerUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { images } from "../data/content";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in required fields");
      return;
    }
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (phone && !/^\+?[\d\s-]{10,15}$/.test(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({ name, email, password, phone: phone || undefined });
      login(data.token);
      toast.success("Account created! Welcome to EduReach.");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream dark:bg-gray-900"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-maroon transition-colors duration-200 mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>

          <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Join EduReach for unlimited access to AI chat &amp; counseling calls</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name *"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              icon={<User className="w-4 h-4" />}
              aria-required="true"
            />
            <Input
              label="Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              aria-required="true"
            />
            <Input
              label="Password *"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              icon={<Lock className="w-4 h-4" />}
              aria-required="true"
            />
            <Input
              label="Phone (optional)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91-9876543210"
              icon={<Phone className="w-4 h-4" />}
            />
            <Button type="submit" fullWidth loading={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-maroon font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Right - Campus image (hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src={images.moreStudents} alt="Students" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-maroon/60 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <GraduationCap className="w-16 h-16 mx-auto mb-4" />
            <h2 className="font-heading text-4xl font-bold mb-2">Join EduReach</h2>
            <p className="text-white/80">92% placement rate &middot; Top recruiters &middot; 25-acre campus</p>
          </div>
        </div>
      </div>
    </div>
  );
}
