import { Share2, Download, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { QuestionPaper } from '@/types';
import { TeacherProfile } from '@/hooks/useTeacherProfile';
import { downloadQuestionPaperPdf } from '@/lib/pdf';

interface ActionButtonsProps {
  showAnswers: boolean;
  onToggleAnswers: () => void;
  paper: QuestionPaper;
  teacherProfile: TeacherProfile;
  pdfRef: React.RefObject<HTMLElement | null>;
}

export const ActionButtons = ({ showAnswers, onToggleAnswers, paper, teacherProfile, pdfRef }: ActionButtonsProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${paper.subject} question paper`,
          text: 'Check out this question paper!',
          url: window.location.href,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      try {
        await navigator.clipboard?.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      } catch {
        toast.error('Sharing is not available on this device');
      }
    }
  };

  const handleDownload = async () => {
    if (!pdfRef.current) return;

    setIsDownloading(true);
    try {
      const safeTitle = `${paper.subject}-${paper.class}-${paper.examType}`.replace(/[^a-z0-9-]/gi, '-');
      await downloadQuestionPaperPdf(pdfRef.current, `${safeTitle}-question-paper.pdf`);
      toast.success('A4 PDF downloaded');
    } catch {
      toast.error('Could not create the PDF', { description: 'Please try again.' });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4 pb-4 pointer-events-none">
      <div className="container max-w-2xl mx-auto">
        <div className="flex gap-3 justify-center pointer-events-auto">
          <Button
            onClick={onToggleAnswers}
            variant="secondary"
            className="shadow-elevated"
          >
            {showAnswers ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Answers
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Answers
              </>
            )}
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="shadow-elevated bg-card"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={handleDownload}
            className="btn-primary-gradient shadow-elevated"
            disabled={isDownloading}
          >
            {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isDownloading ? 'Creating PDF' : 'PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
};
