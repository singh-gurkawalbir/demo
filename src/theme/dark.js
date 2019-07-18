import colors from './colors';

export default {
  name: 'Celigo Dark Theme',
  appBar: {
    background: colors.celigoNeutral8,
    contrast: colors.celigoWhite,
    hover: colors.celigoWhite,
  },
  editor: {
    panelBackground: colors.celigoNeutral2,
    panelBorder: colors.celigoNeutral2,
  },
  radius: {
    radius4: '4px',
    radius6: '6px',
    radius8: '8px',
    radius50: '50%',
  },
  palette: {
    type: 'dark',
    background: {
      paper: colors.celigoNeutral8,
      // TODO Azhar
      default: '#1d232a',
      // default: colors.celigoNeutral6,
      editorInner: colors.celigoNeutral7,
      main: colors.celigoAccent3,
      // success:
      // warning: celigo.celigoWarning
      // error:
    },
    // action: {[object]},
    // Spinner color changes below
    primary: {
      backgroundColor: colors.celigoAccent1,
      color: colors.celigoWhite,
      main: colors.celigoAccent3,
    },
    secondary: {
      light: colors.celigoAccent3,
      main: colors.celigoAccent1,
    },
    text: {
      primary: colors.celigoHelpText,
      link: colors.celigoNeutral6,
      linkHover: colors.celigoAccent1,
      secondary: colors.celigoNeutral4,
      // disabled: '#rrggbb',
      // hint: '#rrggbb',
    },
  },
  overrides: {
    MuiTypography: {
      body2: {
        fontSize: '15px',
        fontWeight: '400',
        lineHeight: '20px',
        letterSpacing: 'normal',
        color: colors.celigoWhite,
      },
      body1: {
        fontSize: '18px',
        fontWeight: '400',
        lineHeight: '24px',
        letterSpacing: 'normal',
        color: colors.celigoWhite,
      },
      h1: {
        fontSize: '48px',
        fontWeight: '300',
        lineHeight: '50px',
        letterSpacing: '0.7px',
        color: colors.celigoWhite,
      },
      h2: {
        fontSize: '36px',
        fontWeight: '400',
        lineHeight: '23px',
        letterSpacing: '0.5px',
        color: colors.celigoWhite,
      },

      h3: {
        fontSize: '24px',
        fontWeight: '300',
        lineHeight: '20px',
        letterSpacing: 'normal',
        color: colors.celigoWhite,
      },
      h4: {
        fontSize: '20px',
        fontWeight: '400',
        lineHeight: '23px',
        letterSpacing: 'normal',
        color: colors.celigoWhite,
      },
      h5: {
        fontSize: '20px',
        fontWeight: '300',
        lineHeight: '20px',
        letterSpacing: 'normal',
        color: colors.celigoWhite,
      },
      h6: {
        fontSize: '16px',
        fontWeight: '300',
        lineHeight: '18px',
        letterSpacing: 'normal',
        color: colors.celigoHelpText,
      },
      subtitle1: {
        fontSize: '14px',
        fontWeight: '300',
        lineHeight: '18px',
        letterSpacing: 'normal',
        color: colors.celigoHelpText,
      },
      subtitle2: {
        fontSize: '12px',
        fontWeight: '300',
        lineHeight: '18px',
        letterSpacing: 'normal',
        color: colors.celigoHelpText,
      },
      overline: {
        fontSize: '12px',
        fontWeight: '400',
        lineHeight: '20px',
        letterSpacing: '1px',
        color: colors.celigoWhite,
      },
    },
    MuiButton: {
      textPrimary: {
        borderRadius: '18px',
        letterSpacing: '1px',
        minWidth: '100px',
        fontSize: '12px',
        lineHeight: '8px',
        color: colors.celigoNeutral6,
        padding: '10px 20px',
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
        },
      },
      textSecondary: {
        borderRadius: '18px',
        letterSpacing: '1px',
        minWidth: '100px',
        fontSize: '12px',
        lineHeight: '8px',
        color: colors.celigoAccent2,
        padding: '10px 20px',
        '&:focus': {
          background: 'none',
          color: colors.celigoAccent1,
        },
        '&:hover': {
          backgroundColor: 'transparent',
          color: colors.celigoAccent3,
          textDecoration: 'underline',
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
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

      // outlined: {},
      outlinedPrimary: {
        borderRadius: '18px',
        letterSpacing: '1px',
        fontSize: '12px',
        lineHeight: '8px',
        minWidth: '100px',
        backgroundColor: colors.celigoAccent3,
        borderColor: colors.celigoAccent3,
        color: colors.celigoWhite,
        padding: '10px 20px',
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
        borderRadius: '18px',
        letterSpacing: '1px',
        fontSize: '12px',
        lineHeight: '8px',
        minWidth: '100px',
        backgroundColor: 'transparent',
        borderColor: colors.celigoNeutral6,
        color: colors.celigoNeutral6,
        padding: '10px 20px',
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
        borderRadius: '18px',
        letterSpacing: '1px',
        fontSize: '12px',
        lineHeight: '8px',
        minWidth: '100px',
        backgroundColor: colors.celigoNeutral2,
        border: `1px solid ${colors.celigoNeutral2}`,
        boxShadow: 'none',
        color: colors.celigoNeutral6,
        padding: '10px 20px',
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
        borderRadius: '18px',
        letterSpacing: '1px',
        fontSize: '12px',
        lineHeight: '8px',
        minWidth: '100px',
        backgroundColor: colors.celigoAccent3,
        border: `1px solid ${colors.celigoAccent3}`,
        color: colors.celigoWhite,
        padding: '10px 20px',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: colors.celigoAccent4,
          borderColor: colors.celigoAccent4,
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
        borderRadius: '18px',
        letterSpacing: '1px',
        fontSize: '12px',
        lineHeight: '8px',
        minWidth: '100px',
        backgroundColor: 'transparent',
        border: `1px solid ${colors.celigoNeutral6}`,
        boxShadow: 'none',
        color: colors.celigoNeutral6,
        padding: '10px 20px',
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
      // disabled: {},

      // fullWidth: {},
    },
    MuiAvatar: {
      colorDefault: {
        color: colors.celigoHelpText,
        backgroundColor: colors.celigoNeutral6,
      },
    },
    MuiListItem: {
      button: {
        '&:hover': { backgroundColor: colors.celigoNeutral7 },
      },
    },
  },
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The default props to change
      // variant: 'contained',
      background: colors.celigoError,
    },
  },
};
