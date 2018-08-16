import { createMuiTheme } from '@material-ui/core/styles';

const Roboto300 = { fontFamily: 'Roboto300, sans-serif' };
const Roboto400 = { fontFamily: 'Roboto400, sans-serif' };
const Roboto500 = { fontFamily: 'Roboto500, sans-serif' };
const themes = {
  light: {
    name: 'Celigo Light Theme',
    overrides: {
      palette: {
        type: 'light',
      },
    },
  },
  dark: {
    name: 'Celigo Dark Theme',
    overrides: {
      palette: {
        type: 'dark',
      },
    },
  },
};
const defaultTheme = {
  typography: {
    ...Roboto400,
    display4: Roboto300,
    display3: Roboto400,
    display2: Roboto400,
    display1: Roboto400,
    headline: Roboto400,
    title: Roboto500,
    subheading: Roboto400,
    body2: Roboto500,
    body1: Roboto400,
    caption: Roboto400,
    button: Roboto500,
  },
  spacing: {
    unit: 8,
    double: 16,
    triple: 24,
    quad: 32,
  },
  drawerWidth: 240,
};

export default name => {
  const theme = createMuiTheme({ ...defaultTheme, ...themes[name].overrides });

  return {
    ...theme,
    styleguide: {
      StyleGuide: {
        root: {
          overflowY: 'scroll',
          minHeight: '100vh',
        },
      },
      fontFamily: {
        base: theme.typography.fontFamily,
      },
      fontSize: {
        base: theme.typography.fontSize - 1,
        text: theme.typography.fontSize,
        small: theme.typography.fontSize - 2,
      },
      color: {
        base: theme.palette.text.primary,
        link: theme.palette.text.primary,
        linkHover: theme.palette.text.primary,
        border: theme.palette.divider,
        sidebarBackground: theme.palette.primary.main,
        codeBackground: theme.palette.primary.main,
      },
      sidebarWidth: theme.drawerWidth,
      maxWidth: '100vw',
    },
  };
};
