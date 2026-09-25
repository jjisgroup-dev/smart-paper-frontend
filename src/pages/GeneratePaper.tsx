import { FormEvent, useMemo, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { generateQuestionPaper, PaperGenerationRequest } from '@/lib/aiGateway';
import { getTextbookCatalog } from '@/lib/textbook';
import { CLASS_LEVELS, ClassLevel, QuestionPaper, SUBJECTS_BY_CLASS, Subject } from '@/types';
import { sampleChapters } from '@/data/sampleQuestions';

const initialRequest: PaperGenerationRequest = { classLevel: '6', subject: 'Science', chapter: 'Components of Food', difficulty: 'medium', examFormat: 'Annual examination' };

const GeneratePaper = () => {
  const [request, setRequest] = useState(initialRequest);
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const update = (field: keyof PaperGenerationRequest, value: string) => setRequest((current) => ({ ...current, [field]: value }));
  const subjects = SUBJECTS_BY_CLASS[request.classLevel as ClassLevel] || [];
  const chapters = useMemo(() => sampleChapters[`${request.subject}-${request.classLevel}`] || [], [request.classLevel, request.subject]);

  const handleClassChange = (classLevel: string) => {
    const nextSubjects = SUBJECTS_BY_CLASS[classLevel as ClassLevel] || [];
    const nextSubject = nextSubjects.includes(request.subject as Subject) ? request.subject : nextSubjects[0] || '';
    const nextChapters = sampleChapters[`${nextSubject}-${classLevel}`] || [];
    setRequest((current) => ({ ...current, classLevel, subject: nextSubject, chapter: nextChapters[0]?.name || 'Entire syllabus' }));
  };

  const handleSubjectChange = (subject: string) => {
    const nextChapters = sampleChapters[`${subject}-${request.classLevel}`] || [];
    update('subject', subject);
    update('chapter', nextChapters[0]?.name || 'Entire syllabus');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!request.chapter.trim()) { toast.error('Add a chapter or topic first'); return; }
    setIsGenerating(true);
    try {
      const textbookContext = await getTextbookCatalog(
        request.classLevel as ClassLevel,
        request.subject as Subject,
      );
      const generated = await generateQuestionPaper({ ...request, textbookContext });
      setPaper(generated);
      window.localStorage.setItem('generated-question-paper', JSON.stringify(generated));
      toast.success(`${import.meta.env.VITE_AI_GATEWAY_URL ? 'AI' : 'Custom'} question paper generated${textbookContext.source === 'verified' ? ' from verified textbook data' : ' from local syllabus data'}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not generate the paper');
    } finally { setIsGenerating(false); }
  };

  return (
    <PageLayout title="Generate with AI" showBack>
      <div className="container grid gap-6 px-4 py-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Paper brief</CardTitle></CardHeader>
          <CardContent><form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label htmlFor="class-level">Class</Label><select id="class-level" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={request.classLevel} onChange={(event) => handleClassChange(event.target.value)}>{CLASS_LEVELS.map((level) => <option key={level} value={level}>{level === 'LKG' || level === 'UKG' ? level : `Class ${level}`}</option>)}</select></div>
              <div className="space-y-2"><Label htmlFor="subject">Subject</Label><select id="subject" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={request.subject} onChange={(event) => handleSubjectChange(event.target.value)}>{subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}</select></div>
            </div>
            <div className="space-y-2"><Label htmlFor="chapter">Syllabus coverage</Label><select id="chapter" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={request.chapter} onChange={(event) => update('chapter', event.target.value)}><option value="Entire syllabus">Complete syllabus (balanced coverage)</option>{chapters.map((chapter) => <option key={chapter.id} value={chapter.name}>{chapter.name}</option>)}</select><p className="text-xs text-muted-foreground">Complete syllabus distributes questions across the selected class and subject chapters.</p></div>
            <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label htmlFor="difficulty">Difficulty</Label><select id="difficulty" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={request.difficulty} onChange={(event) => update('difficulty', event.target.value)}><option>easy</option><option>medium</option><option>hard</option><option>mixed</option></select></div><div className="space-y-2"><Label htmlFor="exam-format">Exam format</Label><select id="exam-format" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={request.examFormat} onChange={(event) => update('examFormat', event.target.value)}><option>Unit test</option><option>Internal examination</option><option>Annual examination</option><option>Practice worksheet</option></select></div></div>
            <Button type="submit" className="w-full btn-primary-gradient" disabled={isGenerating}>{isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{isGenerating ? 'Generating' : 'Generate paper'}</Button>
            <p className="text-xs text-muted-foreground">Questions are tailored to your class, subject, chapter, difficulty and exam format.</p>
          </form></CardContent>
        </Card>
        <Card className="min-h-[360px]"><CardHeader><CardTitle>{paper?.title || 'Generated paper'}</CardTitle></CardHeader><CardContent>{paper ? <div className="space-y-5"><div className="flex flex-wrap gap-4 text-sm text-muted-foreground"><span>Class {paper.class}</span><span>{paper.subject}</span><span>{paper.totalMarks} marks</span><span>{paper.duration}</span></div><ol className="space-y-4">{paper.questions.map((question, index) => <li key={question.id} className="border-b pb-4"><div className="flex justify-between gap-4"><span><strong>{index + 1}.</strong> {question.question}</span><strong className="shrink-0">{question.marks}m</strong></div>{question.options && <ul className="mt-2 list-disc pl-6 text-sm">{question.options.map((option) => <li key={option}>{option}</li>)}</ul>}<p className="mt-2 text-sm text-muted-foreground"><strong>Answer:</strong> {question.answer}</p></li>)}</ol></div> : <div className="flex h-64 items-center justify-center text-center text-sm text-muted-foreground">Your complete paper and answers will appear here.</div>}</CardContent></Card>
      </div>
    </PageLayout>
  );
};

export default GeneratePaper;
