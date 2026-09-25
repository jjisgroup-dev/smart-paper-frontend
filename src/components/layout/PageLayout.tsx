import { ReactNode, forwardRef } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showBottomNav?: boolean;
  showFooter?: boolean;
}

export const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ children, title, showBack = false, showSearch = false, showBottomNav = true, showFooter = false }, ref) => {
    return (
      <div ref={ref} className="min-h-screen flex flex-col bg-background">
        <Header title={title} showBack={showBack} showSearch={showSearch} />
        <main className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
          {children}
          {showFooter && <Footer />}
        </main>
        {showBottomNav && <BottomNav />}
      </div>
    );
  }
);

PageLayout.displayName = 'PageLayout';
