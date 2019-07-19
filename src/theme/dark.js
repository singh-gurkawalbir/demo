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
  palette: {
    type: 'dark',
    background: {
      paper: colors.celigoNeutral8,
      // TODO Azhar
      // default: '#1d232a',
      default: colors.celigoNeutral6,
      editorInner: colors.celigoNeutral7,
      main: colors.celigoAccent3,
      arrowAfter: colors.celigoNeutral7,
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
      body2: { color: colors.celigoWhite },
      body1: { color: colors.celigoWhite },
      h1: { color: colors.celigoWhite },
      h2: { color: colors.celigoWhite },
      h3: { color: colors.celigoWhite },
      h4: { color: colors.celigoWhite },
      h5: { color: colors.celigoWhite },
      h6: { color: colors.celigoHelpText },
      subtitle1: { color: colors.celigoHelpText },
      subtitle2: { color: colors.celigoHelpText },
      overline: { color: colors.celigoWhite },
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
};
