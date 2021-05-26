/* eslint-disable no-param-reassign */
import { createMuiTheme } from '@material-ui/core/styles';
import { merge } from 'lodash';
import produce from 'immer';
import styleguideTheme from '../styleguide/style';
import light from './light';
import dark from './dark';
import sandbox from './sandbox';

const DEFAULT_THEME = 'light';
const themes = {
  light,
  dark,
  sandbox,
};

export default (name = DEFAULT_THEME) => {
  const defaultTheme = themes[DEFAULT_THEME];
  // eslint-disable-next-line no-unused-vars
  const theme = produce(defaultTheme, draft => {
    if (name !== DEFAULT_THEME) {
      draft = merge(draft, themes[name]);
    }
  });
  const muiTheme = createMuiTheme(theme);
  // eslint-disable-next-line
  // console.log(`*** THEME ${name} ***`, theme);

  return {
    ...muiTheme,
    styleguide: styleguideTheme(muiTheme),
  };
};
