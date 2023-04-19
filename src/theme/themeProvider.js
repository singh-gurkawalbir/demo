/* eslint-disable no-param-reassign */
import { createTheme, adaptV4Theme } from '@mui/material/styles';
import { merge } from 'lodash';
import produce from 'immer';
import light from './light';
import dark from './dark';
import orion from './orion';
import sandbox from './sandbox';

const DEFAULT_THEME = 'light';
const themes = {
  light,
  dark,
  orion,
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
  const muiTheme = createTheme(adaptV4Theme(theme));
  // eslint-disable-next-line
  // console.log(`*** THEME ${name} ***`, theme);

  return {
    ...muiTheme,
  };
};
