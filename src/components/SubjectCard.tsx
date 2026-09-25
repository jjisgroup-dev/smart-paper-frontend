import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Laptop,
  Languages,
  Clock,
  Award,
  Layers,
  CheckCircle2,
  ChevronDown,
  BarChart2,
  FileText,
} from 'lucide-react';
import { ClassLevel, Subject } from '@/types';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getSubjectExamPattern } from '@/data/examPatterns';

interface SubjectCardProps {
  subject: Subject;
  classLevel?: ClassLevel;
  onClick: () => void;
  index: number;
}

const subjectConfig: Record<Subject, { icon: LucideIcon; color: string; bgColor: string; borderColor: string }> = {
  English: { icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-950/40', borderColor: 'border-blue-200 dark:border-blue-800' },
  Hindi: { icon: Languages, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-950/40', borderColor: 'border-orange-200 dark:border-orange-800' },
  Mathematics: { icon: Calculator, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-950/40', borderColor: 'border-purple-200 dark:border-purple-800' },
  Science: { icon: FlaskConical, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/40', borderColor: 'border-emerald-200 dark:border-emerald-800' },
  'Social Science': { icon: Globe, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/40', borderColor: 'border-amber-200 dark:border-amber-800' },
  EVS: { icon: Globe, color: 'text-teal-600 dark:text-teal-400', bgColor: 'bg-teal-50 dark:bg-teal-950/40', borderColor: 'border-teal-200 dark:border-teal-800' },
  'Computer Science': { icon: Laptop, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-50 dark:bg-indigo-950/40', borderColor: 'border-indigo-200 dark:border-indigo-800' },
  Sanskrit: { icon: Languages, color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-50 dark:bg-rose-950/40', borderColor: 'border-rose-200 dark:border-rose-800' },
};

export const SubjectCard = ({ subject, classLevel = '10', onClick, index }: SubjectCardProps) => {
  const config = subjectConfig[subject] || {
    icon: BookOpen,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
  };
  const Icon = config.icon;
  const pattern = getSubjectExamPattern(classLevel, subject);
  const [showPatternDetails, setShowPatternDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.28 }}
      whileHover={{
        y: -4,
        scale: 1.015,
        boxShadow: '0 12px 28px -10px rgba(0, 0, 0, 0.12)',
        transition: { type: 'spring', stiffness: 350, damping: 25 },
      }}
      whileTap={{ scale: 0.985 }}
      className="group relative w-full bg-card/95 hover:bg-card rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-lg border border-border/60 hover:border-primary/50 transition-all duration-300 text-left overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Smooth glowing gradient highlight on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Left: Icon, Subject Title & Paper Style */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl ${config.bgColor} ${config.borderColor} border flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300`}
          >
            <Icon className={`h-6 w-6 ${config.color}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
                {subject}
              </h3>
              <Badge variant="outline" className="text-[10px] font-semibold bg-primary/5 text-primary border-primary/20">
                {pattern.paperStyle}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {pattern.styleDescription}
            </p>

            {/* Marking Scheme and Exam Pattern Badges */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-foreground/80">
                <Award className="h-3 w-3 text-primary" />
                20M Internal &bull; 80M Annual
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-foreground/80">
                <Clock className="h-3 w-3 text-secondary" />
                {pattern.markingScheme.annualDuration}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <BarChart2 className="h-3 w-3 text-primary" />
                {pattern.examPattern.difficultyRatio}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Action & Blueprint Toggle */}
        <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold group-hover:bg-primary/90 transition-all shadow-sm">
            <span>Select Subject</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPatternDetails(!showPatternDetails);
            }}
            className="text-[11px] font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors px-1 py-0.5"
            title="Inspect paper sections and marking criteria"
          >
            <span>{showPatternDetails ? 'Hide Details' : 'View Format & Scheme'}</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${showPatternDetails ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Expandable Pattern & Marking Scheme Blueprint */}
      <AnimatePresence>
        {showPatternDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 pt-4 border-t border-border/60 text-xs space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sections grid */}
            <div>
              <p className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                Section &amp; Question Format Breakdown
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {pattern.sections.map((sec, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-muted/40 border border-border/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[11px] text-foreground">{sec.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {sec.marks}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{sec.description}</p>
                    <span className="text-[10px] text-muted-foreground font-mono mt-1.5 block">
                      Questions: {sec.questions}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Marking Criteria */}
            <div className="p-3 rounded-xl bg-muted/30 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-[11px] text-foreground block mb-1">
                  Evaluation Criteria:
                </span>
                <ul className="flex flex-wrap items-center gap-2">
                  {pattern.markingScheme.criteria.map((crit, cIdx) => (
                    <li key={cIdx} className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-right sm:border-l sm:pl-3 border-border/40 flex-shrink-0">
                <span className="text-[10px] text-muted-foreground block font-medium">Time Allocation</span>
                <span className="text-[11px] font-semibold text-foreground">
                  {pattern.examPattern.timeAllocation}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
