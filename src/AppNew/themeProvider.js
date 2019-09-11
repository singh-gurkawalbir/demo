import { createMuiTheme } from '@material-ui/core/styles';
import colors from '../theme/colors';

const appBarHeight = 36;
const theme = {
  spacing: 8,
  drawerWidth: 240,
  appBarHeight,
  pageBarHeight: 64,

  palette: {
    type: 'light',
    background: {
      paper: colors.celigoWhite,
      paper2: colors.celigoNeutral2,
      default: colors.celigoNeutral1,
      arrowAfter: colors.celigoNeutral3,
    },
    primary: {
      light: colors.celigoAccent3,
      main: colors.celigoAccent2,
      dark: colors.celigoAccent1,
    },
    secondary: {
      lightest: colors.celigoNeutral1,
      light: colors.celigoNeutral6,
      main: colors.celigoNeutral8,
      dark: colors.celigoNeutral9,
      contrastText: colors.celigoNeutral4,
    },
    text: {
      disabled: colors.celigoNeutral4,
      primary: colors.celigoNeutral6,
    },
  },
  // global overrides for MUI styles...
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'unset',
      },
    },
    MuiToolbar: {
      dense: {
        minHeight: appBarHeight,
      },
    },
    MuiTypography: {
      body1: {
        fontSize: '15px',
        fontWeight: '400',
        lineHeight: '22px',
        letterSpacing: 'normal',
        fontFamily: 'source sans pro',
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
          backgroundColor: '#eee',
          boxShadow: `2px 2px 4px rgba(0,0,0,0.1)`,
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

  return muiTheme;
};
