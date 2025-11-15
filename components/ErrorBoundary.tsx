import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  // FIX: Initialize state as a class property. This is a more modern approach
  // and can resolve issues with some TypeScript configurations not recognizing
  // state initialized within the constructor. This fixes the errors related to
  // `this.state` and `this.props` not being found on the component type.
  state: State = { hasError: false };

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for debugging
    console.error("Uncaught error:", error, errorInfo);
    
    // Reset error state after a delay to allow recovery
    setTimeout(() => {
      this.setState({ hasError: false });
    }, 5000);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center text-center p-4 bg-light-primary dark:bg-dark-primary">
            <div className="max-w-md">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong.</h1>
                <p className="mt-2 text-medium-dark-text dark:text-medium-text mb-6">
                  An unexpected error occurred. The page will automatically recover in a few seconds, or you can refresh the page.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary px-6 py-2"
                >
                  Refresh Page
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
