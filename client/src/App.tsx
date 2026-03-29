import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import FloatingChatButton from "./components/FloatingChatButton";
import ErrorBoundary from "./components/ErrorBoundary";
import SkipNavLink from "./components/ui/SkipNavLink";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import type { ReactNode } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function WithNavbar({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-900">
      <div className="w-8 h-8 border-4 border-maroon border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SkipNavLink />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<WithNavbar><HomePage /></WithNavbar>} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><WithNavbar><DashboardPage /></WithNavbar></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <FloatingChatButton />
    </ErrorBoundary>
  );
}
