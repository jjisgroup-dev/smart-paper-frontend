import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  BookOpen,
  GraduationCap,
  Calculator,
  FlaskConical,
  Globe,
  Languages,
  Laptop,
  ArrowRight,
  Sparkles,
  FileText,
  Calendar,
  Layers,
  WandSparkles,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CLASS_LEVELS, ClassLevel, SUBJECTS_BY_CLASS, Subject, EXAM_TYPES } from '@/types';
import { sampleChapters } from '@/data/sampleQuestions';
import { LucideIcon } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const subjectIconMap: Record<Subject, LucideIcon> = {
  English: BookOpen,
  Hindi: Languages,
  Mathematics: Calculator,
  Science: FlaskConical,
  'Social Science': Globe,
  EVS: Globe,
  'Computer Science': Laptop,
  Sanskrit: Languages,
};

interface SearchItem {
  id: string;
  category: 'class' | 'subject' | 'chapter' | 'exam' | 'action';
  title: string;
  subtitle: string;
  badge?: string;
  icon: LucideIcon;
  path: string;
  keywords: string;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const getClassLabel = (level: ClassLevel) => {
    if (level === 'LKG' || level === 'UKG') return level;
    return `Class ${level}`;
  };

  // Build searchable database of items
  const allSearchableItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];

    // 1. Quick actions
    items.push({
      id: 'action-generate',
      category: 'action',
      title: 'Generate Question Paper with AI',
      subtitle: 'Create customized test papers using AI generator',
      badge: 'AI Tool',
      icon: WandSparkles,
      path: '/generate',
      keywords: 'generate ai create custom paper test question generator',
    });

    items.push({
      id: 'action-mypapers',
      category: 'action',
      title: 'My Papers & NCERT Blueprint',
      subtitle: 'View saved papers and class-wise NCERT question banks',
      badge: 'Papers',
      icon: FileText,
      path: '/my-papers',
      keywords: 'my papers saved question paper ncert bank blueprint',
    });

    items.push({
      id: 'action-syllabus',
      category: 'action',
      title: 'NCERT Curriculum Syllabus',
      subtitle: 'Browse all class and subject chapter syllabi',
      badge: 'Syllabus',
      icon: BookOpen,
      path: '/syllabus',
      keywords: 'syllabus chapters curriculum cbse ncert subjects',
    });

    // 2. Classes
    CLASS_LEVELS.forEach((level) => {
      const label = getClassLabel(level);
      const subCount = SUBJECTS_BY_CLASS[level]?.length || 4;
      items.push({
        id: `class-${level}`,
        category: 'class',
        title: label,
        subtitle: `${subCount} Subjects &bull; NCERT Question Papers & Blueprint`,
        badge: 'Class',
        icon: GraduationCap,
        path: `/class/${level}`,
        keywords: `${level} class ${level} standard grade kindergarten grade${level}`,
      });
    });

    // 3. Class + Subject combinations
    CLASS_LEVELS.forEach((level) => {
      const classLabel = getClassLabel(level);
      const subjects = SUBJECTS_BY_CLASS[level] || [];

      subjects.forEach((subject) => {
        const Icon = subjectIconMap[subject] || BookOpen;
        items.push({
          id: `sub-${level}-${subject}`,
          category: 'subject',
          title: `${classLabel} &bull; ${subject}`,
          subtitle: `Question papers, marking scheme & exam pattern`,
          badge: subject,
          icon: Icon,
          path: `/class/${level}/subject/${encodeURIComponent(subject)}`,
          keywords: `${classLabel} ${level} ${subject} math science english hindi evs sanskrit computer`,
        });
      });
    });

    // 4. Sample Chapters from Syllabus
    Object.entries(sampleChapters).forEach(([key, chapters]) => {
      const [subject, classLevel] = key.split('-') as [Subject, ClassLevel];
      const classLabel = getClassLabel(classLevel);
      const Icon = subjectIconMap[subject] || BookOpen;

      chapters.forEach((chapter) => {
        items.push({
          id: `ch-${chapter.id}`,
          category: 'chapter',
          title: chapter.name,
          subtitle: `${classLabel} &bull; ${subject} Chapter`,
          badge: 'Chapter',
          icon: Icon,
          path: `/class/${classLevel}/subject/${encodeURIComponent(subject)}`,
          keywords: `${chapter.name} ${classLabel} ${subject} topic lesson chapter`,
        });
      });
    });

    // 5. Exam Types
    EXAM_TYPES.forEach((exam) => {
      items.push({
        id: `exam-${exam.id}`,
        category: 'exam',
        title: `${exam.name} (${exam.marks} Marks)`,
        subtitle: `Assessment schedule: ${exam.month} &bull; CBSE pattern`,
        badge: 'Exam Type',
        icon: Calendar,
        path: '/my-papers',
        keywords: `${exam.name} ${exam.month} internal annual exam test marks assessment`,
      });
    });

    return items;
  }, []);

  // Filter items based on query
  const filteredResults = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return [];

    const tokens = clean.split(/\s+/).filter(Boolean);

    return allSearchableItems
      .filter((item) => {
        const fullString = `${item.title} ${item.subtitle} ${item.keywords}`.toLowerCase();
        return tokens.every((token) => fullString.includes(token));
      })
      .slice(0, 15);
  }, [query, allSearchableItems]);

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  const popularSearches = [
    { label: 'Class 10 Math', query: 'Class 10 Mathematics' },
    { label: 'Class 10 Science', query: 'Class 10 Science' },
    { label: 'Class 9 Math', query: 'Class 9 Mathematics' },
    { label: 'Class 6 Sanskrit', query: 'Class 6 Sanskrit' },
    { label: 'Annual Exam (80M)', query: 'Annual Exam' },
    { label: 'Chemical Reactions', query: 'Chemical Reactions' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background border-border shadow-2xl">
        <DialogTitle className="sr-only">Search Question Paper Studio</DialogTitle>
        <DialogDescription className="sr-only">
          Search for classes, subjects, chapters, and question papers
        </DialogDescription>

        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border/70 bg-card">
          <Search className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classes, subjects, chapters, question papers..."
            className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted mr-1.5 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded">
            ESC
          </kbd>
        </div>

        {/* Content Body */}
        <ScrollArea className="max-h-[65vh] p-4 overflow-y-auto">
          {query.trim().length > 0 ? (
            /* Search Results */
            filteredResults.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Matching Results ({filteredResults.length})
                </p>

                {filteredResults.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-transparent hover:border-primary/40 bg-card hover:bg-primary/5 text-left transition-all duration-150 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-105 transition-transform">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors"
                              dangerouslySetInnerHTML={{ __html: item.title }}
                            />
                            {item.badge && (
                              <Badge
                                variant="outline"
                                className="text-[10px] font-medium py-0 px-1.5 border-border/80"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p
                            className="text-xs text-muted-foreground truncate mt-0.5"
                            dangerouslySetInnerHTML={{ __html: item.subtitle }}
                          />
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            ) : (
              /* No Results State */
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                  <Search className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">No results found for &ldquo;{query}&rdquo;</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  Try searching for a class (e.g. &ldquo;Class 10&rdquo;), a subject (e.g. &ldquo;Mathematics&rdquo;), or an exam type.
                </p>
              </div>
            )
          ) : (
            /* Default / Empty State Suggestions */
            <div className="space-y-5">
              {/* Popular Searches */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setQuery(item.query)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/60 transition-colors text-foreground cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Class Shortcuts */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2.5 flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  Quick Class Navigation
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {CLASS_LEVELS.map((level) => {
                    const label = getClassLabel(level);
                    return (
                      <button
                        key={level}
                        onClick={() => handleSelect(`/class/${level}`)}
                        className="p-2 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-primary/5 text-center transition-all group cursor-pointer"
                      >
                        <span className="block text-xs font-bold text-foreground group-hover:text-primary">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  Quick Links
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSelect('/my-papers')}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-border/60 hover:bg-muted/50 text-left transition-colors cursor-pointer group"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary">My Papers</span>
                      <span className="text-[11px] text-muted-foreground block">View saved papers &amp; class formats</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelect('/syllabus')}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-border/60 hover:bg-muted/50 text-left transition-colors cursor-pointer group"
                  >
                    <BookOpen className="h-4 w-4 text-primary" />
                    <div>
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary">NCERT Syllabus</span>
                      <span className="text-[11px] text-muted-foreground block">Browse chapter curriculum</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelect('/generate')}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-border/60 hover:bg-muted/50 text-left transition-colors cursor-pointer group"
                  >
                    <WandSparkles className="h-4 w-4 text-primary" />
                    <div>
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary">AI Paper Generator</span>
                      <span className="text-[11px] text-muted-foreground block">Create customized question sets</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelect('/')}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-border/60 hover:bg-muted/50 text-left transition-colors cursor-pointer group"
                  >
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <div>
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary">Home / Studio</span>
                      <span className="text-[11px] text-muted-foreground block">Return to main dashboard</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
