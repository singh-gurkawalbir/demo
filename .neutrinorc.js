const { join } = require('path');

require('babel-register')({
  plugins: [
    [
      require.resolve('babel-plugin-transform-es2015-modules-commonjs'),
      {
        useBuiltIns: true,
      },
    ],
    require.resolve('babel-plugin-transform-object-rest-spread'),
  ],
  cache: false,
});

const themeProvider = require('./src/themeProvider').default;
const theme = themeProvider('light');

module.exports = {
  use: [
    // [
    //   'neutrino-preset-mozilla-frontend-infra/node',
    //   {
    //     // Add additional Babel plugins, presets, or env options
    //     babel: {
    //       plugins: ['babel-plugin-transform-optional-chaining'],
    //     },
    //   },
    // ],

    [
      '@neutrinojs/jest',
      {
        // TODO: add jest config to set proper threshholds for "success"
        // this will be important when we force a precommit rule to pass
        // the jest test runner... the thresholds are needed to tell the
        // jest cli to not return error codes... Lets set code coverage to
        // 80%.
        bail: false,
        testRegex: undefined,
        collectCoverage: true,
        collectCoverageFrom: [
          // If we consistently follow the current abstractions,
          // these should be the only folders that need test coverage...
          'src/actions/**/*.{js,jsx}',
          'src/reducers/**/*.{js,jsx}',
          'src/sagas/**/*.{js,jsx}',
          // 'src/utils/**/*.{js,jsx}',
        ],
        coverageThreshold: {
          global: {
            statements: 75,
            branches: 70,
            functions: 70,
            lines: 80,
          },
        },
      },
    ],
    [
      'neutrino-preset-mozilla-frontend-infra/styleguide',
      {
        components: 'src/components/**/index.jsx',
        theme: theme.styleguide,
        styles: {
          StyleGuide: theme.styleguide.StyleGuide,
        },
        editorConfig: {
          theme: 'material',
        },
        showUsage: true,
        skipComponentsWithoutExample: false,
        styleguideComponents: {
          Wrapper: join(__dirname, 'src/styleguide/ThemeWrapper.jsx'),
          StyleGuideRenderer: join(
            __dirname,
            'src/styleguide/StyleGuideRenderer.jsx'
          ),
        },
      },
    ],
    [
      'neutrino-preset-mozilla-frontend-infra/react',
      {
        html: {
          title: 'Integrator UI',
        },
        devServer: {
          port: 4000,
          publicPath: '/pg',
          host: 'localhost.io',
          historyApiFallback: {
            index: '/pg/index.html',
          },
        },
        eslint: {
          //  parser: 'babel-eslint',
          // plugins: ['jest'],
          // globals: {
          //   expect: true,
          //   text: true,
          // },
          rules: {
            // This is disabled in next airbnb preset release for
            // React 16.3 compatibility
            'react/no-did-mount-set-state': 'off',
            'no-underscore-dangle': 'off',
          },
        },
      },
    ],
    [
      '@neutrinojs/env',
      [
        'API_ENDPOINT',
        'API_EMAIL',
        'API_PASSWORD',
        'AUTO_LOGIN',
        'NETWORK_THRESHOLD',
      ],
    ],
    neutrino => {
      neutrino.config.devServer.proxy({
        '/signin': {
          target: process.env.API_ENDPOINT,
        },
        '/api': {
          target: process.env.API_ENDPOINT,
          // pathRewrite: {
          //  '^/api': '',
          // },
          secure: false,
          changeOrigin: true,
          onProxyRes: proxyRes => {
            // Strip the cookie `secure` attribute, otherwise prod cookies
            // will be rejected by the browser when using non-HTTPS localhost:
            // https://github.com/nodejitsu/node-http-proxy/pull/1166
            // const removeSecure = str => str.replace(/; secure/i, '')
            // const setCookie = proxyRes.headers['set-cookie']
            //
            // if (setCookie) {
            //   proxyRes.headers['set-cookie'] = Array.isArray(setCookie)
            //     ? setCookie.map(removeSecure)
            //     : removeSecure(setCookie)
            // }
          },
        },
      });
      neutrino.config.output.publicPath('/pg/');
    },
  ],
};
