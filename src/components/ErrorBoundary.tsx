import React from 'react';
// Theme removed for simplicity in fallback to avoid context/hook related errors

interface ErrorBoundaryState { hasError: boolean; error?: Error; }

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <Fallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

function Fallback({ error }: { error?: Error }) {
  return (
    <div style={{ backgroundColor: '#E8F6F8' }} className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full p-6 rounded-2xl shadow" style={{ backgroundColor: 'white' }}>
        <h1 className="text-xl font-semibold mb-2" style={{ color: '#2D7A8B' }}>Something went wrong</h1>
        <p className="text-sm mb-4" style={{ color: '#2D7A8B' }}>An unexpected error occurred. You can try reloading the app. If the issue persists, clearing local data may help.</p>
        {error && (
          <div className="mb-4">
            <pre className="text-xs overflow-auto max-h-40 p-2 rounded mb-2" style={{ backgroundColor: '#F5F8FA', color: '#C24141' }}>
              {error.message}
            </pre>
            <pre className="text-xs overflow-auto max-h-60 p-2 rounded" style={{ backgroundColor: '#F5F8FA', color: '#666' }}>
              {error.stack}
            </pre>
          </div>
        )}
        <div className="mt-4 flex gap-3">
          <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: '#4FB3C5', color: 'white' }}>Reload</button>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: '#FF6B6B', color: 'white' }}>Clear Local Data</button>
        </div>
      </div>
    </div>
  );
}
