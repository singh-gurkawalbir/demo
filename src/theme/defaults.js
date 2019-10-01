import { fade } from '@material-ui/core/styles/';
import colors from './colors';

export default {
  breakpoints: {
    values: {
      sm: 768,
      md: 968,
      lg: 1370,
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Roboto400, sans-serif',
  },
  palette: {
    background: {
      success: colors.celigoSuccess,
      warning: colors.celigoWarning,
      error: colors.celigoError,
      info: colors.celigoAccent1,
    },
    /* Adding states only for the styleGuide later I will remove, 
        once we point styleguide to the new ThemeProvider,
    */
    success: {
      main: colors.celigoSuccess,
    },
    error: {
      main: colors.celigoError,
    },
    warning: {
      main: colors.celigoWarning,
    },
    info: {
      main: colors.celigoAccent2,
    },
  },
  spacing: 8,
  drawerWidth: 300,

  overrides: {
    MuiBackdrop: {
      root: {
        backgroundColor: fade(colors.celigoNeutral6, 0.7),
      },
    },
    // Name of the component ⚛️ / style sheet
    MuiTypography: {
      body1: {
        fontSize: '17px',
        lineHeight: '22px',
        letterSpacing: 'normal',
        fontFamily: 'source sans pro',
      },
      body2: {
        fontSize: '15px',
        lineHeight: '19px',
        letterSpacing: 'normal',
        fontFamily: 'source sans pro',
      },
      h1: {
        fontSize: '48px',
        fontFamily: 'Roboto300',
        lineHeight: '53px',
        letterSpacing: '-0.7px',
      },
      h2: {
        fontSize: '36px',
        fontFamily: 'Roboto300',
        lineHeight: '40px',
        letterSpacing: '-0.5px',
      },
      h3: {
        fontSize: '24px',
        fontFamily: 'Roboto300',
        lineHeight: '28px',
        letterSpacing: 'normal',
      },
      h4: {
        fontSize: '20px',
        lineHeight: '25px',
        letterSpacing: 'normal',
      },
      h5: {
        fontSize: '17px',
        lineHeight: '22px',
        letterSpacing: 'normal',
      },
      h6: {
        fontSize: '15px',
        lineHeight: '18px',
        letterSpacing: 'normal',
        fontFamily: 'Roboto500',
      },
      subtitle1: {
        fontSize: '18px',
        lineHeight: '23px',
        letterSpacing: 'normal',
      },
      subtitle2: {
        fontSize: '15px',
        lineHeight: '18px',
        letterSpacing: 'normal',
        fontFamily: 'Roboto500',
      },
      overline: {
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '1px',
      },
    },
    MuiButton: {
      root: {
        fontFamily: 'Roboto500, sans-serif',
      },
      // text Buttons
      text: {
        fontSize: '13px',
        lineHeight: '15px',
        textTransform: 'uppercase',
        '&::after': {
          background: 'none repeat scroll 0 0 transparent',
          bottom: '0',
          content: " '' ",
          display: 'block',
          height: '1px',
          left: '50%',
          position: 'absolute',
          transition: 'width 0.3s ease 0s, left 0.3s ease 0s',
          width: '0',
        },
      },
      textPrimary: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
      textSecondary: {
        color: colors.celigoNeutral6,
        '&:focus': {
          background: 'none',
        },
        '&::after': {
          backgroundColor: colors.celigoError,
        },
        '&:hover': {
          backgroundColor: 'transparent',
          '&::after': {
            width: '100%',
            left: '0',
          },
        },
      },
      // small size button
      sizeSmall: {
        padding: '4px 18px',
        fontSize: '12px',
        textTransform: 'none',
        minWidth: 80,
        letterSpacing: 'normal',
      },
      // large Size Button
      sizeLarge: {
        padding: '8px 20px',
        lineHeight: 'normal',
        fontSize: '14px',
        borderRadius: '25px',
        minWidth: 125,
      },
      // Outline Button
      outlined: {
        borderRadius: '4px',
        textTransform: 'none',
        fontSize: '13px',
        lineHeight: '15px',
        minWidth: '100px',
        padding: '6px 20px',
      },
      outlinedPrimary: {
        backgroundColor: colors.celigoAccent2,
        border: '1px solid',
      },
      outlinedSecondary: {
        backgroundColor: 'transparent',
        border: '1px solid',
      },

      // rounded buttons styles
      contained: {
        borderRadius: '17px',
        fontSize: '13px',
        lineHeight: '15px',
        minWidth: '100px',
        border: '1px solid',
        textTransform: 'none',
        boxShadow: 'none',
        padding: '6px 20px',
        '&:disabled': {
          background: 'none',
        },
      },
      containedPrimary: {
        borderColor: colors.celigoAccent2,
      },
      containedSecondary: {
        backgroundColor: 'transparent',
      },
    },
    MuiMenuItem: {
      root: {
        borderBottom: '1px solid',
        '&$selected': {
          backgroundColor: 'transparent',
          '&:before': {
            background: colors.celigoAccent3,
          },
        },
        '&:last-child': {
          borderBottom: 'none',
        },
        '&:hover': {
          '&:before': {
            background: colors.celigoAccent3,
          },
        },
        '&:before': {
          content: '""',
          width: '6px',
          height: '100%',
          position: 'absolute',
          background: 'transparent',
          left: '0px',
        },
      },
    },
  },
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The default props to change
      // variant: 'contained',
    },
  },
};
