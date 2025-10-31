import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  // FIX: Replaced the constructor with a state property initializer for correctness and simplicity.
  // This ensures `this.state` is properly typed and initialized on the component instance.
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="fixed inset-0 bg-stone-950 text-gray-200 flex flex-col items-center justify-center p-4 text-center z-50">
           <h1 className="font-orbitron text-4xl font-bold text-red-500">System Malfunction</h1>
           <p className="mt-4 text-lg text-gray-400">A critical error occurred while loading the application.</p>
           <p className="mt-2 text-sm text-gray-500">Please check the developer console for more details and try refreshing the page.</p>
           {this.state.error && (
              <pre className="mt-6 p-4 bg-black/50 border border-red-500/50 rounded-lg text-left text-red-400 text-xs overflow-auto max-w-2xl">
                {this.state.error.toString()}
              </pre>
           )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
