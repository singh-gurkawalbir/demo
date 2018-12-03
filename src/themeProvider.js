import { createMuiTheme } from '@material-ui/core/styles';
import { DEFAULT_THEME } from './reducers/user';

const Roboto300 = { fontFamily: 'Roboto300, sans-serif' };
const Roboto400 = { fontFamily: 'Roboto400, sans-serif' };
const Roboto500 = { fontFamily: 'Roboto500, sans-serif' };
/*
  Celigo Blue - #0E7DC1
  Celigo Lt Blue #12C7FF
  Celigo Orange - #FFA424
  Celigo Charcoal Grey - #424E59
  Celigo Dark Grey - #6A7B89 - TEXT
  Celigo Grey -#95ABBC
  Celigo Lt Grey -#D6E4ED
  Celigo Super Lt Grey - #F0F5F9
  Celigo White - #FFFFFF
*/
const themes = {
  light: {
    name: 'Celigo Light Theme',
    overrides: {
      appBarBackground: '#6A7B89', // Celigo Dark Grey,
      appBarContrast: '#F0F5F9', // Celigo Super Lt Grey,
      palette: {
        type: 'light',
        background: {
          paper: '#D6E4ED', // Lt Grey
          default: '#F0F5F9', // Celigo Super Lt Grey
        },
        // action: {[object]},
        primary: {
          main: '#FFA424', // Celigo Orange
        },
        secondary: {
          light: '#12C7FF', // Celigo Lt Blue #12C7FF
          main: '#0E7DC1', // Celigo Blue
        },
        // text: {
        //   primary: '#rrggbb',
        //   secondary: '#rrggbb',
        //   disabled: '#rrggbb',
        //   hint: '#rrggbb',
        // },
      },
    },
  },
  dark: {
    name: 'Celigo Dark Theme',
    overrides: {
      // appBarBackground: '#424E59', // Celigo Charcoal Grey,
      appBarBackground: '#323E49',
      appBarContrast: '#95ABBC', // Celigo Grey,
      palette: {
        type: 'dark',
        background: {
          paper: '#677A89', // Dark Grey
          default: '#424E59', // Celigo Charcoal Grey,
        },
        // action: {[object]},
        primary: {
          main: '#FFA424', // Celigo Orange
        },
        secondary: {
          light: '#12C7FF', // Celigo Lt Blue #12C7FF
          main: '#0E7DC1', // Celigo Blue
        },
        // error: {
        //   light: '#rrggbb',
        //   main: '#rrggbb',
        //   dark: '#rrggbb',
        // },
      },
    },
  },
};
const defaultTheme = {
  typography: {
    useNextVariants: true,
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
  let themeName;

  if (!name) themeName = DEFAULT_THEME;
  else themeName = name;

  const theme = createMuiTheme({
    ...defaultTheme,
    ...themes[themeName].overrides,
  });

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
