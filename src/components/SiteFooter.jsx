import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} My Personality Quizzes</p>
        <nav aria-label="Footer" className="flex items-center gap-5">
          <Link to="/privacy" className="font-semibold hover:text-gray-900 transition-colors">
            Privacy &amp; data
          </Link>
          <a
            href="mailto:privacy@mypersonalityquizzes.com"
            className="font-semibold hover:text-gray-900 transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
