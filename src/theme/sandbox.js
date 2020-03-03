import colors from './colors';

export default {
  palette: {
    type: 'light',
    background: {
      paper: colors.celigoWhite,
      paper2: colors.celigoNeutral2,
      default: colors.celigoSandbox1,
      drawer: colors.celigoSandbox5,
      drawer2: colors.celigoSandbox4,
      drawerActive: colors.celigoSandbox2, // hover/active bg for sidebar nav items
    },
    primary: {
      light: colors.celigoAccent3,
      main: colors.celigoAccent2,
      dark: colors.celigoAccent1,
    },
    secondary: {
      lightest: colors.celigoNeutral3,
      light: colors.celigoNeutral6,
      main: colors.celigoSandbox4,
      // dark.. why is there no dark? bug?
      darkest: colors.celigoSandbox5,
      contrastText: colors.celigoNeutral4,
    },
    text: {
      disabled: colors.celigoNeutral4,
      primary: colors.celigoNeutral6,
      hint: colors.celigoNeutral5,
      // secondary: colors.celigoSandbox3,
      secondary: colors.celigoNeutral7,
    },
  },
  // global overrides for MUI styles...
  overrides: {},
};
