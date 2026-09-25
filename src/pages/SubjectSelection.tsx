import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { SubjectCard } from '@/components/SubjectCard';
import { ClassLevel, SUBJECTS_BY_CLASS } from '@/types';
import { Award, BookOpen, Clock, Sparkles, ChevronDown, CheckCircle2, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SubjectSelection = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [showClassOverview, setShowClassOverview] = useState(false);

  const classLevel = classId as ClassLevel;
  const subjects = SUBJECTS_BY_CLASS[classLevel] || [];

  const getClassLabel = (level: ClassLevel) => {
    if (level === 'LKG' || level === 'UKG') return level;
    return `Class ${level}`;
  };

  const isKindergarten = classLevel === 'LKG' || classLevel === 'UKG';
  const isSecondary = ['9', '10'].includes(classLevel);

  return (
    <PageLayout title={getClassLabel(classLevel)} showBack>
      <div className="container px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              NCERT Curriculum
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              Standardized Blueprint
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Choose Subject</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
            Select a subject to view curriculum-aligned question papers, marking scheme &amp; patterns
          </p>
        </motion.div>

        {/* Class Assessment Blueprint & Marking Scheme Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-2">
                  {getClassLabel(classLevel)} Assessment &amp; Marking Scheme
                  <Badge variant="outline" className="text-[10px] font-semibold bg-primary/5 text-primary border-primary/20">
                    {isSecondary ? 'CBSE Board Blueprint' : isKindergarten ? 'Foundational ECCE' : 'Primary/Middle Standard'}
                  </Badge>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  100 Marks Total &bull; 20 Marks Internal Assessment + 80 Marks Annual Exam
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowClassOverview(!showClassOverview)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>{showClassOverview ? 'Hide Blueprint' : 'View Blueprint Guide'}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showClassOverview ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Quick stats pills */}
          <div className="grid grid-cols-3 gap-2.5 mt-3.5 pt-3 border-t border-border/40 text-center">
            <div className="p-2 rounded-lg bg-muted/40 border border-border/40">
              <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Internal</span>
              <span className="text-xs sm:text-sm font-bold text-foreground">20 Marks (1 Hr)</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40 border border-border/40">
              <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Annual</span>
              <span className="text-xs sm:text-sm font-bold text-primary">80 Marks ({isKindergarten ? '2 Hrs' : isSecondary ? '3 Hrs' : '2.5 Hrs'})</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40 border border-border/40">
              <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Question Styles</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">MCQs, Short, Long</span>
            </div>
          </div>

          {/* Expandable Overview Guide */}
          {showClassOverview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-3.5 border-t border-border/60 text-xs text-muted-foreground space-y-2.5"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-foreground">Standardized Sections:</strong> Question papers follow standard Sections A (Objective &amp; MCQs), B (Very Short Answers), C (Short Answers), D (Long Descriptive/Proofs), and E (Case Study / Application).
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-foreground">Step-Wise Marking:</strong> Numerical calculations and theorem proofs award step marks for formulas, working statements, and final units.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-foreground">Real NCERT Questions:</strong> All question sets draw authentic questions directly from textbook exercise problems and exemplary curriculum standards without AI hallucination.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Subjects list */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" />
            Available Subjects ({subjects.length})
          </p>
          <span className="text-[11px] text-muted-foreground">Select a subject below</span>
        </div>

        <div className="grid gap-3.5">
          {subjects.map((subject, index) => (
            <SubjectCard
              key={subject}
              subject={subject}
              classLevel={classLevel}
              index={index}
              onClick={() => navigate(`/class/${classId}/subject/${subject}`)}
            />
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No subjects available for this class.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SubjectSelection;
