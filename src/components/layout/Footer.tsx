import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, GraduationCap } from 'lucide-react';
import { CLASS_LEVELS, ClassLevel, SUBJECTS_BY_CLASS } from '@/types';

export const Footer = () => {
  const navigate = useNavigate();

  const getClassLabel = (level: ClassLevel) => {
    if (level === 'LKG' || level === 'UKG') return level;
    return `Class ${level}`;
  };

  return (
    <footer className="w-full bg-card/80 border-t border-border mt-auto pt-8 pb-12 transition-colors">
      <div className="container px-4">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-1.5">
                Class-Wise NCERT Question Papers
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                  Instant • No AI Delay
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Authentic, subject-specific NCERT questions & answers for CBSE curriculum
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground/80 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Select any class below to view papers
          </span>
        </div>

        {/* Class-wise Independent Buttons (LKG to Class 10) */}
        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Quick Class Navigation (LKG – Class 10)
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
            {CLASS_LEVELS.map((level) => {
              const label = getClassLabel(level);
              const subjectCount = SUBJECTS_BY_CLASS[level]?.length || 4;

              return (
                <button
                  key={level}
                  onClick={() => navigate(`/class/${level}`)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-border/80 bg-background/60 hover:bg-primary/10 hover:border-primary/50 hover:shadow-sm active:scale-95 transition-all text-center group cursor-pointer"
                  title={`View NCERT papers for ${label}`}
                  aria-label={`Navigate to ${label} question papers`}
                >
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {label}
                  </span>
                  <span className="text-[11px] text-muted-foreground group-hover:text-primary/80 transition-colors mt-0.5">
                    {subjectCount} Subjects
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer bottom metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Smart Paper Studio &bull; Real NCERT Syllabus &amp; Question Papers</span>
          </div>
          <div>
            <span>CBSE / NCERT Standardized Assessment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
