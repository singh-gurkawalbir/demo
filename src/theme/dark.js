import colors from './colors';

export default {
  name: 'Celigo Dark Theme',
  appBar: {
    background: colors.celigoNeutral8,
    contrast: colors.celigoWhite,
    hover: colors.celigoWhite,
  },
  editor: {
    panelBackground: colors.celigoNeutral7,
    panelBorder: colors.celigoNeutral6,
  },
  palette: {
    type: 'dark',
    background: {
      paper: colors.celigoNeutral8,
      default: colors.celigoNeutral6,
      editorInner: colors.celigoNeutral7,
      main: colors.celigoAccent3,
      arrowAfter: colors.celigoNeutral7,
      // success:
      // warning: celigo.celigoWarning
      // error:
    },
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
      primary: colors.celigoNeutral1,
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
      h6: { color: colors.celigoNeutral1 },
      subtitle1: { color: colors.celigoNeutral1 },
      subtitle2: { color: colors.celigoNeutral1 },
      overline: { color: colors.celigoWhite },
    },
    MuiButton: {
      textPrimary: {
        color: colors.celigoNeutral1,
        '&:focus': {
          color: colors.celigoAccent2,
        },
        '&:hover': {
          color: colors.celigoAccent2,
        },
        '&:disabled': {
          color: colors.celigoNeutral6,
        },
      },
      textSecondary: {
        color: colors.celigoAccent2,
        '&::after': {
          backgroundColor: colors.celigoAccent3,
        },
        '&:focus': {
          color: colors.celigoAccent1,
        },
        '&:hover': {
          color: colors.celigoAccent3,
        },
        '&:disabled': {
          color: colors.celigoNeutral5,
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
        borderColor: colors.celigoNeutral2,
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
        borderColor: colors.celigoAccent3,
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
        borderColor: colors.celigoNeutral6,
        color: colors.celigoNeutral6,
        backgroundColor: 'transparent',
        '&:hover': {
          color: colors.celigoNeutral3,
          backgroundColor: 'transparent',
          borderColor: colors.celigoNeutral3,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          borderColor: colors.celigoNeutral4,
          backgroundColor: colors.celigoNeutral7,
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
        '&:hover': { backgroundColor: colors.celigoNeutral7 },
      },
    },
  },
};
