'use client';

import React from 'react';
import {
  useTheme,
  usePlantColors,
  useSystemColors,
  useThemeToggle,
  useThemeSetter,
  useIsDarkTheme,
  usePlantColorVariables,
} from '@/lib/theme';

const ThemeDemo: React.FC = () => {
  const { theme } = useTheme();
  const plantColors = usePlantColors();
  const systemColors = useSystemColors();
  const toggleTheme = useThemeToggle();
  const setTheme = useThemeSetter();
  const isDark = useIsDarkTheme();
  const plantVariables = usePlantColorVariables();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ color: plantColors.sage }}>
          Plantopia Theme System Demo
        </h1>
        <p className="text-lg" style={{ color: systemColors.mutedForeground }}>
          Current theme: {theme.mode} {isDark ? '🌙' : '☀️'}
        </p>
      </div>

      {/* Theme Controls */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setTheme('light')}
          className="px-4 py-2 rounded-md transition-colors"
          style={{
            backgroundColor: plantColors.mint,
            color: plantColors.moss,
          }}
        >
          Light Theme
        </button>
        <button
          onClick={() => setTheme('dark')}
          className="px-4 py-2 rounded-md transition-colors"
          style={{
            backgroundColor: plantColors.moss,
            color: plantColors.mint,
          }}
        >
          Dark Theme
        </button>
        <button
          onClick={() => setTheme('system')}
          className="px-4 py-2 rounded-md transition-colors"
          style={{
            backgroundColor: plantColors.fern,
            color: systemColors.background,
          }}
        >
          System Theme
        </button>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-md transition-colors"
          style={{
            backgroundColor: plantColors.sage,
            color: systemColors.background,
          }}
        >
          Toggle Theme
        </button>
      </div>

      {/* Plant Colors Demo */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: systemColors.foreground }}>
          Plant Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(plantColors).slice(0, 10).map(([name, color]) => (
            <div key={name} className="text-center">
              <div
                className="w-16 h-16 rounded-lg mx-auto mb-2 border-2"
                style={{
                  backgroundColor: color,
                  borderColor: systemColors.border,
                }}
              />
              <p className="text-sm capitalize" style={{ color: systemColors.foreground }}>
                {name}
              </p>
              <p className="text-xs font-mono" style={{ color: systemColors.mutedForeground }}>
                {color}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* System Colors Demo */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: systemColors.foreground }}>
          System Colors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium" style={{ color: systemColors.foreground }}>
              Backgrounds & Surfaces
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded border"
                  style={{
                    backgroundColor: systemColors.background,
                    borderColor: systemColors.border,
                  }}
                />
                <span className="text-sm" style={{ color: systemColors.foreground }}>
                  Background
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded border"
                  style={{
                    backgroundColor: systemColors.card,
                    borderColor: systemColors.border,
                  }}
                />
                <span className="text-sm" style={{ color: systemColors.foreground }}>
                  Card
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded border"
                  style={{
                    backgroundColor: systemColors.muted,
                    borderColor: systemColors.border,
                  }}
                />
                <span className="text-sm" style={{ color: systemColors.foreground }}>
                  Muted
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium" style={{ color: systemColors.foreground }}>
              Interactive Elements
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded border"
                  style={{
                    backgroundColor: systemColors.primary,
                    borderColor: systemColors.border,
                  }}
                />
                <span className="text-sm" style={{ color: systemColors.foreground }}>
                  Primary (Sage)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded border"
                  style={{
                    backgroundColor: systemColors.accent,
                    borderColor: systemColors.border,
                  }}
                />
                <span className="text-sm" style={{ color: systemColors.foreground }}>
                  Accent (Mint)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded border"
                  style={{
                    backgroundColor: systemColors.secondary,
                    borderColor: systemColors.border,
                  }}
                />
                <span className="text-sm" style={{ color: systemColors.foreground }}>
                  Secondary
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: systemColors.foreground }}>
          Usage Examples
        </h2>
        <div className="space-y-4">
          {/* Card Example */}
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: systemColors.card,
              borderColor: systemColors.border,
              color: systemColors.cardForeground,
            }}
          >
            <h3 className="font-semibold mb-2" style={{ color: plantColors.sage }}>
              Plant Care Card
            </h3>
            <p className="mb-3" style={{ color: systemColors.mutedForeground }}>
              This card uses system colors for proper theming and plant colors for branding.
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded text-sm transition-colors"
                style={{
                  backgroundColor: plantColors.mint,
                  color: plantColors.moss,
                }}
              >
                Water Now
              </button>
              <button
                className="px-3 py-1 rounded text-sm transition-colors border"
                style={{
                  borderColor: systemColors.border,
                  color: systemColors.foreground,
                }}
              >
                Schedule
              </button>
            </div>
          </div>

          {/* Code Examples */}
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: systemColors.muted,
              borderColor: systemColors.border,
            }}
          >
            <h3 className="font-semibold mb-2" style={{ color: systemColors.foreground }}>
              Code Examples
            </h3>
            <div className="space-y-2 text-sm font-mono">
              <div style={{ color: systemColors.mutedForeground }}>
                <span style={{ color: plantColors.moss }}>{/* Using hooks: */}</span>
              </div>
              <div style={{ color: systemColors.mutedForeground }}>
                const colors = usePlantColors();
              </div>
              <div style={{ color: systemColors.mutedForeground }}>
                const isDark = useIsDarkTheme();
              </div>
              <div style={{ color: systemColors.mutedForeground }}>
                <span style={{ color: plantColors.moss }}>{/* Using CSS variables: */}</span>
              </div>
              <div style={{ color: systemColors.mutedForeground }}>
                className=&quot;bg-plantopia-sage text-white&quot;
              </div>
              <div style={{ color: systemColors.mutedForeground }}>
                style=&#123;&#123; color: &apos;{plantVariables.sage}&apos; &#125;&#125;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
