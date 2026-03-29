import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl p-6 border border-gray-100 ${
        hover ? "hover:shadow-md transition-all duration-300" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
