const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const DotenvPlugin = require('dotenv-webpack');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '.env') }).parsed;
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = {
  target: 'web',
  entry: './src/index.jsx',
  externals: {
    fs: 'fs',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          },
        }],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'static/images/',
          },
        },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'static/fonts/',
            },
          },
        ],
      },
      {
        test: /ace-builds.*\/worker-.*$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: '[name].[hash:8].[ext]',
              outputPath: 'static/ace/',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
  plugins: [
    new DotenvPlugin(),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new HtmlWebpackInjectAttributesPlugin({
      crossorigin: 'anonymous',
    }),
    // define LOGROCKET_IDENTIFIER for logrocket
    new webpack.DefinePlugin({
      RELEASE_VERSION: JSON.stringify(process.env.RELEASE_VERSION),
      LOGROCKET_IDENTIFIER: JSON.stringify(process.env.LOGROCKET_IDENTIFIER),
      LOGROCKET_IDENTIFIER_EU: JSON.stringify(process.env.LOGROCKET_IDENTIFIER_EU),
      CDN_BASE_URI: JSON.stringify(process.env.CDN_BASE_URI),
      SCHEDULE_SHIFT_FOR_FLOWS_CREATED_AFTER: JSON.stringify(process.env.SCHEDULE_SHIFT_FOR_FLOWS_CREATED_AFTER),
      SECOND_SCHEDULE_SHIFT_FOR_FLOWS_CREATED_AFTER: JSON.stringify(process.env.SECOND_SCHEDULE_SHIFT_FOR_FLOWS_CREATED_AFTER),
      GA_KEY_1: JSON.stringify(process.env.GA_KEY_1),
      GA_KEY_2: JSON.stringify(process.env.GA_KEY_2),
      GA_KEY_1_EU: JSON.stringify(process.env.GA_KEY_1_EU),
      GA_KEY_2_EU: JSON.stringify(process.env.GA_KEY_2_EU),
      IO_LOGIN_PROMOTION_URL: JSON.stringify(process.env.IO_LOGIN_PROMOTION_URL),
      IO_SIGNUP_PROMOTION_URL: JSON.stringify(process.env.IO_SIGNUP_PROMOTION_URL),
      IO_LOGIN_PROMOTION_URL_EU: JSON.stringify(process.env.IO_LOGIN_PROMOTION_URL_EU),
      IO_SIGNUP_PROMOTION_URL_EU: JSON.stringify(process.env.IO_SIGNUP_PROMOTION_URL_EU),
      PORTAL_URL: JSON.stringify(process.env.PORTAL_URL),
      SHOPIFY_USER_IDS: JSON.stringify(process.env.SHOPIFY_USER_IDS),
      //  Note that because the plugin does a direct text replacement, the value given to it must include actual quotes inside of the string itself.
      //  Typically, this is done either with alternate quotes, such as '"true"', or by using JSON.stringify('true').
      //  Reference: https://webpack.js.org/plugins/define-plugin/
      ALLOW_SIGNUP: JSON.stringify(process.env.ALLOW_SIGNUP || 'true'),
      ALLOW_GOOGLE_SIGNIN: JSON.stringify(process.env.ALLOW_GOOGLE_SIGNIN || 'true'),
      ALLOW_SIGNUP_EU: JSON.stringify(process.env.ALLOW_SIGNUP_EU || 'true'),
      ALLOW_GOOGLE_SIGNIN_EU: JSON.stringify(process.env.ALLOW_GOOGLE_SIGNIN_EU || 'true'),
      ENABLE_HELP_CONTENT: JSON.stringify(process.env.ENABLE_HELP_CONTENT || 'false'),
    }),
  ],
  output: {
    publicPath: process.env.RELEASE_VERSION ? `${process.env.CDN_BASE_URI}react/${process.env.RELEASE_VERSION}/` : '/',
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'build'),
    crossOriginLoading: 'anonymous',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '_',
    },
  },
};

module.exports = (env, argv) => {
  config.mode = argv && argv.mode;

  // eslint-disable-next-line no-restricted-syntax
  for (const k of ['RELEASE_VERSION', 'LOGROCKET_IDENTIFIER', 'LOGROCKET_IDENTIFIER_EU']) {
    // eslint-disable-next-line no-console
    console.log('Custom Environment Variable:', k, '=', process.env[k]);
  }

  if (config.mode === 'production') {
    // replace modules not needed in actual builds with dummy
    // all modules that are only used inside the NODE_ENV === 'development' guard
    // should be replaced here
    config.plugins.push(new webpack.NormalModuleReplacementPlugin(
      /^redux-logger$/,
      '../utils/dummy.js'
    ));

    if (argv.analyze) {
      config.plugins.push(new BundleAnalyzerPlugin());
    } else if (argv.profiling) {
      config.resolve.alias = {
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
      };
      // if the below source-map scheme results in poor stack traces against pre-compiled code (line number)
      // we can temporarily toggle back to the inline-source-map scheme below...
      // config.devtool = 'inline-source-map';
      config.devtool = 'eval-cheap-module-source-map';
      config.devtool = 'inline-source-map';
    } else {
      // generate source map for logrocket
      config.devtool = 'source-map';
    }
  } else if (config.mode === 'development') {
    config.plugins.push(new ReactRefreshWebpackPlugin());
    // if the below source-map scheme results in poor stack traces against pre-compiled code (line number)
    // we can temporarily toggle back to the inline-source-map scheme below...
    // config.devtool = 'inline-source-map';
    config.devtool = 'eval-cheap-module-source-map';
    config.optimization.minimize = false;
  }
  const getProxyOpts = shouldBypass => {
    // eslint-disable-next-line no-console
    console.log(`API endpoint: [${dotenv.API_ENDPOINT}]`);

    const target = dotenv.API_ENDPOINT || '';
    const secure = target && target.toLowerCase().startsWith('https://');

    // eslint-disable-next-line no-console
    console.log(`API Target: ${target}`);
    if (secure) {
      // eslint-disable-next-line no-console
      console.log('Cookie rewrite needed for secure API host.');
    }
    // eslint-disable-next-line func-names
    let bypass = function (req) {
      if (req.method !== 'POST') return '/';
    };

    if (!shouldBypass) {
      bypass = '';
    }

    const opts = {
      target,
      secure,
      changeOrigin: true,
      timeout: 10 * 60 * 1000,
      bypass,
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
        const swapDomain = str => str.replace(/Domain=(.*?).io;/i, 'Domain=.localhost.io;');

        const setCookie = proxyRes.headers['set-cookie'];

        if (setCookie) {
          // eslint-disable-next-line no-param-reassign
          proxyRes.headers['set-cookie'] = Array.isArray(setCookie)
            ? setCookie.map(c => swapDomain(removeSecure(c)))
            : swapDomain(removeSecure(setCookie));
        }
      };
    }

    return opts;
  };
  const isDevServer = argv.mode === 'development';

  if (isDevServer) {
    config.output.filename = '[name].js';
    const proxyOpts = getProxyOpts(false);

    config.devServer = {
      hot: true,
      allowedHosts: 'all',
      compress: true,
      port: 4000,
      host: 'localhost.io',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      static: {
        directory: path.join(__dirname, 'build'),
        publicPath: '/',
      },
      historyApiFallback: {
        index: '/index.html',
      },
      proxy: {
        '/signin': getProxyOpts(true),
        '/signup': getProxyOpts(true),
        '/request-reset': getProxyOpts(true),
        '/accept-invite': getProxyOpts(true),
        '/change-email/*': getProxyOpts(true),
        '/reset-password/*': getProxyOpts(true),
        '/set-initial-password/*': getProxyOpts(true),
        '/request-reset-sent': getProxyOpts(true),
        '/mfa/verify': getProxyOpts(true),
        '/litmos/sso': proxyOpts,
        '/auth/google': proxyOpts,
        '/accept-invite-metadata': proxyOpts,
        '/reSigninWithGoogle': proxyOpts,
        '/reSigninWithSSO/*': proxyOpts,
        '/sso/*': proxyOpts,
        '/link/google': proxyOpts,
        '/unlink/google': proxyOpts,
        '/signout': proxyOpts,
        '/csrf': proxyOpts,
        '/api': proxyOpts,
        '/netSuiteWS': proxyOpts,
        '/netsuiteDA': proxyOpts,
        '/connection': proxyOpts,
        '/ui': proxyOpts,
        '/app/shopify/verify': proxyOpts,
      },
    };
  }

  return config;
};
