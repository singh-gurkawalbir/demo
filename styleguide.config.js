const { join, resolve } = require('path');
const { sections } = require('./docs/sections');

require('@babel/register')({
  plugins: [
    ['@babel/plugin-transform-modules-commonjs', { strict: false }]
  ]
});
const themeProvider = require('./src/theme/themeProvider').default;

const theme = themeProvider()

module.exports = {
  components: 'src/components/**/*.jsx',
  contextDependencies: [resolve(__dirname, 'src/components')],

  // https://react-styleguidist.js.org/docs/configuration.html#skipcomponentswithoutexample
  skipComponentsWithoutExample: true,

  // https://react-styleguidist.js.org/docs/configuration.html#pagepersection
  pagePerSection: true,

  theme: theme.styleguide,
  styles: {
    // TODO: figure out what this prop was used for and if we still need it!
    // StyleGuide: theme.styleguide.StyleGuide,
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
    // TODO: Unable to simply wrap the styleguide. The base implementation somehow 
    // constructs props that are not available in the wrapped version. This will
    // take more time to investigate and the only current use of this wrapper was to 
    // load the <FontStager> once. For now I moved this to the Wrapper, which just
    // includes the <FontStager> on every example... overkill, but works.
    //StyleGuideRenderer: join(
    //  __dirname,
    //  'src/styleguide/StyleGuide.jsx'
    //),
  },

  // https://react-styleguidist.js.org/docs/configuration.html#sections
  sections,

  // https://react-styleguidist.js.org/docs/configuration.html#require
  // leaving this as an example only... we should be using the `styles`
  // setting above directly to control css overrides for the Style guide.
  // require: [join(__dirname, 'src/styleguide/styles.css')],

  // https://react-styleguidist.js.org/docs/configuration.html#dangerouslyupdatewebpackconfig
  dangerouslyUpdateWebpackConfig: (webpackConfig, env) => {
    webpackConfig.devtool = 'inline-source-map';
    webpackConfig.optimization = webpackConfig.optimization || {};
    webpackConfig.optimization.minimize = false;
    return webpackConfig;
  }
}
