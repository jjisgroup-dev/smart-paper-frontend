import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Clock, Award, CheckCircle2, Layers, BookOpen } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ExamTypeSelector } from '@/components/ExamTypeSelector';
import { DifficultyFilter } from '@/components/DifficultyFilter';
import { ClassLevel, Subject, ExamType, Difficulty, EXAM_TYPES } from '@/types';
import { getSubjectExamPattern } from '@/data/examPatterns';
import { Badge } from '@/components/ui/badge';

const ExamSelection = () => {
  const { classId, subjectId } = useParams<{ classId: string; subjectId: string }>();
  const navigate = useNavigate();
  
  const [selectedExam, setSelectedExam] = useState<ExamType>('1st-internal');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

  const classLevel = classId as ClassLevel;
  const subject = subjectId as Subject;
  
  const currentExam = EXAM_TYPES.find(e => e.id === selectedExam);
  const pattern = getSubjectExamPattern(classLevel, subject);
  const isAnnual = currentExam?.marks === 80;

  const handleViewPaper = () => {
    navigate(`/class/${classId}/subject/${subjectId}/exam/${selectedExam}?difficulty=${selectedDifficulty}`);
  };

  return (
    <PageLayout title={subject} showBack>
      <div className="container px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              Class {classLevel} &bull; {subject}
            </span>
            <Badge variant="outline" className="text-[10px] text-muted-foreground border-border/80">
              NCERT Curriculum
            </Badge>
          </div>
          <h1 className="text-xl font-bold mb-1">Select Exam Type</h1>
          <p className="text-muted-foreground text-sm">
            Choose the examination and difficulty level to access authentic NCERT question papers
          </p>
        </motion.div>

        {/* Exam Type Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <ExamTypeSelector selected={selectedExam} onChange={setSelectedExam} />
        </motion.div>

        {/* Exam Details Card */}
        {currentExam && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-5 shadow-card border border-border/60 mb-6"
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="font-semibold text-lg text-foreground">{currentExam.name} Details</h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {pattern.paperStyle}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="flex flex-col items-center p-3 bg-muted/40 rounded-xl border border-border/40">
                <Award className="h-5 w-5 text-primary mb-1.5" />
                <span className="text-lg font-bold text-foreground">{currentExam.marks}</span>
                <span className="text-[11px] text-muted-foreground">Total Marks</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/40 rounded-xl border border-border/40">
                <Clock className="h-5 w-5 text-secondary mb-1.5" />
                <span className="text-lg font-bold text-foreground">
                  {isAnnual ? pattern.markingScheme.annualDuration : pattern.markingScheme.internalDuration}
                </span>
                <span className="text-[11px] text-muted-foreground">Duration</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/40 rounded-xl border border-border/40">
                <Calendar className="h-5 w-5 text-accent-foreground mb-1.5" />
                <span className="text-xs font-bold text-foreground text-center">{currentExam.month}</span>
                <span className="text-[11px] text-muted-foreground">Schedule</span>
              </div>
            </div>

            {/* Marking Scheme Breakdown Box */}
            <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 text-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  Marking Scheme Breakdown:
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {pattern.examPattern.difficultyRatio}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {isAnnual ? pattern.markingScheme.annualBreakdown : pattern.markingScheme.internalBreakdown}
              </p>
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  Step-wise evaluation enabled
                </span>
                <span>Time per Q: {pattern.examPattern.timeAllocation}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Difficulty Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="font-semibold mb-3">Difficulty Level</h3>
          <DifficultyFilter selected={selectedDifficulty} onChange={setSelectedDifficulty} />
        </motion.div>

        {/* View Paper Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleViewPaper}
          className="w-full py-4 rounded-xl btn-primary-gradient text-lg font-semibold shadow-md hover:shadow-lg transition-all"
        >
          View NCERT Question Paper
        </motion.button>
      </div>
    </PageLayout>
  );
};

export default ExamSelection;
