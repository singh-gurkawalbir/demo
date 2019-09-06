import colors from './colors';

export default {
  name: 'Celigo Light Theme',
  appBar: {
    background: colors.celigoNeutral7,
    contrast: colors.celigoWhite,
    hover: colors.celigoWhite,
  },
  selectFormControl: {
    color: colors.celigoNeutral6,
    background: colors.celigoWhite,
    hover: colors.celigoNeutral1,
    text: colors.celigoNeutral8,
    separator: colors.celigoNeutral2,
  },
  palette: {
    type: 'light',
    background: {
      paper: colors.celigoWhite,
      default: colors.celigoNeutral1,
      main: colors.celigoAccent3,
      sideBar: colors.celigoNeutral1,
      arrowAfter: colors.celigoNeutral3,
    },
    primary: {
      main: colors.celigoAccent2,
    },
    secondary: {
      main: colors.celigoNeutral6,
    },
    text: {
      primary: colors.celigoNeutral6,
      link: colors.celigoAccent2,
      linkHover: colors.celigoAccent1,
      linkActive: colors.celigoAccent2,
      title: colors.celigoNeutral7,
      // secondary: '#rrggbb',
      // disabled: '#rrggbb',
      // hint: '#rrggbb',
    },
    divider: colors.celigoNeutral3,
  },
  overrides: {
    MuiTypography: {
      root: { color: colors.celigoNeutral6 },
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
        '&::after': {
          backgroundColor: colors.celigoAccent3,
        },
        '&:focus': {
          color: colors.celigoAccent1,
        },
        '&:hover': {
          color: colors.celigoAccent2,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
        },
      },
      outlinedPrimary: {
        backgroundColor: colors.celigoAccent2,
        borderColor: colors.celigoAccent2,
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
          borderColor: colors.celigoNeutral3,
        },
      },
      outlinedSecondary: {
        backgroundColor: colors.celigoWhite,
        borderColor: colors.celigoNeutral3,
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
        backgroundColor: colors.celigoAccent2,
        borderColor: colors.celigoAccent2,
        color: colors.celigoWhite,
        '&:hover': {
          backgroundColor: colors.celigoAccent3,
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
          borderColor: colors.celigoNeutral3,
        },
      },
      containedSecondary: {
        borderColor: colors.celigoNeutral3,
        color: colors.celigoNeutral6,
        '&:hover': {
          color: colors.celigoNeutral7,
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent2,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          background: colors.celigoNeutral2,
          borderColor: colors.celigoNeutral3,
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
    MuiMenuItem: {
      root: {
        borderBottomColor: colors.celigoNeutral3,
        '&$selected': {
          backgroundColor: colors.celigoNeutral2,
          borderLeftColor: colors.celigoAccent3,
          '&:hover': {
            backgroundColor: colors.celigoNeutral3,
          },
        },
      },
    },
  },
};
