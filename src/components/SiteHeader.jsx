import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Users, Moon, Sun } from 'lucide-react';
import UserMenu from './UserMenu';

const NAV = [
  { label: 'Quizzes', to: '/', match: (p) => p === '/' },
  { label: 'Circle', to: '/circle', match: (p) => p.startsWith('/circle'), icon: Users },
  // Hot Takes lives as a card in the catalog, not a top-level destination.
  { label: 'My Results', to: '/dashboard', match: (p) => p.startsWith('/dashboard') },
];

// Global top bar. Quiz-taking routes keep their own minimal chrome so the
// question flow stays focused; everywhere else this is the site's spine.
const HIDDEN_PREFIXES = ['/quiz/', '/assessment', '/admin'];

// Light/dark toggle. The html.dark class is applied pre-paint by index.html;
// this button flips it and persists the choice.
function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('pq_theme', next ? 'dark' : 'light'); } catch { /* fine */ }
  }
  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-900/5 transition-colors"
    >
      {dark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
    </button>
  );
}

export default function SiteHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 py-3 border-b border-gray-200 bg-white/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 shrink-0"
          aria-label="My Personality Quizzes home"
        >
          <Sparkles className="w-5 h-5 text-coral-500" />
          <span className="text-lg font-bold tracking-tight text-gray-900 hidden md:inline">
            My Personality Quizzes
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900 hidden sm:inline md:hidden">MPQ</span>
        </button>

        <nav aria-label="Primary" className="flex items-center gap-0.5 sm:gap-2">
          {NAV.map(({ label, to, match, icon: Icon, desktopOnly }) => {
            const active = match(pathname);
            return (
              <button
                key={to}
                onClick={() => navigate(to)}
                aria-current={active ? 'page' : undefined}
                className={`${desktopOnly ? 'hidden sm:flex' : 'flex'} whitespace-nowrap px-2 sm:px-3 py-2 rounded-lg text-sm font-semibold transition-colors items-center gap-1.5 ${
                  active
                    ? 'text-gray-900 bg-gray-900/5'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-900/5'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
