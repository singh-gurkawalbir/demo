import { createMuiTheme } from '@material-ui/core/styles';
import colors from '../theme/colors';

const theme = {
  spacing: 8,
  drawerWidth: 240,
  pageBarHeight: 72,
  palette: {
    type: 'light',
    primary: {
      main: colors.celigoAccent3,
    },
    secondary: {
      main: colors.celigoNeutral7,
      contrastText: colors.celigoNeutral4,
    },
  },
  // global overrides for MUI styles...
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'unset',
      },
    },
  },
};

export default () => createMuiTheme(theme);
