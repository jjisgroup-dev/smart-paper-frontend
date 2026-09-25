import { motion } from 'framer-motion';
import { BookOpen, FileText, ChevronRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { sampleChapters } from '@/data/sampleQuestions';
import { ClassLevel, Subject } from '@/types';

const SyllabusDetail = () => {
  const { classId, subjectId } = useParams<{ classId: string; subjectId: string }>();
  const navigate = useNavigate();
  
  const decodedSubject = decodeURIComponent(subjectId || '');
  const chapterKey = `${decodedSubject}-${classId}`;
  const chapters = sampleChapters[chapterKey] || [];

  const classLabel = classId === 'LKG' || classId === 'UKG' ? classId : `Class ${classId}`;

  const handleChapterClick = (chapterId: string) => {
    // Navigate to exam selection with this subject
    navigate(`/class/${classId}/subject/${encodeURIComponent(decodedSubject)}`);
  };

  return (
    <PageLayout title={`${classLabel} - ${decodedSubject}`} showBack>
      <div className="container px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{decodedSubject}</h1>
              <p className="text-muted-foreground text-sm">{classLabel} Syllabus</p>
            </div>
          </div>
        </motion.div>

        {chapters.length > 0 ? (
          <div className="space-y-3">
            {chapters.map((chapter, index) => (
              <motion.button
                key={chapter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleChapterClick(chapter.id)}
                className="w-full bg-card rounded-xl shadow-card border border-border/50 p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-primary">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{chapter.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tap to create question paper
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl shadow-card border border-border/50 p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No Chapters Available</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Chapter-wise syllabus for this subject will be added soon.
            </p>
            <button
              onClick={() => navigate(`/class/${classId}/subject/${encodeURIComponent(decodedSubject)}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Create Question Paper
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20"
        >
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Tap on any chapter to create a question paper covering that topic.
          </p>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default SyllabusDetail;
