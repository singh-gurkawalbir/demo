import { create } from '@storybook/theming';
import theme from '../src/theme/light';

export default create({
  //Limited theme variables has support in storybook now so reverting the styles for now.
  brandTitle: 'Celigo Styleguide',
  brandImage: 'https://www.celigo.com/wp-content/uploads/celigo-logo.svg',
});