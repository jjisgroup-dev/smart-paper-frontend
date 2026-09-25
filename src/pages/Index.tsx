import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, FileText, Sparkles, WandSparkles } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ClassCard } from '@/components/ClassCard';
import { CLASS_LEVELS } from '@/types';

const Index = () => {
  const navigate = useNavigate();

  return (
    <PageLayout title="Question Paper Studio" showSearch>
      <div className="landing-page">
        <section className="landing-hero">
          <div className="landing-hero-grid" />
          <div className="container relative px-4 py-10 md:py-14">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-3xl"
            >
              <div className="landing-kicker"><Sparkles className="h-4 w-4" /> Teacher's paper desk</div>
              <h1 className="landing-title">Make every exam<br /><span>worth preparing for.</span></h1>
              <p className="landing-copy">Build clear, curriculum-aligned question papers for every class, subject and exam format.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => navigate('/generate')} className="landing-primary-action"><WandSparkles className="h-5 w-5" />Generate with AI<ArrowUpRight className="h-4 w-4" /></button>
                <button onClick={() => document.getElementById('class-selection')?.scrollIntoView({ behavior: 'smooth' })} className="landing-secondary-action"><BookOpen className="h-5 w-5" />Choose a class</button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30, rotate: 3 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.65 }}
              className="landing-paper-preview"
              aria-hidden="true"
            >
              <div className="landing-paper-top"><span>QUESTION PAPER</span><span>2026</span></div>
              <div className="landing-paper-lines"><i /><i /><i /><i /><i /><i /></div>
              <div className="landing-paper-badge">A4 READY</div>
            </motion.div>
          </div>
        </section>

        <main className="container px-4 py-8 md:py-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="landing-stats"
          >
            {[{ label: 'Subjects', value: '8+', icon: BookOpen }, { label: 'Question formats', value: '6', icon: FileText }, { label: 'Classes', value: 'LKG–10', icon: Sparkles }].map(({ label, value, icon: Icon }) => (
              <div key={label} className="landing-stat"><Icon className="h-5 w-5" /><div><strong>{value}</strong><span>{label}</span></div></div>
            ))}
          </motion.div>

          <div id="class-selection" className="mb-6 scroll-mt-20">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div><p className="landing-section-label">Start here</p><h2 className="text-2xl font-bold text-foreground">Choose your class</h2></div>
              <span className="hidden text-sm text-muted-foreground sm:block">Tap a class to explore subjects</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CLASS_LEVELS.map((level, index) => (
              <ClassCard
                key={level}
                classLevel={level}
                index={index}
                onClick={() => navigate(`/class/${level}`)}
              />
            ))}
            </div>
          </div>
        </main>
      </div>
    </PageLayout>
  );
};

export default Index;
