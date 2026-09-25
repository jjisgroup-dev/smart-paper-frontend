import { ArrowLeft, Menu, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { SearchModal } from '@/components/SearchModal';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
}

export const Header = ({ title = 'Question Paper Studio', showBack = false, showSearch = false }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (!showSearch) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'My Papers', path: '/my-papers' },
    { label: 'Syllabus', path: '/syllabus' },
    { label: 'Generate with AI', path: '/generate' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-card border-b">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {showBack ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="h-9 w-9"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            ) : (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Question Paper Studio</h2>
                    <p className="text-sm text-muted-foreground mt-1">Teacher workspace</p>
                  </div>
                  <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                          location.pathname === item.path
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
            <h1 className="font-semibold text-lg truncate">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            {showSearch && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="h-9 w-9 hover:bg-primary/10 transition-colors cursor-pointer"
                title="Search classes, subjects & papers (Ctrl+K)"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {showSearch && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </>
  );
};
