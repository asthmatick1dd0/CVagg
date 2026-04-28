// ThemeToggle.tsx
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initial = saved || 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="
        fixed bottom-6 right-6 z-50
        p-3 rounded-full
        bg-popover border border-border
        shadow-lg hover:shadow-xl
        hover:scale-110 active:scale-95
        transition-all duration-200 ease-out
        cursor-pointer
        group
      "
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-popover-foreground group-hover:text-primary transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-popover-foreground group-hover:text-primary transition-colors" />
      )}
    </button>
  );
}