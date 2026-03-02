import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6">
          <div className="flex flex-col items-center gap-6 rounded-[16px] bg-white p-10 text-center shadow-lg">
            {/* Warning icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86l-8.6 14.86A1.98 1.98 0 003.4 21h17.2a1.98 1.98 0 001.71-2.28L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold text-text">
                Quelque chose s'est mal passe
              </h1>
              <p className="text-sm text-text/60">
                Veuillez recharger l'application
              </p>
            </div>

            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-[12px] bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              Recharger
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
