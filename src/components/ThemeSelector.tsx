import { Moon, Sun, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../styles/themes';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const themes: Array<{ id: Theme; label: string; icon: React.ReactNode; description: string }> = [
    { id: 'light', label: '🌞 Light', icon: <Sun size={20} />, description: 'Bright and professional' },
    { id: 'dark', label: '🌙 Dark', icon: <Moon size={20} />, description: 'Modern Discord style' },
    { id: 'midnight', label: '🌌 Midnight', icon: <Zap size={20} />, description: 'Premium default' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Theme
        </label>

        <div className="grid grid-cols-3 gap-3">
          {themes.map(({ id, label, icon, description }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                ${
                  theme === id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-transparent hover:border-purple-400'
                }
              `}
              style={{
                backgroundColor:
                  theme === id
                    ? 'var(--color-primary-light)'
                    : 'var(--color-surface)',
                borderColor: theme === id ? 'var(--color-primary)' : 'var(--color-border)',
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div style={{ color: 'var(--color-primary)' }}>{icon}</div>
                <div className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {label}
                </div>
                <div
                  className="text-xs"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {description}
                </div>
              </div>

              {theme === id && (
                <div
                  className="absolute top-2 right-2 w-3 h-3 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Preview Cards */}
      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>
          Preview
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-3 rounded-lg border"
            style={{
              backgroundColor: 'var(--color-cards)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <div className="text-xs font-medium mb-1">Sample Card</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Secondary text
            </div>
          </div>

          <button
            className="p-3 rounded-lg font-medium text-sm transition-colors duration-200"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            }}
          >
            Sample Button
          </button>
        </div>
      </div>
    </div>
  );
}
