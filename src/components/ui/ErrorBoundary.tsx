import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, RefreshCw } from 'lucide-react';
import { dataRepository } from '../../data';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Uygulama genelinde beklenmedik render hatalarını yakalar ve kullanıcıya
 * beyaz ekran yerine kurtarma seçenekleri sunar. Bozuk veri kalıcı çökmeye
 * yol açmaz; kullanıcı devtools'a gerek kalmadan sıfırlayabilir.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uygulama hatası yakalandı:', error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReset = () => {
    // Silme başarısız olsa bile yeniden yükle; repository hatayı loglar
    dataRepository.clear().finally(() => window.location.reload());
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="glass-strong w-full max-w-md rounded-2xl p-6 text-center shadow-glass">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-500/10 text-red-400">
            <AlertTriangle size={26} />
          </span>
          <h1 className="mt-4 font-display text-xl font-bold text-discord-text">
            Bir şeyler ters gitti
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-discord-muted">
            Uygulamada beklenmedik bir hata oluştu. Tekrar deneyebilir ya da verileri
            sıfırlayıp yeniden başlatabilirsiniz.
          </p>

          {this.state.error?.message && (
            <p className="mt-3 truncate rounded-lg bg-white/[0.03] px-3 py-2 font-mono text-xs text-discord-faint">
              {this.state.error.message}
            </p>
          )}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-discord-blurple px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-discord-blurple-hover"
            >
              <RefreshCw size={16} /> Tekrar Dene
            </button>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-discord-border bg-discord-elevated px-4 py-2.5 text-sm font-medium text-discord-text transition-colors hover:bg-discord-hover"
            >
              <RotateCcw size={16} /> Verileri Sıfırla ve Yenile
            </button>
          </div>
        </div>
      </div>
    );
  }
}
