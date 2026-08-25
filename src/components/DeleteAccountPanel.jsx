import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { devError } from '../utils/devLog';

const CONFIRM_WORD = 'DELETE';

/**
 * In-app account deletion.
 *
 * App Store Review Guideline 5.1.1(v) requires this to be reachable from
 * inside the app — not a support email, not a web form — for any app that
 * offers account creation. It is deliberately two steps with a typed
 * confirmation, since the action is irreversible and the backing RPC
 * (delete_my_account) drops the auth row outright.
 */
export default function DeleteAccountPanel() {
  const { deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const canDelete = confirmText.trim().toUpperCase() === CONFIRM_WORD && !busy;

  async function handleDelete() {
    if (!canDelete) return;
    setBusy(true);
    setError(null);
    try {
      await deleteAccount();
      navigate('/', { replace: true });
    } catch (err) {
      devError('[profile] account deletion failed:', err);
      setError('Could not delete your account. Please try again, or contact us if it keeps failing.');
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg border border-red-200 text-red-500 font-semibold text-sm hover:border-red-300 hover:bg-red-50 transition-all"
      >
        <Trash2 className="w-4 h-4" aria-hidden="true" />
        Delete Account
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="min-w-0">
          <h2 className="text-sm font-extrabold text-red-700">Delete your account</h2>
          <p className="text-xs text-red-600 font-semibold mt-1 leading-relaxed">
            This permanently removes your profile, every quiz result, your friend
            connections, and any share links you created. Links you have already
            sent to friends will stop working. This cannot be undone.
          </p>
        </div>
      </div>

      <label htmlFor="confirm-delete" className="block text-xs font-bold text-red-700 mt-4 mb-1.5">
        Type {CONFIRM_WORD} to confirm
      </label>
      <input
        id="confirm-delete"
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck="false"
        disabled={busy}
        className="w-full px-3 py-2 rounded-lg border border-red-300 bg-white text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-60"
      />

      {error && (
        <p className="text-xs text-red-600 font-semibold mt-2" role="alert">{error}</p>
      )}

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => { setOpen(false); setConfirmText(''); setError(null); }}
          disabled={busy}
          className="flex-1 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-bold text-gray-600 hover:border-gray-400 transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={!canDelete}
          className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-bold text-white transition-colors disabled:opacity-50 disabled:hover:bg-red-500"
        >
          {busy ? 'Deleting…' : 'Delete forever'}
        </button>
      </div>
    </div>
  );
}
