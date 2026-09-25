export type ClassLevel = 
  | 'LKG' | 'UKG' 
  | '1' | '2' | '3' | '4' | '5' 
  | '6' | '7' | '8' | '9' | '10';

export type Subject = 
  | 'English' | 'Hindi' | 'Mathematics' 
  | 'Science' | 'Social Science' | 'EVS'
  | 'Computer Science' | 'Sanskrit';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ExamType = 
  | '1st-internal' 
  | '2nd-internal' 
  | '3rd-internal' 
  | 'annual';

export type EducationBoard = 
  | 'CBSE' 
  | 'ICSE' 
  | 'ISC' 
  | 'IB' 
  | 'Cambridge' 
  | 'NIOS';

export interface BoardInfo {
  id: EducationBoard;
  name: string;
  fullName: string;
  description: string;
  country: string;
}

export interface Question {
  id: string;
  question: string;
  options?: string[];
  answer?: string;
  marks: number;
  type: 'mcq' | 'short' | 'long' | 'fill-blank' | 'match' | 'true-false';
  difficulty: Difficulty;
  chapter: string;
  subject?: Subject;
  classLevel?: ClassLevel;
  board?: EducationBoard;
}

export interface QuestionPaper {
  id: string;
  title: string;
  class: ClassLevel;
  subject: Subject;
  examType: ExamType;
  difficulty: Difficulty;
  totalMarks: number;
  duration: string;
  questions: Question[];
  instructions: string[];
  board?: EducationBoard;
}

export interface Chapter {
  id: string;
  name: string;
  subject: Subject;
  board?: EducationBoard;
  textbook?: string;
  edition?: string;
  sections?: string[];
  concepts?: string[];
  learningOutcomes?: string[];
  sourceUrl?: string;
}

export interface TextbookCatalog {
  board: EducationBoard;
  chapters: Chapter[];
  source: 'verified' | 'local-fallback';
  updatedAt?: string;
}

export const CLASS_LEVELS: ClassLevel[] = [
  'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
];

export const EDUCATION_BOARDS: BoardInfo[] = [
  { id: 'CBSE', name: 'CBSE', fullName: 'Central Board of Secondary Education', description: 'National board following NCERT curriculum', country: 'India' },
  { id: 'ICSE', name: 'ICSE', fullName: 'Indian Certificate of Secondary Education', description: 'Council for Indian School Certificate Examinations (Class 1-10)', country: 'India' },
  { id: 'ISC', name: 'ISC', fullName: 'Indian School Certificate', description: 'Council for Indian School Certificate Examinations (Class 11-12)', country: 'India' },
  { id: 'IB', name: 'IB', fullName: 'International Baccalaureate', description: 'International curriculum with inquiry-based learning', country: 'International' },
  { id: 'Cambridge', name: 'Cambridge', fullName: 'Cambridge Assessment International Education (CAIE)', description: 'British curriculum with IGCSE and A-Levels', country: 'International' },
  { id: 'NIOS', name: 'NIOS', fullName: 'National Institute of Open Schooling', description: 'Open and distance learning board', country: 'India' },
];

export const SUBJECTS_BY_CLASS: Record<ClassLevel, Subject[]> = {
  'LKG': ['English', 'Hindi', 'Mathematics', 'EVS'],
  'UKG': ['English', 'Hindi', 'Mathematics', 'EVS'],
  '1': ['English', 'Hindi', 'Mathematics', 'EVS'],
  '2': ['English', 'Hindi', 'Mathematics', 'EVS'],
  '3': ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer Science'],
  '4': ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer Science'],
  '5': ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer Science'],
  '6': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Computer Science'],
  '7': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Computer Science'],
  '8': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Computer Science'],
  '9': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science'],
  '10': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science'],
};

export const EXAM_TYPES: { id: ExamType; name: string; marks: number; month: string }[] = [
  { id: '1st-internal', name: '1st Internal', marks: 20, month: 'July-August' },
  { id: '2nd-internal', name: '2nd Internal', marks: 20, month: 'October-November' },
  { id: '3rd-internal', name: '3rd Internal', marks: 20, month: 'December-January' },
  { id: 'annual', name: 'Annual Exam', marks: 80, month: 'March-April' },
];

export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'difficulty-easy' },
  medium: { label: 'Medium', color: 'difficulty-medium' },
  hard: { label: 'Hard', color: 'difficulty-hard' },
};
