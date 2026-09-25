import { QuestionPaper } from '@/types';
import { TeacherProfile } from '@/hooks/useTeacherProfile';

interface PaperHeaderProps {
  paper: QuestionPaper;
  teacherProfile?: TeacherProfile;
}

export const PaperHeader = ({ paper, teacherProfile }: PaperHeaderProps) => {
  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-card border border-border/50 text-center mb-6">
       <div className="mb-3">
        <div className="flex items-center justify-center gap-3 mb-2">
          {teacherProfile?.photo && (
            <img src={teacherProfile.photo} alt="Teacher" className="h-10 w-10 rounded-full object-cover border border-border" />
          )}
          {teacherProfile?.schoolName && <p className="text-sm font-medium text-foreground">{teacherProfile.schoolName}</p>}
        </div>
        <p className="text-sm text-muted-foreground mb-1">{paper.board || 'CBSE'} - NCERT Pattern</p>
        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">
          {paper.title}
        </h1>
        <p className="text-muted-foreground">
          Class {teacherProfile?.standard || paper.class} | {teacherProfile?.subject || paper.subject}
          {teacherProfile?.division && ` | Division ${teacherProfile.division}`}
        </p>
        {teacherProfile?.teacherName && <p className="text-xs text-muted-foreground mt-1">Teacher: {teacherProfile.teacherName}</p>}
      </div>

      <div className="flex items-center justify-center gap-6 text-sm border-t border-dashed border-border pt-3">
        <div>
          <span className="text-muted-foreground">Total Marks: </span>
          <span className="font-semibold">{paper.totalMarks}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Duration: </span>
          <span className="font-semibold">{paper.duration}</span>
        </div>
      </div>

      {paper.instructions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border text-left">
          <h3 className="font-semibold text-sm mb-2">General Instructions:</h3>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            {paper.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};
