import { createMuiTheme } from '@material-ui/core/styles';
import colors from '../theme/colors';

const appBarHeight = 36;
const theme = {
  spacing: 8,
  drawerWidth: 256,
  appBarHeight,
  pageBarHeight: 88,

  palette: {
    type: 'light',
    background: {
      paper: colors.celigoWhite,
      paper2: colors.celigoNeutral2,
      default: colors.celigoNeutral1,
    },
    primary: {
      light: colors.celigoAccent3,
      main: colors.celigoAccent2,
      dark: colors.celigoAccent1,
    },
    secondary: {
      lightest: colors.celigoNeutral3,
      light: colors.celigoNeutral6,
      main: colors.celigoNeutral8,
      darkest: colors.celigoNeutral9,
      contrastText: colors.celigoNeutral4,
    },
    text: {
      disabled: colors.celigoNeutral4,
      primary: colors.celigoNeutral6,
      hint: colors.celigoNeutral5,
    },
  },
  // global overrides for MUI styles...
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'unset',
      },
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
        backgroundColor: 'transparent',
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
      outlined: {
        borderRadius: '4px',
        textTransform: 'none',
        fontSize: '13px',
        lineHeight: '15px',
        minWidth: '100px',
        padding: '6px 20px',
        border: '1px solid',
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
      text: {
        textTransform: 'none',
        fontSize: '13px',
        lineHeight: '15px',
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
        color: colors.celigoNeutral6,
        '&:focus': {
          color: colors.celigoNeutral7,
        },
        '&:hover': {
          color: colors.celigoAccent2,
          backgroundColor: 'inherit',
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
        },
      },
    },
    MuiToolbar: {
      dense: {
        minHeight: appBarHeight,
      },
    },
    MuiMenuItem: {
      root: {
        borderBottom: '1px solid',
        '&$selected': {
          backgroundColor: colors.celigoNeutral2,
          '&:before': {
            background: colors.celigoAccent3,
          },
        },
        '&:last-child': {
          borderBottom: 'none',
        },
        '&:hover': {
          background: colors.celigoNeutral2,
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
    MuiTypography: {
      root: {
        color: colors.celigoNeutral6,
        fontFamily: 'Roboto400, sans-serif',
      },
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
    MuiListItem: {
      root: {
        paddingBottom: 5,
        paddingTop: 5,
      },
    },
    // .MuiTableRow-root.MuiTableRow-hover:hover
    MuiTableRow: {
      root: {
        '&$hover:hover': {
          backgroundColor: colors.celigoWhite,
          boxShadow: `2px 2px 4px rgba(0,0,0,0.1)`,
        },
      },
    },
    MuiSelect: {
      icon: {
        color: colors.celigoNeutral5,
      },
      select: {
        '&:focus': {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiInput: {
      formControl: {
        background: colors.celigoWhite,
      },
      underline: {
        '&:before': {
          display: 'none',
        },
        '&:after': {
          display: 'none',
        },
      },
    },
    MuiFormLabel: {
      root: {
        fontFamily: 'source sans pro',
      },
    },
    MuiFilledInput: {
      root: {
        '&:hover': {
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent2,
        },
        '&$focused': {
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent2,
        },
      },
      input: {
        background: colors.celigoWhite,
        border: '1px solid',
        borderColor: colors.celigoNeutral3,
        height: 50,
        boxSizing: 'border-box',
        borderRadius: 2,
        '&:hover': {
          borderColor: colors.celigoAccent2,
        },
        '&:disabled': {
          backgroundColor: colors.celigoNeutral3,
        },
      },
      underline: {
        '&:before': {
          display: 'none',
        },
        '&:after': {
          display: 'none',
        },
      },
      multiline: {
        background: colors.celigoWhite,
        border: '1px solid',
        borderColor: colors.celigoNeutral3,
        borderRadius: 2,
        '&:hover': {
          borderColor: colors.celigoAccent2,
        },
        '&:disabled': {
          backgroundColor: colors.celigoNeutral3,
        },
      },
      inputMultiline: {
        border: 'none',
      },
    },
    MuiRadio: {
      root: {
        color: colors.celigoNeutral5,
      },
    },
    MuiInputBase: {
      root: {
        fontFamily: 'source sans pro',
        fontSize: '15px',
      },
      input: {
        '&:invalid': {
          borderColor: colors.celigoError,
        },
      },
    },
  },
};

export default () => {
  const muiTheme = createMuiTheme(theme);

  muiTheme.palette.success = muiTheme.palette.augmentColor({
    main: colors.celigoSuccess,
  });
  muiTheme.palette.warning = muiTheme.palette.augmentColor({
    main: colors.celigoWarning,
  });
  muiTheme.palette.info = muiTheme.palette.augmentColor({
    main: colors.celigoAccent2,
  });

  return muiTheme;
};
