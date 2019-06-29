import { createMuiTheme } from '@material-ui/core/styles';
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
