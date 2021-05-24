import { create } from '@storybook/theming';

// NOTE: If you make changes to this file, the manager cache must be reset for the
// changes to be visible.
// details here: https://github.com/storybookjs/storybook/issues/13200
// > yarn storybook --no-manager-cache
export default create({
  //Limited theme variables has support in storybook now so reverting the styles for now.
  brandTitle: 'Celigo Styleguide',
  brandImage: 'https://www.celigo.com/wp-content/uploads/celigo-logo.svg',
});