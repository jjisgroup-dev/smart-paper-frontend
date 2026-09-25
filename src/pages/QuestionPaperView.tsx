import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, Contrast, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layout/PageLayout';
import { PaperHeader } from '@/components/PaperHeader';
import { QuestionCard } from '@/components/QuestionCard';
import { ActionButtons } from '@/components/ActionButtons';
import { ClassLevel, Subject, ExamType, EXAM_TYPES, Question, Difficulty, QuestionPaper } from '@/types';
import { PdfDocument } from '@/components/PdfDocument';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import { getNCERTQuestionPaper } from '@/data/ncertQuestionBank';

const QuestionPaperView = () => {
  const { classId, subjectId, examId } = useParams<{ 
    classId: string; 
    subjectId: string; 
    examId: string 
  }>();
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get('difficulty') || 'all';
  
  const [showAnswers, setShowAnswers] = useState(false);
  const [textScale, setTextScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { profile: teacherProfile, profiles, activeProfileId, setActiveProfileId } = useTeacherProfile();
  const pdfRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '+' || event.key === '=') setTextScale((value) => Math.min(1.3, value + 0.1));
      if (event.key === '-') setTextScale((value) => Math.max(0.9, value - 0.1));
      if (event.key.toLowerCase() === 'a') setShowAnswers((value) => !value);
      if (event.key.toLowerCase() === 'c') setHighContrast((value) => !value);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const classLevel = decodeURIComponent(classId || '').trim() as ClassLevel;
  const subject = decodeURIComponent(subjectId || '').trim() as Subject;
  const examType = examId as ExamType;
  const examInfo = EXAM_TYPES.find(e => e.id === examType);

  useEffect(() => {
    setIsGenerating(false);
    setGenerationError(null);
    try {
      const generated = getNCERTQuestionPaper(
        classLevel,
        subject,
        examType,
        difficulty as Difficulty | 'all'
      );
      setPaper(generated);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Could not load NCERT question paper.');
    }
  }, [classLevel, subject, examType, difficulty]);

  // Group questions by type
  const filteredQuestions: Question[] = paper?.questions || [];
  const questionsByType = filteredQuestions.reduce((acc, question) => {
    const type = question.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  const typeLabels: Record<string, string> = {
    'mcq': 'Section A: Multiple Choice Questions',
    'fill-blank': 'Section B: Fill in the Blanks',
    'true-false': 'Section C: True or False',
    'short': 'Section D: Short Answer Questions',
    'long': 'Section E: Long Answer Questions',
  };

  const typeOrder = ['mcq', 'fill-blank', 'true-false', 'short', 'long'];

  let questionIndex = 0;

  return (
    <PageLayout 
      title={`${examInfo?.name || 'Exam'}`} 
      showBack 
      showBottomNav={true}
    >
      <div className={`container px-4 py-6 pb-32 scroll-smooth ${highContrast ? 'high-contrast' : ''}`}>
        {isGenerating && <div className="mb-6 rounded-lg border bg-card p-6 text-center text-muted-foreground">Generating NCERT questions and answers for {subject}...</div>}
        {generationError && <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">{generationError}</div>}
        
        {paper && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm px-3.5 py-2 text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <UserRound className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-muted-foreground">Header Profile:</span>
              {profiles.length > 1 ? (
                <select
                  value={activeProfileId}
                  onChange={(e) => setActiveProfileId(e.target.value)}
                  className="rounded-md border border-input bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:ring-1 focus:ring-primary outline-none"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.profileLabel || p.teacherName || 'Profile'}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="font-semibold text-foreground">
                  {teacherProfile?.profileLabel || teacherProfile?.teacherName || 'Default Profile'}
                </span>
              )}
            </div>
            <Link
              to="/profile"
              className="text-xs text-primary hover:underline font-medium ml-auto"
            >
              {profiles.length > 1 ? 'Manage Profiles' : 'Customize Profile'}
            </Link>
          </div>
        )}

        {paper && <PaperHeader paper={paper} teacherProfile={teacherProfile} />}

        {paper && <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-2" aria-label="Reading controls">
          <span className="text-sm font-medium">Reading controls</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" aria-label="Decrease text size" onClick={() => setTextScale((value) => Math.max(0.9, value - 0.1))}><Minus className="h-4 w-4" /></Button>
            <span className="min-w-14 text-center text-sm">{Math.round(textScale * 100)}%</span>
            <Button variant="outline" size="icon" aria-label="Increase text size" onClick={() => setTextScale((value) => Math.min(1.3, value + 0.1))}><Plus className="h-4 w-4" /></Button>
            <Button variant={highContrast ? 'secondary' : 'outline'} size="icon" aria-label="Toggle high contrast" onClick={() => setHighContrast((value) => !value)}><Contrast className="h-4 w-4" /></Button>
          </div>
        </div>}

        {/* Questions by Section */}
        <div className="space-y-6" style={{ fontSize: `${textScale}em` }}>
          {typeOrder.map((type) => {
            const questions = questionsByType[type];
            if (!questions || questions.length === 0) return null;

            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-foreground sticky top-14 bg-background/95 backdrop-blur-sm py-2 z-10 border-b border-border">
                  {typeLabels[type] || type}
                </h2>
                <div className="space-y-3">
                  {questions.map((question) => {
                    const currentIndex = questionIndex++;
                    return (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        index={currentIndex}
                        showAnswer={showAnswers}
                      />
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {!isGenerating && !generationError && filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No questions available for this selection.</p>
          </div>
        )}
      </div>

      <ActionButtons 
        showAnswers={showAnswers} 
        onToggleAnswers={() => setShowAnswers(!showAnswers)} 
        paper={paper}
        teacherProfile={teacherProfile}
        pdfRef={pdfRef}
      />
      {paper && <div className="pdf-export-host" aria-hidden="true">
        <PdfDocument ref={pdfRef} paper={paper} teacherProfile={teacherProfile} showAnswers={showAnswers} />
      </div>}
    </PageLayout>
  );
};

export default QuestionPaperView;
