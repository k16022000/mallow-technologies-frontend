import { createTheme, Theme } from '@mui/material/styles';

export const baseTheme: Theme = createTheme({
  palette: {
    primary: {
      main: '#aa10ff',
    },
    secondary: {
      main: '#9c27b0',
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      fontSize: 'clamp(2.5rem, 6vw, 4rem)',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      lineHeight: 1.25,
    },
    h3: {
      fontWeight: 600,
      fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)',
      lineHeight: 1.3,
    },
    body1: {
      fontWeight: 400,
      fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      lineHeight: 1.5,
      textTransform: 'none',
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export const getTheme = (mode: 'light' | 'dark'): Theme => {
  return createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      mode,
      background: {
        default: mode === 'dark' ? '#121212' : '#fcfafc',
        paper: mode === 'dark' ? '#1e1e1e' : '#fff',
      },
      text: {
        primary: mode === 'dark' ? '#f9edff' : '#1a1a1a',
      },
      primary: {
        ...baseTheme.palette.primary,
        contrastText: mode === 'dark' ? '#1e1e1e' : '#f9edff',
      },
      secondary: {
        ...baseTheme.palette.secondary,
        contrastText: mode === 'dark' ? '#1e1e1e' : '#f9edff',
      }
    },
    components: {
      ...baseTheme.components,
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: mode === 'dark' ? '#121212' : '#fff',
              color: mode === 'dark' ? '#f9edff' : '#1a1a1a',

              '& input': {
                color: mode === 'dark' ? '#f9edff' : '#1a1a1a',
                backgroundColor: mode === 'dark' ? '#121212' : '#fff',
                borderRadius: 'inherit',
              },

              '& fieldset': {
                borderColor: '#aa10ff',
              },

              '&:hover fieldset': {
                borderColor: '#aa10ff',
              },

              '&.Mui-focused fieldset': {
                borderColor: '#aa10ff',
              },
            },

            // '& .MuiInputLabel-root': {
            //   color: '#666', // label color
            //   '&.Mui-focused': {
            //     color: '#000', // label color when focused
            //   },
            // },
          }
        }
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? '#f9edff' : '#1a1a1a',
          },
        },
      },
    },
  });
}