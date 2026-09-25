import { ClassLevel, Difficulty, ExamType, Question, QuestionPaper, Subject } from '@/types';
import { lkgUkgQuestions } from './ncertQuestions/lkg_ukg';
import { primary1_2Questions } from './ncertQuestions/primary1_2';
import { primary3_5Questions } from './ncertQuestions/primary3_5';
import { middle6Questions } from './ncertQuestions/middle6';
import { middle7_8Questions } from './ncertQuestions/middle7_8';
import { secondary9Questions } from './ncertQuestions/secondary9';
import { secondary10Questions } from './ncertQuestions/secondary10';

export const ncertQuestionBank: Record<string, Question[]> = {
  ...lkgUkgQuestions,
  ...primary1_2Questions,
  ...primary3_5Questions,
  ...middle6Questions,
  ...middle7_8Questions,
  ...secondary9Questions,
  ...secondary10Questions,
};

const examFormatConfig: Record<ExamType, { name: string; marks: number[]; totalMarks: number; duration: string }> = {
  '1st-internal': {
    name: '1st Internal Examination',
    marks: [1, 1, 2, 2, 4, 5, 5],
    totalMarks: 20,
    duration: '1 Hour',
  },
  '2nd-internal': {
    name: '2nd Internal Examination',
    marks: [1, 1, 2, 2, 4, 5, 5],
    totalMarks: 20,
    duration: '1 Hour',
  },
  '3rd-internal': {
    name: '3rd Internal Examination',
    marks: [1, 1, 2, 2, 4, 5, 5],
    totalMarks: 20,
    duration: '1 Hour',
  },
  annual: {
    name: 'Annual Examination',
    // 5 MCQs (5x1m), 5 Fill/True-False (5x1m), 4 Short (4x3m = 12m), 3 Medium (3x4m = 12m), 3 Long (2x8m + 1x10m = 26m) + 2x10m = 80m total
    marks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 4, 4, 4, 8, 8, 20],
    totalMarks: 80,
    duration: '3 Hours',
  },
};

export const getNCERTQuestions = (
  classLevel: ClassLevel,
  subject: Subject,
  difficulty: Difficulty | 'all' = 'all'
): Question[] => {
  const key = `${subject}-${classLevel}`;
  const bank = ncertQuestionBank[key] || [];

  if (bank.length === 0) {
    return [];
  }

  if (difficulty === 'all') {
    return bank;
  }

  const filtered = bank.filter((q) => q.difficulty === difficulty);
  return filtered.length > 0 ? filtered : bank;
};

export const getNCERTQuestionPaper = (
  classLevel: ClassLevel,
  subject: Subject,
  examType: ExamType = '1st-internal',
  difficulty: Difficulty | 'all' = 'all'
): QuestionPaper => {
  const config = examFormatConfig[examType] || examFormatConfig['1st-internal'];
  const allBankQuestions = getNCERTQuestions(classLevel, subject, 'all');

  const prioritized = difficulty === 'all'
    ? allBankQuestions
    : [
        ...allBankQuestions.filter((q) => q.difficulty === difficulty),
        ...allBankQuestions.filter((q) => q.difficulty !== difficulty),
      ];

  const sourceQuestions = prioritized.length > 0 ? prioritized : allBankQuestions;

  // Internal exams pick different slices so 1st, 2nd, 3rd don't duplicate questions when bank is large
  const offset = examType === '2nd-internal' ? 2 : examType === '3rd-internal' ? 4 : 0;

  const targetMarksList = config.marks;
  const questions: Question[] = targetMarksList.map((marks, index) => {
    const questionIndex = (offset + index) % Math.max(1, sourceQuestions.length);
    const baseQuestion = sourceQuestions[questionIndex] || {
      id: `default-${index}`,
      question: `Explain an important concept from ${subject} Class ${classLevel}.`,
      answer: 'Standard NCERT curriculum response with relevant details.',
      marks,
      type: (marks === 1 ? 'mcq' : marks <= 3 ? 'short' : 'long') as Question['type'],
      difficulty: 'medium' as Difficulty,
      chapter: 'Core Syllabus',
      subject,
      classLevel,
      board: 'CBSE' as const,
    };

    return {
      ...baseQuestion,
      id: `ncert-${classLevel}-${subject}-${examType}-${index}`,
      marks,
      subject,
      classLevel,
      board: 'CBSE',
    };
  });

  const classLabel = classLevel === 'LKG' || classLevel === 'UKG' ? classLevel : `Class ${classLevel}`;

  return {
    id: `ncert-paper-${classLevel}-${subject}-${examType}`,
    title: `${subject} - ${config.name}`,
    class: classLevel,
    subject,
    examType,
    difficulty: difficulty === 'all' ? 'medium' : difficulty,
    totalMarks: config.totalMarks,
    duration: config.duration,
    instructions: [
      'All questions are compulsory.',
      'Read each question carefully before attempting your answer.',
      'Section A: 1 mark questions testing foundational concepts and objective facts.',
      'Section B & C: Objective and short answer questions. Write precise responses.',
      'Section D & E: Descriptive questions requiring structured explanations, formulas or diagrams.',
      `Strictly adheres to official CBSE / NCERT ${classLabel} ${subject} curriculum.`,
    ],
    board: 'CBSE',
    questions,
  };
};
