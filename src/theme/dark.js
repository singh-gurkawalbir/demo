import colors from './colors';

export default {
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
};
