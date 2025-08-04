import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // État
      theme: 'dark',
      accentColor: 'blue',
      fontSize: 'medium',
      animations: true,
      reducedMotion: false,
      highContrast: false,
      customColors: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f8fafc',
        textSecondary: '#94a3b8',
        border: '#334155',
        error: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
        info: '#3b82f6'
      },

      // Actions
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.classList.toggle('light', theme === 'light');
      },

      setAccentColor: (color) => {
        set({ accentColor: color });
        document.documentElement.setAttribute('data-accent', color);
      },

      setFontSize: (size) => {
        set({ fontSize: size });
        document.documentElement.setAttribute('data-font-size', size);
      },

      setAnimations: (enabled) => {
        set({ animations: enabled });
        document.documentElement.classList.toggle('no-animations', !enabled);
      },

      setReducedMotion: (enabled) => {
        set({ reducedMotion: enabled });
        document.documentElement.classList.toggle('reduced-motion', enabled);
      },

      setHighContrast: (enabled) => {
        set({ highContrast: enabled });
        document.documentElement.classList.toggle('high-contrast', enabled);
      },

      setCustomColors: (colors) => {
        set({ customColors: { ...get().customColors, ...colors } });
        
        // Appliquer les couleurs personnalisées
        Object.entries(colors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--color-${key}`, value);
        });
      },

      // Initialiser le thème
      initializeTheme: () => {
        const { theme, accentColor, fontSize, animations, reducedMotion, highContrast, customColors } = get();
        
        // Appliquer le thème
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.classList.toggle('light', theme === 'light');
        
        // Appliquer la couleur d'accent
        document.documentElement.setAttribute('data-accent', accentColor);
        
        // Appliquer la taille de police
        document.documentElement.setAttribute('data-font-size', fontSize);
        
        // Appliquer les animations
        document.documentElement.classList.toggle('no-animations', !animations);
        document.documentElement.classList.toggle('reduced-motion', reducedMotion);
        document.documentElement.classList.toggle('high-contrast', highContrast);
        
        // Appliquer les couleurs personnalisées
        Object.entries(customColors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--color-${key}`, value);
        });
      },

      // Basculer entre les thèmes
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },

      // Obtenir les couleurs du thème actuel
      getThemeColors: () => {
        const { theme, customColors } = get();
        
        if (theme === 'dark') {
          return {
            ...customColors,
            background: '#0f172a',
            surface: '#1e293b',
            text: '#f8fafc',
            textSecondary: '#94a3b8',
            border: '#334155'
          };
        } else {
          return {
            ...customColors,
            background: '#ffffff',
            surface: '#f8fafc',
            text: '#1e293b',
            textSecondary: '#64748b',
            border: '#e2e8f0'
          };
        }
      },

      // Obtenir les classes CSS du thème
      getThemeClasses: () => {
        const { theme, accentColor, fontSize, animations, reducedMotion, highContrast } = get();
        
        return {
          'data-theme': theme,
          'data-accent': accentColor,
          'data-font-size': fontSize,
          'no-animations': !animations,
          'reduced-motion': reducedMotion,
          'high-contrast': highContrast
        };
      },

      // Réinitialiser aux valeurs par défaut
      resetToDefaults: () => {
        const defaults = {
          theme: 'dark',
          accentColor: 'blue',
          fontSize: 'medium',
          animations: true,
          reducedMotion: false,
          highContrast: false,
          customColors: {
            primary: '#3b82f6',
            secondary: '#1e40af',
            accent: '#60a5fa',
            background: '#0f172a',
            surface: '#1e293b',
            text: '#f8fafc',
            textSecondary: '#94a3b8',
            border: '#334155',
            error: '#ef4444',
            success: '#10b981',
            warning: '#f59e0b',
            info: '#3b82f6'
          }
        };
        
        set(defaults);
        get().initializeTheme();
      },

      // Getters utiles
      getTheme: () => get().theme,
      
      getAccentColor: () => get().accentColor,
      
      getFontSize: () => get().fontSize,
      
      getAnimations: () => get().animations,
      
      getReducedMotion: () => get().reducedMotion,
      
      getHighContrast: () => get().highContrast,
      
      getCustomColors: () => get().customColors,
      
      isDarkTheme: () => get().theme === 'dark',
      
      isLightTheme: () => get().theme === 'light',
      
      getThemeConfig: () => ({
        theme: get().theme,
        accentColor: get().accentColor,
        fontSize: get().fontSize,
        animations: get().animations,
        reducedMotion: get().reducedMotion,
        highContrast: get().highContrast,
        customColors: get().customColors
      })
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        theme: state.theme,
        accentColor: state.accentColor,
        fontSize: state.fontSize,
        animations: state.animations,
        reducedMotion: state.reducedMotion,
        highContrast: state.highContrast,
        customColors: state.customColors
      })
    }
  )
);