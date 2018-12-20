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

const getProxyOpts = () => {
  const target = process.env.API_ENDPOINT;
  const isSecure = target.toLowerCase().startsWith('https://');

  console.log('is API secure? ' + isSecure);

  const commonOpts = {
    target,
    secure: false,
    changeOrigin: true,
    // pathRewrite: {
    //  '^/api': '',
    // },
  };

  if (!isSecure) {
    return commonOpts;
  }

  return Object.assign({}, commonOpts, {
    onProxyRes: proxyRes => {
      // Strip the cookie `secure` attribute, otherwise prod cookies
      // will be rejected by the browser when using non-HTTPS localhost:
      // https://github.com/nodejitsu/node-http-proxy/pull/1166
      const removeSecure = str => str.replace(/; Secure/i, '');
      // console.log(proxyRes.headers);
      const setCookie = proxyRes.headers['set-cookie'];

      if (setCookie) {
        proxyRes.headers['set-cookie'] = Array.isArray(setCookie)
          ? setCookie.map(removeSecure)
          : removeSecure(setCookie);
      }
    },
  });
};

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
            'react/jsx-filename-extension': [
              1,
              { extensions: ['.js', '.jsx'] },
            ],
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
        'CDN_BASE_URI',
        'ADD_NETWORK_LATENCY',
      ],
    ],
    neutrino => {
      const proxyOpts = getProxyOpts();

      neutrino.config.devServer.proxy({
        '/signin': proxyOpts,
        '/signout': proxyOpts,
        '/csrf': proxyOpts,
        '/api': proxyOpts,
      });
      neutrino.config.output.publicPath('/pg/');
    },
  ],
};
