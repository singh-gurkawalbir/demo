/* eslint-disable no-param-reassign */
const { join, resolve } = require('path');
const { sections } = require('./docs/sections');

require('@babel/register')({
  plugins: [
    ['@babel/plugin-transform-modules-commonjs', { strict: false }]
  ]
});
const themeProvider = require('./src/theme/themeProvider').default;

const theme = themeProvider();

module.exports = {
  components: 'src/components/**/*.jsx',
  contextDependencies: [resolve(__dirname, 'src/components')],

  // https://react-styleguidist.js.org/docs/configuration.html#skipcomponentswithoutexample
  skipComponentsWithoutExample: true,

  // https://react-styleguidist.js.org/docs/configuration.html#pagepersection
  pagePerSection: true,

  theme: theme.styleguide,
  styles: {
    Editor: {
      root: {
        backgroundColor: '#f1f1f1',
      },
    },
    Pre: {
      pre: {
        backgroundColor: '#f1f1f1',
      },
    },
  },
  styleguideComponents: {
    Wrapper: join(__dirname, 'src/styleguide/Wrapper.jsx'),
  },

  // https://react-styleguidist.js.org/docs/configuration.html#sections
  sections,

  // https://react-styleguidist.js.org/docs/configuration.html#require
  // leaving this as an example only... we should be using the `styles`
  // setting above directly to control css overrides for the Style guide.
  // require: [join(__dirname, 'src/styleguide/styles.css')],

  // https://react-styleguidist.js.org/docs/configuration.html#dangerouslyupdatewebpackconfig
  // eslint-disable-next-line no-unused-vars
  dangerouslyUpdateWebpackConfig: (webpackConfig, env) => {
    webpackConfig.devtool = 'inline-source-map';
    webpackConfig.optimization = webpackConfig.optimization || {};
    webpackConfig.optimization.minimize = false;

    return webpackConfig;
  }
};
