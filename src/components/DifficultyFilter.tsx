import { motion } from 'framer-motion';
import { Difficulty, DIFFICULTY_CONFIG } from '@/types';

interface DifficultyFilterProps {
  selected: Difficulty | 'all';
  onChange: (difficulty: Difficulty | 'all') => void;
}

export const DifficultyFilter = ({ selected, onChange }: DifficultyFilterProps) => {
  const options: (Difficulty | 'all')[] = ['all', 'easy', 'medium', 'hard'];

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => {
        const isAll = option === 'all';
        const config = isAll ? null : DIFFICULTY_CONFIG[option];
        
        return (
          <motion.button
            key={option}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(option)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
              selected === option
                ? isAll
                  ? 'bg-primary text-primary-foreground border-primary'
                  : config?.color
                : 'bg-card text-muted-foreground border-border hover:border-primary/50'
            }`}
          >
            {isAll ? 'All Levels' : config?.label}
          </motion.button>
        );
      })}
    </div>
  );
};
