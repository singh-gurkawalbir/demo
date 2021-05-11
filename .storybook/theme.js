import { create } from '@storybook/theming';
import theme from '../src/theme/light';

export default create({
  /*Limited theme variables provided by Storybook, so reverting all the styles */
  brandTitle: 'Celigo Styleguide',
  brandImage: 'https://www.celigo.com/wp-content/uploads/celigo-logo.svg',
});