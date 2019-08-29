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
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    background: {
      success: colors.celigoSuccess,
      warning: colors.celigoWarning,
      error: colors.celigoError,
      info: colors.celigoAccent1,
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
        fontSize: '18px',
        fontWeight: '400',
        lineHeight: '27px',
        letterSpacing: 'normal',
        fontFamily: 'source sans pro',
      },
      body2: {
        fontSize: '15px',
        fontWeight: '400',
        lineHeight: '22px',
        letterSpacing: 'normal',
        fontFamily: 'source sans pro',
      },
      h1: {
        fontSize: '48px',
        fontFamily: 'Roboto300',
        fontWeight: '300',
        lineHeight: '50px',
        letterSpacing: '-0.7px',
      },
      h2: {
        fontSize: '36px',
        fontFamily: 'Roboto300',
        fontWeight: '300',
        lineHeight: '40px',
        letterSpacing: '-0.5px',
      },

      h3: {
        fontSize: '24px',
        fontFamily: 'Roboto300',
        fontWeight: '300',
        lineHeight: '26px',
        letterSpacing: 'normal',
      },
      h4: {
        fontSize: '20px',
        fontWeight: '400',
        lineHeight: '23px',
        letterSpacing: 'normal',
      },
      h5: {
        fontSize: '18px',
        fontWeight: '400',
        lineHeight: '16px',
        letterSpacing: 'normal',
      },
      h6: {
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '20px',
        letterSpacing: 'normal',
      },
      subtitle1: {
        fontSize: '22px',
        fontWeight: '400',
        lineHeight: '30px',
        letterSpacing: 'normal',
      },
      subtitle2: {
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '24px',
        letterSpacing: 'normal',
      },
      overline: {
        fontSize: '12px',
        fontWeight: '400',
        lineHeight: '20px',
        letterSpacing: '1px',
      },
    },
    MuiButton: {
      root: {
        fontFamily: 'Roboto500, sans-serif',
      },
      // text Buttons
      text: {
        letterSpacing: '1px',
        minWidth: '100px',
        fontSize: '12px',
        lineHeight: '8px',
        padding: '10px 0px',
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
        padding: '10px 20px',
        fontSize: '14px',
        textTransform: 'lowercase',
        minWidth: 100,
        letterSpacing: 'normal',
      },
      // large Size Button
      sizeLarge: {
        padding: '10px 20px',
        lineHeight: 'normal',
        fontSize: '24px',
        borderRadius: '36px',
        minWidth: 200,
      },
      outlined: {
        borderRadius: '4px',
        letterSpacing: '1px',
        fontSize: '12px',
        lineHeight: '8px',
        minWidth: '100px',
        padding: '10px 20px',
      },
      outlinedPrimary: {
        backgroundColor: colors.celigoAccent3,
        border: '1px solid',
      },
      outlinedSecondary: {
        backgroundColor: 'transparent',
        border: '1px solid',
      },

      // rounded buttons styles
      contained: {
        borderRadius: '18px',
        letterSpacing: '1px',
        fontSize: '12px',
        lineHeight: '8px',
        minWidth: '100px',
        border: '1px solid',
        boxShadow: 'none',
        padding: '10px 20px',
        '&:disabled': {
          background: 'none',
        },
      },
      containedPrimary: {
        borderColor: colors.celigoAccent3,
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
