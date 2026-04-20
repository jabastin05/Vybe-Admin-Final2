import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-[20px] border border-black/5 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 transition-all"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ 
          scale: theme === 'light' ? 1 : 0,
          opacity: theme === 'light' ? 1 : 0,
          rotate: theme === 'light' ? 0 : 180
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Sun className="w-4 h-4 text-black" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ 
          scale: theme === 'dark' ? 1 : 0,
          opacity: theme === 'dark' ? 1 : 0,
          rotate: theme === 'dark' ? 0 : -180
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon className="w-4 h-4 text-white" />
      </motion.div>
    </button>
  );
}