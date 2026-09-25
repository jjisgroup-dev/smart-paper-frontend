import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CLASS_LEVELS } from '@/types';
import { fetchLatestSyllabus, readSyllabus, SyllabusCatalog } from '@/lib/syllabus';

const Syllabus = () => {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<SyllabusCatalog>(readSyllabus);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncSyllabus = async () => {
    setIsSyncing(true);
    try {
      setCatalog(await fetchLatestSyllabus());
      toast.success('Syllabus updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update syllabus');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <PageLayout title="Syllabus" showSearch>
      <div className="container px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-xl font-bold mb-1">NCERT Syllabus</h1>
          <p className="text-muted-foreground text-sm">
            Complete chapter-wise syllabus for all classes
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" onClick={syncSyllabus} disabled={isSyncing}>
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Updating' : 'Update syllabus'}
            </Button>
            <span className="text-xs text-muted-foreground">Use a verified dataset endpoint configured by the school.</span>
          </div>
        </motion.div>

        <div className="space-y-4">
          {CLASS_LEVELS.map((level, index) => (
            <motion.div
              key={level}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden"
            >
              <div className="p-4 bg-primary/5 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{level === 'LKG' || level === 'UKG' ? level : `Class ${level}`}</h3>
                  <p className="text-xs text-muted-foreground">
                    {catalog[level]?.length || 0} Subjects
                  </p>
                </div>
              </div>
              <div className="p-2">
                {catalog[level]?.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => navigate(`/syllabus/${level}/${encodeURIComponent(subject)}`)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{subject}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Syllabus;
