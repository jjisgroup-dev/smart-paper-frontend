import { CLASS_LEVELS, ClassLevel, Subject, SUBJECTS_BY_CLASS } from '@/types';

export type SyllabusCatalog = Record<ClassLevel, Subject[]>;
export const SYLLABUS_STORAGE_KEY = 'question-paper-studio-syllabus';
const syllabusUrl = import.meta.env.VITE_SYLLABUS_URL as string | undefined;

export const defaultSyllabus: SyllabusCatalog = SUBJECTS_BY_CLASS;

export const readSyllabus = (): SyllabusCatalog => {
  try {
    const saved = window.localStorage.getItem(SYLLABUS_STORAGE_KEY);
    return saved ? { ...defaultSyllabus, ...JSON.parse(saved) } : defaultSyllabus;
  } catch {
    return defaultSyllabus;
  }
};

export const fetchLatestSyllabus = async (): Promise<SyllabusCatalog> => {
  if (!syllabusUrl) {
    window.localStorage.setItem(SYLLABUS_STORAGE_KEY, JSON.stringify(defaultSyllabus));
    return defaultSyllabus;
  }
  const response = await fetch(syllabusUrl, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Syllabus sync failed (${response.status}).`);
  const payload = await response.json() as Partial<SyllabusCatalog>;
  const catalog = CLASS_LEVELS.reduce((result, level) => {
    result[level] = Array.isArray(payload[level]) ? payload[level] as Subject[] : defaultSyllabus[level];
    return result;
  }, {} as SyllabusCatalog);
  window.localStorage.setItem(SYLLABUS_STORAGE_KEY, JSON.stringify(catalog));
  return catalog;
};
