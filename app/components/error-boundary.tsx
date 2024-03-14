//error-boundary.tsx
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // You can render any custom fallback UI
      return <h2>Something went wrong: {this.state.error.message}</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;