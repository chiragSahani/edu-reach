import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-7xl font-bold text-maroon mb-4">404</h1>
        <h2 className="font-heading text-2xl font-semibold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button icon={<Home className="w-4 h-4" />}>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
