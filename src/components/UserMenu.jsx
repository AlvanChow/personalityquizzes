import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, UserCircle } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function UserMenu() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
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

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />;
  }

  if (!user) {
    return (
      <button
        onClick={() => signInWithGoogle().catch((err) => console.error('Sign in failed:', err))}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-white border border-gray-300 shadow-sm hover:border-gray-400 hover:shadow-md transition-all duration-200 text-sm font-semibold text-gray-700"
      >
        <GoogleIcon />
        <span className="hidden sm:inline">Sign in</span>
      </button>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
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
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-md border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <button
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
            onClick={async () => {
              setOpen(false);
              try {
                await signOut();
              } catch (err) {
                console.error('Sign out failed:', err);
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
