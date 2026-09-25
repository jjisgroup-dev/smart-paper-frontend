import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ClassLevel } from '@/types';

interface ClassCardProps {
  classLevel: ClassLevel;
  onClick: () => void;
  index: number;
}

const classInfo: Record<ClassLevel, { label: string; description: string; emoji: string }> = {
  'LKG': { label: 'LKG', description: 'Lower Kindergarten', emoji: '🌸' },
  'UKG': { label: 'UKG', description: 'Upper Kindergarten', emoji: '🌻' },
  '1': { label: 'Class 1', description: 'First Standard', emoji: '📚' },
  '2': { label: 'Class 2', description: 'Second Standard', emoji: '✏️' },
  '3': { label: 'Class 3', description: 'Third Standard', emoji: '🎨' },
  '4': { label: 'Class 4', description: 'Fourth Standard', emoji: '🔬' },
  '5': { label: 'Class 5', description: 'Fifth Standard', emoji: '🌍' },
  '6': { label: 'Class 6', description: 'Sixth Standard', emoji: '📐' },
  '7': { label: 'Class 7', description: 'Seventh Standard', emoji: '🧪' },
  '8': { label: 'Class 8', description: 'Eighth Standard', emoji: '🔭' },
  '9': { label: 'Class 9', description: 'Ninth Standard', emoji: '📊' },
  '10': { label: 'Class 10', description: 'Tenth Standard', emoji: '🎓' },
};

export const ClassCard = ({ classLevel, onClick, index }: ClassCardProps) => {
  const info = classInfo[classLevel];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className="w-full bg-card rounded-xl p-4 shadow-card card-hover border border-border/50 flex items-center gap-4 text-left"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
        {info.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground">{info.label}</h3>
        <p className="text-sm text-muted-foreground truncate">{info.description}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </motion.button>
  );
};
