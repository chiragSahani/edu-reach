import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const themes = [
  { value: "light" as const, icon: Sun, label: "Light mode" },
  { value: "dark" as const, icon: Moon, label: "Dark mode" },
  { value: "system" as const, icon: Monitor, label: "System theme" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    const currentIndex = themes.findIndex((t) => t.value === theme);
    const next = themes[(currentIndex + 1) % themes.length]!;
    setTheme(next.value);
  };

  const current = themes.find((t) => t.value === theme) || themes[0]!;
  const Icon = current.icon;

  return (
    <button
      onClick={cycle}
      className="p-2 text-gray-500 dark:text-gray-400 hover:text-maroon dark:hover:text-maroon-light rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      aria-label={current.label}
      title={current.label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
