import colors from './colors';

const Roboto300 = { fontFamily: 'Roboto300, sans-serif' };
const Roboto400 = { fontFamily: 'Roboto400, sans-serif' };
const Roboto500 = { fontFamily: 'Roboto500, sans-serif' };
const unit = 8;

export default {
  typography: {
    useNextVariants: true,
    ...Roboto400,
    display4: Roboto300,
    display3: Roboto400,
    display2: Roboto400,
    display1: Roboto400,
    headline: Roboto400,
    title: Roboto500,
    subheading: Roboto400,
    caption: Roboto400,
    button: Roboto500,
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
  palette: {
    text: {
      primary: colors.celigoNeutral6,
      link: colors.celigoAccent2,
      linkHover: colors.celigoAccent1,
      // secondary: '#rrggbb',
      // disabled: '#rrggbb',
      // hint: '#rrggbb',
    },
    celigoColors: {
      celigoAccent1: colors.celigoAccent1,
      celigoAccent2: colors.celigoAccent2,
      celigoAccent3: colors.celigoAccent3,
      celigoAccent4: colors.celigoAccent4,
      celigoNeutral1: colors.celigoNeutral1,
      celigoNeutral2: colors.celigoNeutral2,
      celigoNeutral3: colors.celigoNeutral3,
      celigoNeutral4: colors.celigoNeutral4,
      celigoNeutral5: colors.celigoNeutral5,
      celigoNeutral6: colors.celigoNeutral6,
      celigoNeutral7: colors.celigoNeutral7,
      celigoNeutra8: colors.celigoNeutral8,
      celigoWhite: colors.celigoWhite,
      celigoHelpText: colors.celigoHelpText,
      celigoError: colors.celigoError,
      celigoSuccess: colors.celigoSuccess,
      celigoWarning: colors.celigoWarning,
    },
  },
  primary: {
    backgroundColor: colors.celigoAccent1,
    color: colors.celigoWhite,
  },

  overrides: {
    // Name of the component ⚛️ / style sheet
    MuiTypography: {
      body2: {
        fontSize: '15px',
        fontWeight: '400',
        lineHeight: '20px',
        letterSpacing: 'normal',
        color: colors.celigoNeutral6,
      },
      body1: {
        fontSize: '18px',
        fontWeight: '400',
        lineHeight: '24px',
        letterSpacing: 'normal',
        color: colors.celigoNeutral6,
      },
      h1: {
        fontSize: '48px',
        fontWeight: '300',
        lineHeight: '50px',
        letterSpacing: '0.7px',
        color: colors.celigoNeutral6,
      },
      h2: {
        fontSize: '36px',
        fontWeight: '400',
        lineHeight: '23px',
        letterSpacing: '0.5px',
        color: colors.celigoError,
      },

      h3: {
        fontSize: '24px',
        fontWeight: '300',
        lineHeight: '20px',
        letterSpacing: 'normal',
        color: colors.celigoNeutral6,
      },
      h4: {
        fontSize: '20px',
        fontWeight: '400',
        lineHeight: '23px',
        letterSpacing: 'normal',
        color: colors.celigoNeutral6,
      },
      h5: {
        fontSize: '20px',
        fontWeight: '300',
        lineHeight: '20px',
        letterSpacing: 'normal',
        color: colors.celigoNeutral6,
      },
      overline: {
        fontSize: '12px',
        fontWeight: '400',
        lineHeight: '20px',
        letterSpacing: '1px',
        color: colors.celigoNeutral6,
      },
    },
    MuiButton: {
      // Name of the rule (see https://material-ui.com/api/button/#css) for all rules.
      root: {
        // If we apply here it will effect on all the buttons
      },

      // variant text styles
      text: {},
      // variant text with primary color
      textPrimary: {
        color: colors.celigoNeutral6,
        fontSize: '16px',
        padding: '10px 20px',
        lineHeight: 'normal',
        '&:focus': {
          color: colors.celigoNeutral7,
        },
        '&:hover': {
          backgroundColor: 'transparent',
          color: colors.celigoAccent2,
          background: 'none',
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          background: colors.celigoNeutral2,
        },
      },
      textSecondary: {
        color: colors.celigoAccent2,
        fontSize: '16px',
        padding: '10px 20px',
        lineHeight: 'normal',
        '&:focus': {
          background: 'none',
          color: colors.celigoAccent1,
        },
        '&:hover': {
          backgroundColor: 'transparent',
          color: colors.celigoAccent3,
          textDecoration: 'underline',
        },
      },
      // small size button
      sizeSmall: {
        padding: '6px 12px',
        fontSize: '14px',
      },
      // large Size Button
      sizeLarge: {
        padding: '10px 20px',
        lineHeight: 'normal',
        fontSize: '20px',
        minWidth: 200,
      },

      outlined: {},
      outlinedPrimary: {
        backgroundColor: colors.celigoAccent3,
        borderColor: colors.celigoAccent3,
        color: colors.celigoWhite,
        padding: '10px 20px',
        lineHeight: '12px',
        '&:hover': {
          backgroundColor: colors.celigoAccent4,
          borderColor: colors.celigoAccent3,
        },
        '&:focus': {
          background: colors.celigoAccent2,
          borderColor: colors.celigoAccent2,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          background: colors.celigoNeutral2,
          borderColor: colors.celigoNeutral4,
        },
      },
      outlinedSecondary: {
        backgroundColor: 'transparent',
        borderColor: colors.celigoNeutral6,
        color: colors.celigoNeutral6,
        padding: '10px 20px',
        lineHeight: '12px',
        '&:hover': {
          color: colors.celigoNeutral7,
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent3,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          background: colors.celigoWhite,
        },
      },

      // rounded buttons styles
      contained: {
        borderRadius: '30px',
        backgroundColor: colors.celigoNeutral2,
        border: `1px solid${colors.celigoNeutral2}`,
        boxShadow: 'none',
        color: colors.celigoNeutral6,
        padding: '10px 20px',
        lineHeight: '12px',
        '&:hover': {
          color: colors.celigoNeutral7,
          backgroundColor: colors.celigoNeutral2,
          borderColor: colors.celigoNeutral4,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          background: 'none',
          borderColor: colors.celigoNeutral4,
        },
      },
      containedPrimary: {
        borderRadius: '30px',
        backgroundColor: colors.celigoAccent3,
        border: `1px solid${colors.celigoAccent3}`,
        color: colors.celigoWhite,
        padding: '10px 20px',
        lineHeight: '12px',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: colors.celigoAccent4,
          borderColor: colors.celigoAccent3,
          color: colors.celigoWhite,
        },
        '&:focus': {
          background: colors.celigoAccent2,
          borderColor: colors.celigoAccent2,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          background: colors.celigoNeutral2,
          borderColor: colors.celigoNeutral4,
        },
      },
      containedSecondary: {
        borderRadius: '30px',
        backgroundColor: 'transparent',
        border: `1px solid${colors.celigoNeutral6}`,
        boxShadow: 'none',
        color: colors.celigoNeutral6,
        padding: '10px 20px',
        lineHeight: '12px',
        '&:hover': {
          color: colors.celigoNeutral7,
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent3,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          background: 'none',
          borderColor: colors.celigoNeutral4,
        },
      },
      disabled: {},

      fullWidth: {},
    },
  },
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The default props to change
      // variant: 'contained',
      background: colors.celigoWarning,
    },
  },
};
