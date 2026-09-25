import { motion } from 'framer-motion';
import { ExamType, EXAM_TYPES } from '@/types';

interface ExamTypeSelectorProps {
  selected: ExamType;
  onChange: (type: ExamType) => void;
}

export const ExamTypeSelector = ({ selected, onChange }: ExamTypeSelectorProps) => {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="flex gap-2 p-1 min-w-max">
        {EXAM_TYPES.map((exam, index) => (
          <motion.button
            key={exam.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onChange(exam.id)}
            className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              selected === exam.id
                ? 'text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {selected === exam.id && (
              <motion.div
                layoutId="activeExam"
                className="absolute inset-0 btn-primary-gradient rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex flex-col items-center gap-0.5">
              <span>{exam.name}</span>
              <span className="text-xs opacity-80">{exam.marks} Marks</span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
