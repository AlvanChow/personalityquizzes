import { useEffect } from 'react';
import { Link } from 'react-router';
import { LifeBuoy } from 'lucide-react';

/**
 * Support page.
 *
 * App Store Connect requires a Support **URL** — a reachable web page, not a
 * mailto: — for every app, and reviewers do open it. It doubles as the page
 * Guideline 5.1.1(v) reviewers land on when looking for how account deletion
 * works, so the deletion path is spelled out step by step rather than linked to.
 */

function Section({ title, children }) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-extrabold text-gray-900 mb-3">{title}</h2>
      <div className="space-y-3 text-sm leading-6 text-gray-600">{children}</div>
    </section>
  );
}

const SUPPORT_EMAIL = 'privacy@mypersonalityquizzes.com';

export default function Support() {
  useEffect(() => {
    document.title = 'Support — My Personality Quizzes';
  }, []);

  return (
    <main className="min-h-screen bg-cream-50 px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-4">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Support</h1>
          <p className="text-sm text-gray-500 mt-2">
            Questions, problems, or requests about your data — start here.
          </p>
        </div>

        <Section title="Get in touch">
          <p>
            Email{' '}
            <a
              className="font-bold text-sky-700 hover:underline"
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              {SUPPORT_EMAIL}
            </a>{' '}
            and we will get back to you. Telling us which quiz you were taking, and
            whether you were on the website or the iOS app, usually turns a
            back-and-forth into a single reply.
          </p>
        </Section>

        <Section title="Signing in">
          <p>
            Sign-in is handled by Google or Apple — there is no separate password to
            forget. If you signed up with one and then try the other, you will land in
            a second, empty account, because they are different identities as far as we
            are concerned. Sign out and use whichever you started with.
          </p>
          <p>
            Choosing <strong>Hide My Email</strong> with Apple works fine; results save
            against the relay address exactly as they would against a real one.
          </p>
        </Section>

        <Section title="Deleting your account">
          <p>You can do this yourself, at any time, without contacting us:</p>
          <ol className="list-decimal list-inside space-y-1 font-semibold text-gray-700">
            <li>Sign in.</li>
            <li>Open the account menu in the top right.</li>
            <li>Choose <strong>Profile</strong>.</li>
            <li>Scroll to <strong>Delete Account</strong>.</li>
            <li>Type <strong>DELETE</strong> to confirm.</li>
          </ol>
          <p>
            That permanently removes your account, profile, saved quiz results, Circle
            connections, and any share links you created — links you have already sent
            to friends will stop working. It cannot be undone. What is kept, and why, is
            set out on the{' '}
            <Link className="font-bold text-sky-700 hover:underline" to="/privacy">
              privacy page
            </Link>.
          </p>
        </Section>

        <Section title="Your results and your data">
          <p>
            Quiz results save automatically once you are signed in. Results you produced
            as a guest live in that browser only, and are claimed by the account the
            first time you sign in from it.
          </p>
          <p>
            To request access to or correction of your data, or to turn off product
            analytics, see the{' '}
            <Link className="font-bold text-sky-700 hover:underline" to="/privacy">
              privacy page
            </Link>
            , which has an analytics opt-out you can toggle yourself.
          </p>
        </Section>

        <Section title="The iOS app">
          <p>
            The app runs the same quizzes as the website against the same account, so
            signing in on one shows your results on the other. Quizzes can be taken
            offline; saving results, sharing, and Circle need a connection.
          </p>
          <p>
            If sign-in opens a browser and does not come back, close the app fully and
            reopen it before trying again — and tell us the device and iOS version if it
            keeps happening.
          </p>
        </Section>
      </div>
    </main>
  );
}
