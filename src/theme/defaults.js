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

  overrides: {
    // Name of the component ⚛️ / style sheet
    MuiTypography: {
      body2: {
        fontSize: '15px',
        fontWeight: '400',
        lineHeight: '20px',
        letterSpacing: 'normal',
      },
      body1: {
        fontSize: '18px',
        fontWeight: '400',
        lineHeight: '24px',
        letterSpacing: 'normal',
      },
      h1: {
        fontSize: '48px',
        fontWeight: '300',
        lineHeight: '50px',
        letterSpacing: '0.7px',
      },
      h2: {
        fontSize: '36px',
        fontWeight: '400',
        lineHeight: '23px',
        letterSpacing: '0.5px',
      },

      h3: {
        fontSize: '24px',
        fontWeight: '300',
        lineHeight: '20px',
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
        lineHeight: '20px',
        letterSpacing: 'normal',
      },
      subtitle1: {
        fontSize: '14px',
        fontWeight: '300',
        lineHeight: '18px',
        letterSpacing: 'normal',
      },
      subtitle2: {
        fontSize: '12px',
        fontWeight: '300',
        lineHeight: '18px',
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
      // Azhar, i dont think this is the right thing to do since we dont
      // know if the icon is on the left or right...
      // label: {
      //   '& > svg': {
      //     margin: '0px 6px',
      //     lineHeight: '0px',
      //     fontSize: '12px',
      //   },
      // },
      textPrimary: {
        borderRadius: '18px',
        letterSpacing: '1px',
        minWidth: '100px',
        fontSize: '12px',
        lineHeight: '8px',
        padding: '10px 20px',
        '&:hover': {
          background: 'none',
        },
      },
      textSecondary: {
        borderRadius: '18px',
        letterSpacing: '1px',
        minWidth: '100px',
        fontSize: '12px',
        lineHeight: '8px',
        padding: '10px 20px',
        '&:focus': {
          background: 'none',
        },
        '&:hover': {
          backgroundColor: 'transparent',
          '&:after': {
            width: '100%',
            left: '0px',
          },
        },
        '&:after': {
          background: 'none repeat scroll 0 0 transparent',
          bottom: '0px',
          content: '',
          display: 'block',
          height: '1px',
          left: '50%',
          position: 'absolute',
          transition: 'width 0.3s ease 0s, left 0.3s ease 0s',
          width: '0',
        },
      },
      // small size button
      sizeSmall: {
        padding: '10px 20px',
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
        borderRadius: '4px',
        letterSpacing: '1px',
        fontSize: '12px',
        lineHeight: '8px',
        minWidth: '100px',
        padding: '10px 20px',
      },
      outlinedSecondary: {
        borderRadius: '4px',
        letterSpacing: '1px',
        fontSize: '12px',
        lineHeight: '8px',
        minWidth: '100px',
        backgroundColor: 'transparent',
        padding: '10px 20px',
      },

      // rounded buttons styles
      contained: {
        borderRadius: '18px',
        letterSpacing: '1px',
        fontSize: '12px',
        lineHeight: '8px',
        minWidth: '100px',
        border: `1px solid ${colors.celigoNeutral2}`,
        boxShadow: 'none',
        padding: '10px 20px',
        '&:disabled': {
          background: 'none',
        },
      },
      containedPrimary: {
        borderRadius: '18px',
        letterSpacing: '1px',
        fontSize: '12px',
        lineHeight: '8px',
        minWidth: '100px',
        border: `1px solid ${colors.celigoAccent3}`,
        padding: '10px 20px',
        boxShadow: 'none',
      },
      containedSecondary: {
        borderRadius: '18px',
        letterSpacing: '1px',
        fontSize: '12px',
        lineHeight: '8px',
        minWidth: '100px',
        backgroundColor: 'transparent',
        border: `1px solid ${colors.celigoNeutral6}`,
        boxShadow: 'none',
        padding: '10px 20px',
        '&:disabled': {
          background: 'none',
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
    MuiSvgIcon: {
      viewBox: '0 0 32 32',
      fontSize: 'inherit',
    },
  },
};
