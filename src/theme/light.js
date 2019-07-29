import colors from './colors';

export default {
  name: 'Celigo Light Theme',
  appBar: {
    background: colors.celigoNeutral7,
    contrast: colors.celigoWhite,
    hover: colors.celigoWhite,
  },
  editor: {
    panelBackground: colors.celigoNeutral2,
    panelBorder: colors.celigoNeutral2,
  },
  palette: {
    type: 'light',
    background: {
      paper: colors.celigoWhite,
      default: colors.celigoNeutral1,
      main: colors.celigoAccent3,
      sideBar: colors.celigoHelpText,
      editorInner: colors.celigoNeutral2,
      arrowAfter: colors.celigoNeutral2,
      // success:
      // warning: celigo.celigoWarning
      // error:
    },

    // action: {[object]},
    // Spinner color changes below
    primary: {
      main: colors.celigoAccent1,
      color: colors.celigoNeutral6,
    },
    secondary: {
      light: colors.celigoAccent3,
      main: colors.celigoAccent1,
    },
    text: {
      primary: colors.celigoNeutral6,
      link: colors.celigoAccent2,
      linkHover: colors.celigoAccent1,
      linkActive: colors.celigoAccent2,
      // secondary: '#rrggbb',
      // disabled: '#rrggbb',
      // hint: '#rrggbb',
    },
  },
  overrides: {
    MuiTypography: {
      body2: { color: colors.celigoNeutral6 },
      body1: { color: colors.celigoNeutral6 },
      h1: { color: colors.celigoNeutral6 },
      h2: { color: colors.celigoNeutral6 },
      h3: { color: colors.celigoNeutral6 },
      h4: { color: colors.celigoNeutral6 },
      h5: { color: colors.celigoNeutral6 },
      h6: { color: colors.celigoNeutral6 },
      subtitle1: { color: colors.celigoNeutral6 },
      subtitle2: { color: colors.celigoNeutral6 },
      overline: { color: colors.celigoNeutral6 },
    },
    MuiButton: {
      textPrimary: {
        color: colors.celigoNeutral6,
        '&:focus': {
          color: colors.celigoNeutral7,
        },
        '&:hover': {
          color: colors.celigoAccent2,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
        },
      },
      textSecondary: {
        color: colors.celigoAccent2,
        '&:focus': {
          color: colors.celigoAccent1,
        },
        '&:hover': {
          color: colors.celigoAccent3,
          '&:after': {
            background: colors.celigoAccent3,
          },
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
        },
      },
      outlinedPrimary: {
        backgroundColor: colors.celigoAccent3,
        borderColor: colors.celigoAccent3,
        color: colors.celigoWhite,
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
        borderColor: colors.celigoNeutral6,
        color: colors.celigoNeutral6,
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
        backgroundColor: colors.celigoNeutral2,
        border: `1px solid ${colors.celigoNeutral2}`,
        color: colors.celigoNeutral6,
        '&:hover': {
          color: colors.celigoNeutral7,
          backgroundColor: colors.celigoNeutral2,
          borderColor: colors.celigoNeutral4,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          borderColor: colors.celigoNeutral4,
        },
      },
      containedPrimary: {
        backgroundColor: colors.celigoAccent3,
        border: `1px solid ${colors.celigoAccent3}`,
        color: colors.celigoWhite,
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
        border: `1px solid ${colors.celigoNeutral6}`,
        color: colors.celigoNeutral6,
        '&:hover': {
          color: colors.celigoNeutral7,
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent3,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          borderColor: colors.celigoNeutral4,
        },
      },
    },
    MuiAvatar: {
      colorDefault: {
        color: colors.celigoNeutral1,
        backgroundColor: colors.celigoNeutral6,
      },
    },
    MuiListItem: {
      button: {
        '&:hover': { backgroundColor: colors.celigoNeutral2 },
      },
    },
  },
};
