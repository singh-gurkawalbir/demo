import { create } from '@storybook/theming';
import theme from '../src/theme/light';

export default create({
  base: 'light',
  colorPrimary: theme.palette.warning.main,
  colorSecondary: theme.palette.primary.main,

  // UI
  appBg: theme.palette.secondary.main,
  appContentBg: theme.palette.background.paper,
  appBorderColor: theme.palette.secondary.lightest,
  appBorderRadius: 4,

  // Text colors
  textColor: 'white',
  textInverseColor: 'rgba(0,0,0,0.9)',

  // Toolbar default and active colors
  barTextColor: theme.palette.secondary.main,
  barSelectedColor: theme.palette.primary.main,
  barBg: theme.palette.background.paper2,

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: 'black',
  inputBorderRadius: 4,

  brandTitle: 'Celigo Styleguide',
  brandImage: 'https://www.celigo.com/wp-content/uploads/celigo-logo.svg',
});