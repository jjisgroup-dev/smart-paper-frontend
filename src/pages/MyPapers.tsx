import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Award,
  Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CLASS_LEVELS, ClassLevel, SUBJECTS_BY_CLASS } from '@/types';
import { ClassWisePatternModal } from '@/components/ClassWisePatternModal';

const classMeta: Record<ClassLevel, { name: string; stage: string; emoji: string }> = {
  LKG: { name: 'LKG', stage: 'Early Steps ECCE', emoji: '🌸' },
  UKG: { name: 'UKG', stage: 'Upper Kindergarten', emoji: '🌻' },
  '1': { name: 'Class 1', stage: 'Foundational Stage', emoji: '📚' },
  '2': { name: 'Class 2', stage: 'Foundational Stage', emoji: '✏️' },
  '3': { name: 'Class 3', stage: 'Preparatory Stage', emoji: '🎨' },
  '4': { name: 'Class 4', stage: 'Preparatory Stage', emoji: '🔬' },
  '5': { name: 'Class 5', stage: 'Preparatory Stage', emoji: '🌍' },
  '6': { name: 'Class 6', stage: 'Middle Stage', emoji: '📐' },
  '7': { name: 'Class 7', stage: 'Middle Stage', emoji: '🧪' },
  '8': { name: 'Class 8', stage: 'Middle Stage', emoji: '🔭' },
  '9': { name: 'Class 9', stage: 'Secondary Board Prep', emoji: '📊' },
  '10': { name: 'Class 10', stage: 'CBSE Board Examination', emoji: '🎓' },
};

const MyPapers = () => {
  const navigate = useNavigate();
  const [isPatternModalOpen, setIsPatternModalOpen] = useState(false);
  const [selectedClassForModal, setSelectedClassForModal] = useState<ClassLevel>('10');

  const handleOpenPatternModal = (level?: ClassLevel) => {
    if (level) {
      setSelectedClassForModal(level);
    }
    setIsPatternModalOpen(true);
  };

  return (
    <PageLayout title="My Papers" showSearch>
      <div className="container px-4 py-6">
        {/* Saved Papers / Create New Paper Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-2xl bg-card border border-border/80 shadow-sm text-center mb-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
            <FileText className="h-8 w-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">No Saved Papers Yet</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mb-6 max-w-md mx-auto">
            Choose any class from LKG to Class 10 to preview paper-styles, marking scheme &amp; exam patterns, or create a new curriculum-aligned question paper.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => handleOpenPatternModal('10')}
              className="btn-primary-gradient px-5 py-2.5 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Paper
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOpenPatternModal('10')}
              className="border-border text-foreground hover:bg-muted"
            >
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              Preview Exam Blueprint
            </Button>
          </div>
        </motion.div>

        {/* Class-Wise NCERT Question Papers Section (EXCLUSIVE to Papers Menu) */}
        <div className="space-y-4">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border/60">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2 flex-wrap">
                  Class-Wise NCERT Question Papers
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                    Instant &bull; No AI Delay
                  </span>
                  <Badge variant="outline" className="text-[10px] font-medium border-primary/20 text-primary">
                    CBSE / NCERT
                  </Badge>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select any card below to preview subject-wise paper-styles, marking scheme and exam patterns
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground self-start sm:self-auto">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Tap card to view format blueprint</span>
            </div>
          </div>

          {/* Class Cards Grid (LKG to Class 10) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pt-2">
            {CLASS_LEVELS.map((level, index) => {
              const meta = classMeta[level] || { name: `Class ${level}`, stage: 'NCERT Curriculum', emoji: '📚' };
              const subjects = SUBJECTS_BY_CLASS[level] || [];
              const isSecondary = level === '9' || level === '10';

              return (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.25 }}
                  whileHover={{
                    y: -4,
                    scale: 1.02,
                    boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.12)',
                    transition: { type: 'spring', stiffness: 350, damping: 25 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenPatternModal(level)}
                  className="group relative bg-card/95 hover:bg-card border border-border/70 hover:border-primary/50 rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-lg transition-all duration-300 text-left cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div>
                    {/* Top Row: Emoji & Class Title */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          {meta.emoji}
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                            {meta.name}
                          </h4>
                          <span className="text-[11px] text-muted-foreground block">
                            {meta.stage}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/class/${level}`);
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title={`Directly open ${meta.name} subjects`}
                        aria-label={`Directly open ${meta.name} subjects`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Meta info & assessment badge */}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{subjects.length} Subjects</span>
                        <span className="font-medium text-foreground text-[11px]">
                          {isSecondary ? '5-Section Board Blueprint' : 'Standard 3-Section Format'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-muted/70 text-foreground/80">
                          <Award className="h-3 w-3 text-primary" />
                          20M Internal
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-muted/70 text-foreground/80">
                          <Award className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          80M Annual
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card bottom footer */}
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                    <span className="group-hover:underline">Preview Paper Pattern</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Section footer note */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground mt-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>Smart Paper Studio &bull; Real NCERT Syllabus &amp; Authentic Question Sets</span>
            </div>
            <span>CBSE Competency Assessment Framework</span>
          </div>
        </div>
      </div>

      {/* Class-Wise Pattern & Blueprint Modal */}
      <ClassWisePatternModal
        isOpen={isPatternModalOpen}
        onClose={() => setIsPatternModalOpen(false)}
        initialClass={selectedClassForModal}
      />
    </PageLayout>
  );
};

export default MyPapers;
