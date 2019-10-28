import { createMuiTheme } from '@material-ui/core/styles';
import colors from '../theme/colors';

const appBarHeight = 36;
const theme = {
  spacing: 8,
  drawerWidth: 256,
  drawerWidthMinimized: 60,
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
      secondary: colors.celigoNeutral7,
    },
  },
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    values: {
      xs: 0,
      sm: 640,
      md: 960,
      lg: 1280,
      xl: 1700,
      xxl: 1920,
    },
  },
  // global overrides for MUI styles...
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'unset',
        fontFamily: 'Roboto500',
        '&: disabled': {
          cursor: 'not-allowed',
        },
      },
      contained: {
        borderRadius: '17px',
        fontSize: '13px',
        lineHeight: '15px',
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
        backgroundColor: colors.celigoWhite,
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
        padding: '6px 20px',
        border: '1px solid',
        '&:disabled': {
          color: colors.celigoNeutral4,
          background: colors.celigoNeutral2,
          borderColor: colors.celigoNeutral3,
        },
      },
      outlinedPrimary: {
        backgroundColor: colors.celigoAccent2,
        borderColor: colors.celigoAccent2,
        color: colors.celigoWhite,
        '&:hover': {
          backgroundColor: colors.celigoAccent3,
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
      },

      text: {
        textTransform: 'uppercase',
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
        // BorderBottom should be like this, because color is taking precendence here
        borderBottom: `1px solid ${colors.celigoNeutral3}`,
        '&$selected': {
          backgroundColor: colors.celigoNeutral2,
          '&:before': {
            background: colors.celigoAccent3,
          },
          '&:hover': {
            backgroundColor: colors.celigoNeutral2,
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
        fontFamily: `Roboto400, sans-serif`,
      },
      body1: {
        fontSize: '17px',
        lineHeight: '22px',
        letterSpacing: 'normal',
        fontFamily: 'source sans pro',
      },
      body2: {
        fontSize: '16px',
        lineHeight: '20px',
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
    MuiTableRow: {
      root: {
        background: colors.celigoWhite,
        position: 'relative',
        '&:hover': {
          '&:hover': {
            background: colors.celigoNeutral2,
          },
        },
      },
      head: {
        '&:hover': {
          background: `white !important`,
        },
      },
    },
    MuiTableCell: {
      root: {
        position: 'relative',
        padding: [[11, 16]],
        borderBottomColor: colors.celigoNeutral3,
      },
      head: {
        fontFamily: 'Roboto500',
        color: colors.celigoNeutral6,
        fontSize: 15,
      },
      body: {
        fontFamily: 'source sans pro',
        position: 'relative',
        fontSize: 15,
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
          '&:hover': {
            borderColor: colors.celigoNeutral3,
          },
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
        '&$disabled': {
          background: colors.celigoNeutral3,
        },
      },
      input: {
        '&:invalid': {
          borderColor: colors.celigoError,
        },
      },
    },
    MuiIconButton: {
      root: {
        color: colors.celigoNeutral6,
        '&: disabled': {
          cursor: 'not-allowed',
        },
      },
    },
    MuiDialogTitle: {
      root: {
        padding: '14px 24px',
        borderBottom: `1px solid ${colors.celigoNeutral3}`,
      },
    },
    MuiDialogContent: {
      root: {
        padding: '24px',
        background: colors.celigoNeutral1,
      },
    },
    MuiDialogActions: {
      root: {
        padding: '14px 24px',
      },
    },
    MuiExpansionPanelSummary: {
      root: {
        padding: '0px 12px',
      },
    },
    MuiChip: {
      root: {
        backgroundColor: colors.celigoNeutral3,
        color: colors.celigoNeutral8,
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: 'rgba(106, 124, 138, 0.7)',
      },
    },
  },
};

export default () => {
  const muiTheme = createMuiTheme(theme);

  muiTheme.palette.success = muiTheme.palette.augmentColor({
    main: colors.celigoSuccess,
    contrastText: colors.celigoWhite,
  });
  muiTheme.palette.warning = muiTheme.palette.augmentColor({
    main: colors.celigoWarning,
  });
  muiTheme.palette.info = muiTheme.palette.augmentColor({
    main: colors.celigoAccent2,
    contrastText: colors.celigoWhite,
  });

  return muiTheme;
};
