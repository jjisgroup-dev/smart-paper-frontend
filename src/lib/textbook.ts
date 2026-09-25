import { Chapter, ClassLevel, EducationBoard, Subject, TextbookCatalog } from '@/types';
import { sampleChapters } from '@/data/sampleQuestions';

const textbookUrl = import.meta.env.VITE_TEXTBOOK_DATA_URL as string | undefined;
const cachePrefix = 'question-paper-studio-textbook-';

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isChapter = (value: unknown, subject: Subject): value is Chapter => {
  if (!value || typeof value !== 'object') return false;
  const chapter = value as Partial<Chapter>;
  return typeof chapter.id === 'string'
    && typeof chapter.name === 'string'
    && chapter.subject === subject
    && (!chapter.sections || isStringArray(chapter.sections))
    && (!chapter.concepts || isStringArray(chapter.concepts))
    && (!chapter.learningOutcomes || isStringArray(chapter.learningOutcomes));
};

const cacheKey = (board: EducationBoard, classLevel: ClassLevel, subject: Subject) =>
  `${cachePrefix}${board}-${classLevel}-${subject}`;

const fallbackCatalog = (classLevel: ClassLevel, subject: Subject): TextbookCatalog => ({
  board: 'CBSE',
  chapters: sampleChapters[`${subject}-${classLevel}`] || [],
  source: 'local-fallback',
});

export const getTextbookCatalog = async (
  classLevel: ClassLevel,
  subject: Subject,
  board: EducationBoard = 'CBSE',
): Promise<TextbookCatalog> => {
  const fallback = fallbackCatalog(classLevel, subject);
  const key = cacheKey(board, classLevel, subject);

  try {
    const cached = window.localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached) as Partial<TextbookCatalog>;
      if (parsed.board === board && Array.isArray(parsed.chapters) && parsed.chapters.every((chapter) => isChapter(chapter, subject))) {
        return { ...parsed, board, chapters: parsed.chapters, source: 'verified' } as TextbookCatalog;
      }
    }
  } catch {
    // Ignore invalid local cache and continue with the network/fallback path.
  }

  if (!textbookUrl) return fallback;

  const response = await fetch(`${textbookUrl}?board=${encodeURIComponent(board)}&classLevel=${encodeURIComponent(classLevel)}&subject=${encodeURIComponent(subject)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Textbook data request failed (${response.status}).`);

  const payload = await response.json() as Partial<TextbookCatalog>;
  if (payload.board !== board || !Array.isArray(payload.chapters) || !payload.chapters.every((chapter) => isChapter(chapter, subject))) {
    throw new Error('Textbook data is incomplete or uses an unsupported format.');
  }

  const catalog: TextbookCatalog = {
    board,
    chapters: payload.chapters,
    source: 'verified',
    updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : new Date().toISOString(),
  };
  window.localStorage.setItem(key, JSON.stringify(catalog));
  return catalog;
};