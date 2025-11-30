/**
 * Design System - EsferaZap
 * Tema, cores e tokens de design
 */

export const theme = {
  colors: {
    // Cores principais
    primary: {
      DEFAULT: '#2563EB', // Azul confiança
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB', // Main
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },

    secondary: {
      DEFAULT: '#10B981', // Verde WhatsApp
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981', // Main
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
    },

    accent: {
      DEFAULT: '#F59E0B', // Laranja ação
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Main
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },

    // Cores neutras
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },

    // Estados
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

// CSS Variables para uso global
export const cssVariables = `
  :root {
    /* Colors */
    --color-primary: ${theme.colors.primary.DEFAULT};
    --color-secondary: ${theme.colors.secondary.DEFAULT};
    --color-accent: ${theme.colors.accent.DEFAULT};

    /* Background */
    --background: ${theme.colors.gray[50]};
    --foreground: ${theme.colors.gray[900]};

    /* Muted */
    --muted: ${theme.colors.gray[100]};
    --muted-foreground: ${theme.colors.gray[500]};

    /* Border */
    --border: ${theme.colors.gray[200]};
    --input: ${theme.colors.gray[200]};

    /* Ring */
    --ring: ${theme.colors.primary.DEFAULT};

    /* Radius */
    --radius: ${theme.borderRadius.md};
  }

  .dark {
    --background: ${theme.colors.gray[900]};
    --foreground: ${theme.colors.gray[50]};
    --muted: ${theme.colors.gray[800]};
    --muted-foreground: ${theme.colors.gray[400]};
    --border: ${theme.colors.gray[700]};
    --input: ${theme.colors.gray[700]};
  }
`;

export default theme;
