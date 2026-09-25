import { motion } from 'framer-motion';
import { Question, DIFFICULTY_CONFIG } from '@/types';

interface QuestionCardProps {
  question: Question;
  index: number;
  showAnswer?: boolean;
}

export const QuestionCard = ({ question, index, showAnswer = false }: QuestionCardProps) => {
  const difficultyConfig = DIFFICULTY_CONFIG[question.difficulty];

  const getTypeLabel = (type: Question['type']) => {
    const labels: Record<Question['type'], string> = {
      'mcq': 'MCQ',
      'short': 'Short Answer',
      'long': 'Long Answer',
      'fill-blank': 'Fill in the Blank',
      'match': 'Match the Following',
      'true-false': 'True/False',
    };
    return labels[type];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-xl p-4 shadow-card border border-border/50"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-primary">Q{index + 1}.</span>
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${difficultyConfig.color}`}>
            {difficultyConfig.label}
          </span>
          <span className="px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground">
            {getTypeLabel(question.type)}
          </span>
        </div>
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          [{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]
        </span>
      </div>

      <p className="text-foreground leading-relaxed mb-3">{question.question}</p>

      {question.options && (
        <div className="space-y-2 mb-3">
          {question.options.map((option, optIndex) => (
            <div
              key={optIndex}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                showAnswer && option === question.answer
                  ? 'bg-success/10 border-success/30'
                  : 'bg-muted/30 border-transparent'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0">
                {String.fromCharCode(65 + optIndex)}
              </span>
              <span className="text-sm">{option}</span>
            </div>
          ))}
        </div>
      )}

      {showAnswer && question.answer && question.type !== 'mcq' && (
        <div className="mt-3 pt-3 border-t border-dashed border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-success">Answer: </span>
            {question.answer}
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-2">
        Chapter: {question.chapter}
      </p>
    </motion.div>
  );
};
