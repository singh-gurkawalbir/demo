/* eslint-disable no-param-reassign */
import { createMuiTheme } from '@material-ui/core/styles';
import { merge } from 'lodash';
import produce from 'immer';
import styleguideTheme from '../styleguide/style';
import colors from '../theme/colors';
import light from './light';
import dark from './dark';

const DEFAULT_THEME = 'light';
const themes = {
  light,
  dark,
};

// TODO: Revert this to support custom theme again.
// temporarily disabling this since we have no
// theme switch in the UI, and are stuck with a half-implemented dark-theme.
// export default (name = DEFAULT_THEME) => {
export default () => {
  const name = DEFAULT_THEME;
  const defaultTheme = themes[DEFAULT_THEME];
  // eslint-disable-next-line no-unused-vars
  const theme = produce(defaultTheme, draft => {
    if (name !== DEFAULT_THEME) {
      draft = merge(draft, themes[name]);
    }
  });
  const muiTheme = createMuiTheme(theme);

  // for now, these success/warning/info colors are
  // global for all themes. We may need to branch them
  // for light/dark.
  muiTheme.palette.success = muiTheme.palette.augmentColor({
    main: colors.celigoSuccess,
    contrastText: colors.celigoWhite,
  });
  muiTheme.palette.warning = muiTheme.palette.augmentColor({
    main: colors.celigoWarning,
  });
  muiTheme.palette.info = muiTheme.palette.augmentColor({
    main: colors.celigoAccent2,
    contrastText: colors.celigoWhite,
  });

  // eslint-disable-next-line
  // console.log('*** THEME ***', theme);

  return {
    ...muiTheme,
    styleguide: styleguideTheme(muiTheme),
  };
};
