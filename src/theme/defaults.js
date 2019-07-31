import { fade } from '@material-ui/core/styles/colorManipulator';
import colors from './colors';

const unit = 8;

export default {
  typography: {
    useNextVariants: true,
    htmlFontSize: 16,
    fontSize: 16,
  },
  spacing: {
    unit,
    double: unit * 2,
    triple: unit * 3,
    quad: unit * 4,
  },
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
        lineHeight: '24px',
        letterSpacing: 'normal',
        fontFamily: 'source sans pro',
      },
      body2: {
        fontSize: '15px',
        fontWeight: '400',
        lineHeight: '20px',
        letterSpacing: 'normal',
        fontFamily: 'source sans pro',
      },
      h1: {
        fontSize: '48px',
        fontWeight: '300',
        lineHeight: '50px',
        letterSpacing: '-0.7px',
      },
      h2: {
        fontSize: '36px',
        fontWeight: '300',
        lineHeight: '39px',
        letterSpacing: '-0.5px',
      },

      h3: {
        fontSize: '24px',
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
        fontSize: '20px',
        fontWeight: '300',
        lineHeight: '16px',
        letterSpacing: 'normal',
      },
      h6: {
        fontSize: '14px',
        fontWeight: '300',
        lineHeight: '20px',
        letterSpacing: 'normal',
      },
      subtitle1: {
        fontSize: '18px',
        fontWeight: '400',
        lineHeight: '18px',
        letterSpacing: 'normal',
      },
      subtitle2: {
        fontSize: '15px',
        fontWeight: '300',
        lineHeight: 'normal',
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
  },
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The default props to change
      // variant: 'contained',
    },
    MuiSvgIcon: {
      viewBox: '0 0 32 32',
      fontSize: 'inherit',
    },
  },
};
