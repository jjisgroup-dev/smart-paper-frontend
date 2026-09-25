import { forwardRef } from 'react';
import { QuestionPaper, Question } from '@/types';
import { TeacherProfile } from '@/hooks/useTeacherProfile';

interface PdfDocumentProps {
  paper: QuestionPaper;
  teacherProfile: TeacherProfile;
  showAnswers: boolean;
}

const typeLabels: Record<Question['type'], string> = {
  mcq: 'MCQ',
  'fill-blank': 'Fill in the Blank',
  'true-false': 'True / False',
  short: 'Short Answer',
  long: 'Long Answer',
  match: 'Match the Following',
};

export const PdfDocument = forwardRef<HTMLElement, PdfDocumentProps>(({ paper, teacherProfile, showAnswers }, ref) => {
  const groupedQuestions = paper.questions.reduce<Record<string, Question[]>>((groups, question) => {
    const section = question.type;
    groups[section] = [...(groups[section] ?? []), question];
    return groups;
  }, {});

  return (
    <article ref={ref} className="pdf-export-document" aria-hidden="true">
      <header className="pdf-paper-header">
        {teacherProfile.photo && (
          <img className="pdf-teacher-photo" src={teacherProfile.photo} alt="Teacher" />
        )}
        <div className="pdf-school-name">{teacherProfile.schoolName || 'School Name'}</div>
        <div className="pdf-paper-label">{paper.board || 'CBSE'} · NCERT Pattern</div>
        <h1>{paper.title}</h1>
        <p>Class {paper.class} · {paper.subject}</p>
        <div className="pdf-meta-row">
          <span>Maximum Marks: <strong>{paper.totalMarks}</strong></span>
          <span>Time: <strong>{paper.duration}</strong></span>
        </div>
        {(teacherProfile.teacherName || teacherProfile.division || teacherProfile.standard) && (
          <div className="pdf-teacher-row">
            {teacherProfile.teacherName && <span>Teacher: {teacherProfile.teacherName}</span>}
            {(teacherProfile.standard || teacherProfile.division) && (
              <span>
                {teacherProfile.standard && `Standard: ${teacherProfile.standard}`}
                {teacherProfile.standard && teacherProfile.division && ' · '}
                {teacherProfile.division && `Division: ${teacherProfile.division}`}
              </span>
            )}
          </div>
        )}
      </header>

      <section className="pdf-instructions">
        <h2>General Instructions</h2>
        <ol>
          {paper.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
        </ol>
      </section>

      {Object.entries(groupedQuestions).map(([type, questions], sectionIndex) => (
        <section className="pdf-section" key={type}>
          <h2>Section {String.fromCharCode(65 + sectionIndex)}: {typeLabels[type as Question['type']] || type}</h2>
          {questions.map((question, questionIndex) => (
            <div className="pdf-question" key={question.id}>
              <div className="pdf-question-title">
                <span>{questionIndex + 1}. {question.question}</span>
                <strong>[{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]</strong>
              </div>
              {question.options && (
                <ol className="pdf-options" type="A">
                  {question.options.map((option) => <li key={option}>{option}</li>)}
                </ol>
              )}
              {showAnswers && question.answer && (
                <p className="pdf-answer"><strong>Answer:</strong> {question.answer}</p>
              )}
            </div>
          ))}
        </section>
      ))}

      {teacherProfile.remarks && (
        <footer className="pdf-remarks"><strong>Remarks:</strong> {teacherProfile.remarks}</footer>
      )}
    </article>
  );
});

PdfDocument.displayName = 'PdfDocument';