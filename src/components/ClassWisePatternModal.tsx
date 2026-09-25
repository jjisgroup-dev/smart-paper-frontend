import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Laptop,
  Languages,
  Clock,
  Award,
  Sparkles,
  ChevronRight,
  GraduationCap,
  ExternalLink,
  Layers,
  CheckCircle2,
  FileText,
  HelpCircle,
  BarChart2,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CLASS_LEVELS, ClassLevel, SUBJECTS_BY_CLASS, Subject } from '@/types';
import { getSubjectExamPattern } from '@/data/examPatterns';
import { LucideIcon } from 'lucide-react';

interface ClassWisePatternModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClass?: ClassLevel;
}

const subjectIconConfig: Record<Subject, { icon: LucideIcon; color: string; bgColor: string; borderColor: string }> = {
  English: { icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-950/40', borderColor: 'border-blue-200 dark:border-blue-800' },
  Hindi: { icon: Languages, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-950/40', borderColor: 'border-orange-200 dark:border-orange-800' },
  Mathematics: { icon: Calculator, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-950/40', borderColor: 'border-purple-200 dark:border-purple-800' },
  Science: { icon: FlaskConical, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/40', borderColor: 'border-emerald-200 dark:border-emerald-800' },
  'Social Science': { icon: Globe, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/40', borderColor: 'border-amber-200 dark:border-amber-800' },
  EVS: { icon: Globe, color: 'text-teal-600 dark:text-teal-400', bgColor: 'bg-teal-50 dark:bg-teal-950/40', borderColor: 'border-teal-200 dark:border-teal-800' },
  'Computer Science': { icon: Laptop, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-50 dark:bg-indigo-950/40', borderColor: 'border-indigo-200 dark:border-indigo-800' },
  Sanskrit: { icon: Languages, color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-50 dark:bg-rose-950/40', borderColor: 'border-rose-200 dark:border-rose-800' },
};

export const ClassWisePatternModal = ({
  isOpen,
  onClose,
  initialClass = '10',
}: ClassWisePatternModalProps) => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(initialClass);
  const [expandedSubject, setExpandedSubject] = useState<Subject | null>(null);

  const getClassLabel = (level: ClassLevel) => {
    if (level === 'LKG' || level === 'UKG') return level;
    return `Class ${level}`;
  };

  const subjects = SUBJECTS_BY_CLASS[selectedClass] || [];

  const handleSelectSubject = (subject: Subject) => {
    onClose();
    navigate(`/class/${selectedClass}/subject/${subject}`);
  };

  const handleViewAllClassPapers = () => {
    onClose();
    navigate(`/class/${selectedClass}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden bg-background border-border/80">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/60 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  NCERT Question Paper Blueprint
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[11px] font-medium">
                    Actual Paper Format
                  </Badge>
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                Explore subject-wise paper styles, marking scheme and exam patterns before generating or attempting papers.
              </DialogDescription>
            </div>

            <button
              onClick={handleViewAllClassPapers}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors self-start sm:self-auto cursor-pointer"
            >
              Open {getClassLabel(selectedClass)} Papers
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Class Selector Tabs (LKG to Class 10) */}
          <div className="mt-4 pt-3 border-t border-border/40">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              Select Class to View Paper Styles &amp; Marking Scheme
            </p>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {CLASS_LEVELS.map((level) => {
                const isSelected = selectedClass === level;
                return (
                  <button
                    key={level}
                    onClick={() => {
                      setSelectedClass(level);
                      setExpandedSubject(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40'
                    }`}
                  >
                    {getClassLabel(level)}
                  </button>
                );
              })}
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content Body */}
        <ScrollArea className="flex-1 px-5 py-4 overflow-y-auto">
          {/* Class Assessment Blueprint Banner */}
          <div className="mb-5 p-4 rounded-xl bg-primary/5 border border-primary/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground">
                  {getClassLabel(selectedClass)} Standard Assessment Blueprint
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Aligned with official NCERT textbook competencies and CBSE standardized assessment guidelines.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-1.5 rounded-lg bg-background border border-border/60 text-center">
                <span className="block text-[10px] text-muted-foreground font-medium uppercase">Internal</span>
                <span className="text-xs font-bold text-foreground">20 Marks</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-background border border-border/60 text-center">
                <span className="block text-[10px] text-muted-foreground font-medium uppercase">Annual / Board</span>
                <span className="text-xs font-bold text-primary">80 Marks</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-background border border-border/60 text-center">
                <span className="block text-[10px] text-muted-foreground font-medium uppercase">Total</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">100 Marks</span>
              </div>
            </div>
          </div>

          {/* Subject-Wise Cards Header */}
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Subject-Wise Paper Styles, Marking Scheme &amp; Exam Patterns ({subjects.length} Subjects)
            </h4>
            <span className="text-[11px] text-muted-foreground">Hover over any subject to inspect format</span>
          </div>

          {/* Subject List Grid with Smooth Hover Animation */}
          <div className="grid gap-3.5">
            {subjects.map((subject, index) => {
              const pattern = getSubjectExamPattern(selectedClass, subject);
              const config = subjectIconConfig[subject] || {
                icon: BookOpen,
                color: 'text-primary',
                bgColor: 'bg-primary/10',
                borderColor: 'border-primary/20',
              };
              const SubjectIcon = config.icon;
              const isExpanded = expandedSubject === subject;

              return (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.25 }}
                  whileHover={{
                    y: -4,
                    scale: 1.012,
                    boxShadow: '0 12px 28px -10px rgba(0, 0, 0, 0.12)',
                    transition: { type: 'spring', stiffness: 350, damping: 25 },
                  }}
                  whileTap={{ scale: 0.99 }}
                  className={`group relative rounded-2xl border transition-all duration-300 p-4 sm:p-5 bg-card/95 hover:bg-card hover:border-primary/50 cursor-pointer overflow-hidden ${
                    isExpanded ? 'border-primary shadow-md' : 'border-border/60'
                  }`}
                  onClick={() => setExpandedSubject(isExpanded ? null : subject)}
                >
                  {/* Subtle animated hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: Icon, Subject Title & Paper Style */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl ${config.bgColor} ${config.borderColor} border flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300`}
                      >
                        <SubjectIcon className={`h-6 w-6 ${config.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                            {subject}
                          </h5>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {pattern.paperStyle}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {pattern.styleDescription}
                        </p>

                        {/* Quick badges row */}
                        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                          <Badge variant="secondary" className="text-[11px] font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3 text-secondary" />
                            Annual: {pattern.markingScheme.annualDuration}
                          </Badge>
                          <Badge variant="outline" className="text-[11px] font-medium border-border/80 flex items-center gap-1">
                            <BarChart2 className="h-3 w-3 text-primary" />
                            {pattern.examPattern.difficultyRatio}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground/90 font-medium">
                            {pattern.sections.length} Sections Defined
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSubject(subject);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm group-hover:shadow cursor-pointer"
                        title={`Generate or view ${subject} questions`}
                      >
                        Select Subject
                        <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>

                      <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                        {isExpanded ? 'Hide pattern details' : 'Click to inspect blueprint'}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Section Details & Marking Scheme */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-4 pt-4 border-t border-border/60 text-xs space-y-3.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Section Breakdown Table */}
                        <div>
                          <p className="font-semibold text-foreground mb-2 flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-primary" />
                            Section &amp; Question Format Breakdown
                          </p>
                          <div className="grid gap-2 sm:grid-cols-3">
                            {pattern.sections.map((sec, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-xl bg-muted/40 border border-border/50 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className="font-semibold text-foreground text-[11px]">{sec.name}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                                      {sec.marks}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground">{sec.description}</p>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-mono mt-2">
                                  Questions: {sec.questions}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Marking Scheme Detailed Breakdown */}
                        <div className="grid sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3 rounded-xl bg-background border border-border/60">
                            <div className="flex items-center gap-1.5 font-semibold text-foreground mb-1 text-xs">
                              <Award className="h-3.5 w-3.5 text-primary" />
                              Internal Assessment (20 Marks)
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {pattern.markingScheme.internalBreakdown}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-background border border-border/60">
                            <div className="flex items-center gap-1.5 font-semibold text-foreground mb-1 text-xs">
                              <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              Annual Examination (80 Marks)
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {pattern.markingScheme.annualBreakdown}
                            </p>
                          </div>
                        </div>

                        {/* Marking Scheme Criteria & Time Allocation */}
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <span className="font-semibold text-foreground text-[11px] block mb-1">
                              Evaluation &amp; Scoring Criteria:
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
                            <span className="text-xs font-semibold text-foreground">
                              {pattern.examPattern.timeAllocation}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
