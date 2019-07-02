import colors from './colors';

export default {
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
};
