import { createMuiTheme } from '@material-ui/core/styles';
import { cloneDeep, merge } from 'lodash';
import { DEFAULT_THEME } from '../reducers/user/preferences';
import styleguideTheme from '../styleguide/style';
import defaults from './defaults';
import light from './light';
import dark from './dark';

const themes = {
  light,
  dark,
};

export default name => {
  const themeName = name || DEFAULT_THEME;
  const theme = createMuiTheme(merge(cloneDeep(defaults), themes[themeName]));

  // console.log(theme);

  return {
    ...theme,
    styleguide: styleguideTheme(theme),
  };
};
