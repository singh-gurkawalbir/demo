import { createMuiTheme } from '@material-ui/core/styles';
import { DEFAULT_THEME } from '../reducers/user/preferences';
import colors from './colors';
import styleguideTheme from '../styleguide/style';
import defaults from './defaults';

const themes = {
  light: {
    name: 'Celigo Light Theme',
    overrides: {
      appBar: {
        background: colors.darkGrey,
        contrast: colors.superLightGrey,
        hover: colors.white,
        // Deprecated: Temporary until the waffle icons are built properly...
        iconBackground: colors.lightGrey,
      },
      editor: {
        panelBackground: colors.superLightGrey,
        panelBorder: colors.superLightGrey,
      },
      palette: {
        type: 'light',
        background: {
          paper: colors.white,
          default: colors.superDuperLightGrey,
          // success:
          // warning: celigo.orange
          // error:
        },
        // action: {[object]},
        primary: {
          main: colors.lightBlue,
        },
        secondary: {
          light: colors.lightBlue,
          main: colors.blue,
        },
        text: {
          primary: colors.darkGrey,
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
        background: colors.charcoalGrey,
        contrast: colors.grey,
        hover: colors.white,
        iconBackground: colors.grey,
      },
      editor: {
        panelBackground: colors.charcoalGrey,
        panelBorder: colors.charcoalGrey,
      },
      palette: {
        type: 'dark',
        background: {
          paper: colors.darkGrey,
          default: colors.charcoalGrey,
        },
        // action: {[object]},
        primary: {
          main: colors.orange,
        },
        secondary: {
          light: colors.lightBlue,
          main: colors.blue,
        },
        text: {
          primary: colors.lightGrey,
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

export default name => {
  let themeName;

  if (!name) themeName = DEFAULT_THEME;
  else themeName = name;

  const theme = createMuiTheme({
    ...defaults,
    ...themes[themeName].overrides,
  });

  return {
    ...theme,
    styleguide: styleguideTheme(theme),
  };
};
