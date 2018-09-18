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
    // "@neutrinojs/node",
    [
      '@neutrinojs/jest',
      {
        bail: false,
        testRegex: undefined,
        // testPathIgnorePatterns: [
        //   "/node_modules/",
        //   "/src/views/",
        //   "/src/components/"
        // ],
        // collectCoverageFrom: [
        //   "!<rootDir>/node_modules/",
        //   "!<rootDir>/build/",
        //   "!<rootDir>/src/views",
        //   "!<rootDir>/src/components",
        //   "!<rootDir>/src/actions",
        //   "src/reducers/**/*.{js,jsx}",
        //   "src/sagas/**/*.{js,jsx}"
        // ]
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
            disableDotRule: true,
          },
        },
        eslint: {
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
    ['@neutrinojs/env', ['API_ENDPOINT', 'API_EMAIL', 'API_PASSWORD']],
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

//
