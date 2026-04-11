import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Only log full error details in development to avoid leaking stack
    // traces or internal paths to the browser console in production.
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
          <div className="max-w-md w-full text-center">
            <p className="text-5xl mb-4">😅</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-6">
              An unexpected error occurred. Refreshing the page should fix it.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-coral-500 text-white font-semibold rounded-lg hover:bg-coral-600 transition-colors"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
