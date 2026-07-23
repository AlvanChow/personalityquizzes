import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { isAnalyticsOptedOut, setAnalyticsOptOut } from '../utils/analytics';

function Section({ title, children }) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-extrabold text-gray-900 mb-3">{title}</h2>
      <div className="space-y-3 text-sm leading-6 text-gray-600">{children}</div>
    </section>
  );
}

export default function Privacy() {
  const [optedOut, setOptedOutState] = useState(() => isAnalyticsOptedOut());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = 'Privacy & Data — My Personality Quizzes';
  }, []);

  function changeAnalyticsPreference(nextValue) {
    const persisted = setAnalyticsOptOut(nextValue);
    setOptedOutState(persisted);
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-cream-50 px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Privacy &amp; data</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated July 23, 2026</p>
        </div>

        <Section title="What the site collects">
          <p>
            You can take quizzes without an account. Quiz answers and guest results stay in your browser
            unless you choose to create a public share link.
          </p>
          <p>
            If you sign in with Google, the site receives your account email, name, profile image, and a
            Google account identifier. It stores your saved quiz results so you can reopen them on another
            device. Your account email is not marketing consent, and the site does not promise to email
            quiz results.
          </p>
          <p>
            Product analytics can include a random session ID, pages and buttons used, quiz lifecycle
            events, browser, operating system, language, time zone, viewport and screen dimensions, and
            your user ID when signed in. The site does not use analytics for advertising.
          </p>
        </Section>

        <Section title="Public sharing">
          <p>
            Creating a share link publishes the quiz name, result name, result emoji, short result copy,
            and the scores needed to display that result. Anyone with the link can view it. Do not share a
            link if you want the result to remain private.
          </p>
          <p>
            New share links use unguessable 128-bit identifiers. The database validates every shared
            quiz/result combination and supplies the public result copy from a server-controlled catalog.
          </p>
        </Section>

        <Section title="Service providers">
          <p>
            Supabase provides authentication and database storage. Google provides optional sign-in.
            Cloudflare delivers the site and may process network information such as IP addresses for
            security, rate limiting, and delivery. Each provider processes data under its own terms and
            privacy practices.
          </p>
        </Section>

        <Section title="Retention and control">
          <p>
            Account information and saved quiz results remain until the account or associated data is
            deleted. Public shares remain available until they are removed. Raw product analytics and quiz
            ratings are kept for product improvement and are deleted or aggregated after 12 months.
            Security rate-limit records expire after they are no longer needed.
          </p>
          <p>
            Browser storage holds guest results, theme preference, analytics preference, and authentication
            state. You can clear site data in your browser. To request access, correction, or deletion,
            email{' '}
            <a className="font-bold text-sky-700 hover:underline" href="mailto:privacy@mypersonalityquizzes.com">
              privacy@mypersonalityquizzes.com
            </a>.
          </p>
        </Section>

        <Section title="Analytics preference">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-900">Disable product analytics on this browser</p>
              <p className="text-xs text-gray-500 mt-1">
                Essential authentication, saved results, public sharing, and abuse prevention still work.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={optedOut}
              onClick={() => changeAnalyticsPreference(!optedOut)}
              className={`relative shrink-0 w-14 h-8 rounded-full transition-colors ${
                optedOut ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  optedOut ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
              <span className="sr-only">{optedOut ? 'Analytics disabled' : 'Analytics enabled'}</span>
            </button>
          </div>
          {saved && (
            <p className="text-xs font-bold text-emerald-700" role="status">
              Preference saved. Analytics are {optedOut ? 'disabled' : 'enabled'} on this browser.
            </p>
          )}
        </Section>
      </div>
    </main>
  );
}
