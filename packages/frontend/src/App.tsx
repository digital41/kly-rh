import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AppRouter } from './router';

export default function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}
