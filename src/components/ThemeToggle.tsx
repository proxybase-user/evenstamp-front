'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useEffect, useState } from 'react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={`button-icon-circular shrink-0 text-ink ${className}`}
        aria-label="Toggle theme"
      >
        <span className="h-4 w-4 opacity-0" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`button-icon-circular shrink-0 text-ink transition-transform hover:scale-105 active:scale-95 ${className}`}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-accent-yellow" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4 text-ink" aria-hidden="true" />
      )}
    </button>
  );
}

