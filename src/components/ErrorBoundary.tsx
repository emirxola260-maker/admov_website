import * as React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, fontFamily: 'sans-serif', background: '#1a1a1a', color: '#fff', minHeight: '100vh' }}>
          <h1 style={{ color: '#ff4444' }}>حدث خطأ!</h1>
          <pre style={{ background: '#000', padding: 15, borderRadius: 8, overflow: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20,
              padding: '10px 20px',
              background: '#5749C2',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            تحديث الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
