import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';
import {
  createShareableLink,
  getShareText,
  openTwitterShare,
  openWhatsAppShare,
} from '../utils/sharing';

// Twitter/X SVG icon (lucide doesn't have one post-rebrand)
function XIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// WhatsApp SVG icon
function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/**
 * SharePanel — drop-in replacement for the old inline share button.
 *
 * Props:
 *   quizType  — 'mbti' | 'enneagram' | 'cake' | 'big5'
 *   result    — the result object from localStorage (must have .name, .emoji, etc.)
 *   className — optional extra classes for the trigger button
 *   btnColor  — Tailwind gradient classes for the trigger button (defaults to coral)
 */
export default function SharePanel({ quizType, result, className = '', btnColor = 'from-coral-400 to-coral-500' }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen]       = useState(false);
  const [shareUrl, setShareUrl]   = useState(null);
  const [isCreating, setCreating] = useState(false);
  const [copied, setCopied]       = useState(false);
  const [error, setError]         = useState(null);

  async function openPanel() {
    setIsOpen(true);
    if (shareUrl) return; // already created in this session

    setCreating(true);
    setError(null);
    try {
      const url = await createShareableLink(quizType, result);
      if (url) {
        setShareUrl(url);
        track('share_link_created', { quiz: quizType }, user?.id ?? null);
      } else {
        setError('Could not create share link. Try copying the page URL instead.');
      }
    } catch (err) {
      console.error('[SharePanel] createShareableLink threw:', err);
      setError('Could not create share link.');
    } finally {
      setCreating(false);
    }
  }

  function close() { setIsOpen(false); }

  async function handleCopy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      track('share_button_clicked', { quiz: quizType, platform: 'copy' }, user?.id ?? null);
    } catch {
      // Clipboard API unavailable — nothing was copied, so don't show success feedback.
      // The URL is visible in the panel for manual copying.
    }
  }

  function handleTwitter() {
    if (!shareUrl) return;
    const text = getShareText('twitter', result, shareUrl, quizType);
    openTwitterShare(text);
    track('share_button_clicked', { quiz: quizType, platform: 'twitter' }, user?.id ?? null);
  }

  function handleWhatsApp() {
    if (!shareUrl) return;
    const text = getShareText('whatsapp', result, shareUrl, quizType);
    openWhatsAppShare(text);
    track('share_button_clicked', { quiz: quizType, platform: 'whatsapp' }, user?.id ?? null);
  }

  return (
    <>
      {/* ── Trigger button ── */}
      <motion.button
        onClick={openPanel}
        aria-label="Share your result"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`flex-1 py-3.5 rounded-lg bg-gradient-to-r ${btnColor} text-white font-bold shadow-md flex items-center justify-center gap-2 ${className}`}
      >
        <Share2 className="w-4 h-4" />
        Share
      </motion.button>

      {/* ── Modal overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={close}
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg px-4 pb-safe"
            >
              <div className="bg-white rounded-t-2xl shadow-2xl border border-gray-100 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-extrabold text-gray-800">Share your result</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Challenge friends to find out their type</p>
                  </div>
                  <button
                    onClick={close}
                    aria-label="Close share panel"
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Result preview */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 mb-5">
                  <span className="text-2xl">{result.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-gray-800 truncate">{result.name}</p>
                    {(result.nickname ?? result.tagline) && (
                      <p className="text-xs text-gray-400 truncate">{result.nickname ?? result.tagline}</p>
                    )}
                  </div>
                </div>

                {/* Share URL preview */}
                {isCreating ? (
                  <div className="flex items-center justify-center py-3 mb-5">
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                    <span className="ml-2 text-sm text-gray-400">Creating your link…</span>
                  </div>
                ) : shareUrl ? (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 mb-5">
                    <Link className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-500 truncate flex-1 font-mono">{shareUrl}</span>
                  </div>
                ) : error ? (
                  <p className="text-xs text-red-500 mb-5 text-center">{error}</p>
                ) : null}

                {/* Action buttons */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Copy link */}
                  <button
                    onClick={handleCopy}
                    disabled={!shareUrl}
                    className="flex flex-col items-center gap-2 py-3.5 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {copied
                      ? <Check className="w-5 h-5 text-emerald-500" />
                      : <Link className="w-5 h-5 text-gray-600" />
                    }
                    <span className="text-xs font-bold text-gray-600">{copied ? 'Copied!' : 'Copy link'}</span>
                  </button>

                  {/* Twitter/X */}
                  <button
                    onClick={handleTwitter}
                    disabled={!shareUrl}
                    className="flex flex-col items-center gap-2 py-3.5 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <XIcon className="w-5 h-5 text-gray-800" />
                    <span className="text-xs font-bold text-gray-600">Post on X</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsApp}
                    disabled={!shareUrl}
                    className="flex flex-col items-center gap-2 py-3.5 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <WhatsAppIcon className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs font-bold text-gray-600">WhatsApp</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
