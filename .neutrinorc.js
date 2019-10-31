const { join } = require('path');
const { sections } = require('./docs/sections');
const {deepClone} =require('fast-json-patch');
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

const themeProvider = require('./src/theme/themeProvider').default;
const theme = themeProvider();
const getProxyOpts = () => {
  console.log(`API endpoint: [${process.env.API_ENDPOINT}]`);

  const target = process.env.API_ENDPOINT || '';
  const secure = target && target.toLowerCase().startsWith('https://');

  console.log(`API Target: ${target}`);
  if (secure) console.log('Cookie rewrite needed for secure API host.');

  const opts = {
    target,
    secure,
    changeOrigin: true,
    timeout: 10 * 60 * 1000,
    // pathRewrite: {
    //  '^/api': '',
    // },
  };

  if (secure) {
    opts.onProxyRes = proxyRes => {
      // Strip the cookie `secure` attribute, otherwise prod cookies
      // will be rejected by the browser when using non-HTTPS localhost:
      // https://github.com/nodejitsu/node-http-proxy/pull/1166
      const removeSecure = str => str.replace(/; Secure/i, '');

      // *** Note we also need to replace the cookie domain so the
      // browser associates it with this local dev server...
      // the regex in use matches any domain (prod, dev, stage, etc)
      const swapDomain = str =>
        str.replace(/Domain=(.*?).io;/i, 'Domain=.localhost.io;');

      const setCookie = proxyRes.headers['set-cookie'];

      if (setCookie) {
        proxyRes.headers['set-cookie'] = Array.isArray(setCookie)
          ? setCookie.map(c => swapDomain(removeSecure(c)))
          : swapDomain(removeSecure(setCookie));
      }
    };
  }

  return opts;
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

        setupFiles: ['jest-date-mock', 'core-js'],
        coverageThreshold: {
          global: {
            statements: 75,
            branches: 65,
            functions: 65,
            lines: 80,
          },
        },
      },
    ],
    [
      'neutrino-preset-mozilla-frontend-infra/styleguide',
      {
        pagePerSection: true,
        theme: theme.styleguide,
        editorConfig: { theme: 'material' },
        styles: {
          StyleGuide: theme.styleguide.StyleGuide,
        },
        styleguideComponents: {
          Wrapper: join(__dirname, 'src/styleguide/ThemeWrapper.jsx'),
          StyleGuideRenderer: join(
            __dirname,
            'src/styleguide/StyleGuideRenderer.jsx'
          ),
        },

        sections: sections,
        require: [join(__dirname, 'docs/styles.css')],
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
          plugins: ['react-hooks'],
          rules: {
            // This is disabled in next airbnb preset release for
            // React 16.3 compatibility
            'max-len': 'off',
            'react/jsx-filename-extension': [
              1,
              { extensions: ['.js', '.jsx'] },
            ],
            'react/no-did-mount-set-state': 'off',
            'no-underscore-dangle': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'no-param-reassign': [
              'error',
              {
                props: true,
                ignorePropertyModificationsFor: ['draft', 'acc', 'response'],
              },
            ],
          },
        },
      },
    ],
    [
      '@neutrinojs/env',
      [
        "API_ENDPOINT",
        "API_EMAIL",
        "API_PASSWORD",
        "AUTO_LOGIN",
        "NETWORK_THRESHOLD",
        "CDN_BASE_URI",
        "ADD_NETWORK_LATENCY",
        "HELPER_FUNCTIONS_INTERVAL_UPDATE",
        "USE_NEW_APP",
        "AGENT_STATUS_INTERVAL",
        "MASK_SENSITIVE_INFO_DELAY",
        "SESSION_WARNING_INTERVAL_PRIOR_TO_EXPIRATION",
        "SESSION_EXPIRATION_INTERVAL"
      ]
    ],
    neutrino => {
      const proxyOpts = getProxyOpts();
      //needed for our test cases....
      neutrino.config.when (process.env.NODE_ENV === 'test',config=>{
        config.module.rule('compile').use('babel').tap(
          origOptions=>{ 
            const options =deepClone(origOptions);
            //if the dependency isn't there then that could be a problem
            options.plugins.push('babel-plugin-dynamic-import-node');
        
            const babelEnvPreset = options.presets.find(preset => Array.isArray(preset) && preset[0].includes('babel-preset-env'));
            if(babelEnvPreset)
              delete babelEnvPreset[1].exclude;
            return options;
          
          }
        )
      });
      neutrino.config.devServer.proxy({
        '/signin': proxyOpts,
        '/signout': proxyOpts,
        '/csrf': proxyOpts,
        '/api': proxyOpts,
        '/netSuiteWS': proxyOpts,
        '/connection': proxyOpts,
      });
      neutrino.config.output.publicPath('/pg/');
    },
  ],
};
