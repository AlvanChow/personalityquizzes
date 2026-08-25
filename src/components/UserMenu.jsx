import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { LogOut, User, UserCircle, Shield, Users } from 'lucide-react';
import { devError } from '../utils/devLog';
import SignInButtons from './SignInButtons';

export default function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // When the menu opens, move focus into it (roving focus for keyboard users).
  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector('[role="menuitem"]')?.focus();
  }, [open]);

  // Arrow / Home / End navigation between menu items.
  function handleMenuKeyDown(e) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    const items = Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? []);
    if (!items.length) return;
    e.preventDefault();
    const cur = items.indexOf(document.activeElement);
    let next = 0;
    if (e.key === 'ArrowDown') next = cur < 0 ? 0 : (cur + 1) % items.length;
    else if (e.key === 'ArrowUp') next = cur <= 0 ? items.length - 1 : cur - 1;
    else if (e.key === 'End') next = items.length - 1;
    items[next].focus();
  }

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />;
  }

  if (!user) {
    // One "Sign in" button; the popover offers both providers stacked at equal
    // prominence, which is what App Store Guideline 4.8 actually requires —
    // two logo pills in the header read as clutter, not as a choice.
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          aria-haspopup="menu"
          aria-expanded={open}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-gray-300 shadow-sm hover:border-gray-400 hover:shadow-md transition-all duration-200 text-sm font-semibold text-gray-900 whitespace-nowrap"
        >
          <UserCircle className="w-5 h-5" />
          Sign in
        </button>
        {open && (
          <div role="menu" aria-label="Sign in" className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-md border border-gray-200 p-3 z-50">
            <SignInButtons layout="stacked" onStart={() => setOpen(false)} />
          </div>
        )}
      </div>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2.5 px-2 py-1.5 pr-4 rounded-lg bg-white border border-gray-300 shadow-sm hover:border-gray-400 hover:shadow-md transition-all duration-200"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${displayName}'s avatar`}
            className="w-7 h-7 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-sky-500" />
          </div>
        )}
        <span className="text-sm font-semibold text-gray-700 hidden sm:inline max-w-[120px] truncate">
          {displayName}
        </span>
      </button>

      {open && (
        <div role="menu" aria-label="Account" onKeyDown={handleMenuKeyDown} className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-md border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              navigate('/profile');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <UserCircle className="w-4 h-4" />
            My Profile
          </button>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              navigate('/circle');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Users className="w-4 h-4" />
            My Circle
          </button>
          {isAdmin && (
            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                navigate('/admin');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-sky-600 hover:bg-sky-50 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Admin Dashboard
            </button>
          )}
          <button
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              try {
                await signOut();
              } catch (err) {
                devError('Sign out failed:', err);
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors border-t border-gray-200"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
