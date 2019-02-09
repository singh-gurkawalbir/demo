import { createMuiTheme } from '@material-ui/core/styles';
import { DEFAULT_THEME } from './reducers/user/preferences';

const Roboto300 = { fontFamily: 'Roboto300, sans-serif' };
const Roboto400 = { fontFamily: 'Roboto400, sans-serif' };
const Roboto500 = { fontFamily: 'Roboto500, sans-serif' };
const celigo = {
  blue: '#0E7DC1',
  lightBlue: '#12C7FF',
  orange: '#FFA424',
  grey: '#95ABBC',
  darkGrey: '#6A7B89', // - TEXT
  charcoalGrey: '#424E59',
  darkDarkGrey: '#323E49',
  lightGrey: '#D9D8DC', // was D6E4ED?'
  superLightGrey: '#F0F5F9',
  superDuperLightGrey: '#F8FAFC',
  white: '#FFFFFF',
};
const themes = {
  light: {
    name: 'Celigo Light Theme',
    overrides: {
      appBar: {
        background: celigo.darkGrey,
        contrast: celigo.superLightGrey,
        hover: celigo.white,
        // Deprecated: Temporary until the waffle icons are built properly...
        iconBackground: celigo.lightGrey,
      },
      editor: {
        panelBackground: celigo.superLightGrey,
        panelBorder: celigo.superLightGrey,
      },
      palette: {
        type: 'light',
        background: {
          paper: celigo.superDuperLightGrey,
          default: celigo.white,
        },
        // action: {[object]},
        primary: {
          main: celigo.orange,
        },
        secondary: {
          light: celigo.lightBlue,
          main: celigo.blue,
        },
        text: {
          primary: celigo.darkGrey,
          // secondary: '#rrggbb',
          // disabled: '#rrggbb',
          // hint: '#rrggbb',
        },
      },
    },
  },
  dark: {
    name: 'Celigo Dark Theme',
    overrides: {
      appBar: {
        background: celigo.darkDarkGrey,
        contrast: celigo.grey,
        hover: celigo.white,
        iconBackground: celigo.grey,
      },
      editor: {
        panelBackground: celigo.darkDarkGrey,
        panelBorder: celigo.darkDarkGrey,
      },
      palette: {
        type: 'dark',
        background: {
          paper: celigo.darkGrey,
          default: celigo.charcoalGrey,
        },
        // action: {[object]},
        primary: {
          main: celigo.orange,
        },
        secondary: {
          light: celigo.lightBlue,
          main: celigo.blue,
        },
        text: {
          primary: celigo.lightGrey,
          // secondary: '#rrggbb',
          // disabled: '#rrggbb',
          // hint: '#rrggbb',
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
const unit = 8;
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
    unit,
    double: unit * 2,
    triple: unit * 3,
    quad: unit * 4,
  },
  drawerWidth: 320,
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
