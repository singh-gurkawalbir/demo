const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const DotenvPlugin = require('dotenv-webpack');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '.env') }).parsed;
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');

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
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    new DotenvPlugin(),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new UnusedFilesWebpackPlugin({
      patterns: ['src/**/*.js', 'src/**/*.jsx'],
      globOptions: {
        // test are standalone files are always unreferenced so lets ignore it
        // some icons could be used in the future lets not delete all the unused ones
        // stories are also standalone so lets ignore it as well
        ignore: ['**/*test.js', '**/components/icons/**', '**/stories/**',
          // this folder has some js data files used primarily for test cases
          'src/utils/assistant/assistantTestcases/**'],
      },
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
      SCHEDULE_SHIFT_FOR_FLOWS_CREATED_AFTER: JSON.stringify(process.env.SCHEDULE_SHIFT_FOR_FLOWS_CREATED_AFTER),
      SECOND_SCHEDULE_SHIFT_FOR_FLOWS_CREATED_AFTER: JSON.stringify(process.env.SECOND_SCHEDULE_SHIFT_FOR_FLOWS_CREATED_AFTER),
      GA_KEY_1: JSON.stringify(process.env.GA_KEY_1),
      GA_KEY_2: JSON.stringify(process.env.GA_KEY_2),
      GA_KEY_1_EU: JSON.stringify(process.env.GA_KEY_1_EU),
      GA_KEY_2_EU: JSON.stringify(process.env.GA_KEY_2_EU),
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
    console.log('Custom Environment Variable:', k, '=', process.env[k]);
  }

  if (config.mode === 'production') {
    // replace modules not needed in actual builds with dummy
    // all modules that are only used inside the NODE_ENV === 'development' guard
    // should be replaced here
    config.plugins.push(new webpack.NormalModuleReplacementPlugin(
      /^redux-logger$/,
      './utils/dummy.js'
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
  const getProxyOpts = () => {
    console.log(`API endpoint: [${dotenv.API_ENDPOINT}]`);

    const target = dotenv.API_ENDPOINT || '';
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
        const swapDomain = str => str.replace(/Domain=(.*?).io;/i, 'Domain=.localhost.io;');

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

  const isDevServer = argv && argv.$0.endsWith('webpack-dev-server');

  if (isDevServer) {
    config.output.filename = '[name].js';
    const proxyOpts = getProxyOpts();

    config.devServer = {
      hot: true,
      contentBase: path.join(__dirname, 'build'),
      compress: true,
      port: 4000,
      publicPath: '/',
      host: 'localhost.io',
      historyApiFallback: {
        index: '/index.html',
      },
      proxy: {
        '/signin': proxyOpts,
        '/litmos/sso': proxyOpts,
        '/auth/google': proxyOpts,
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
      },
    };
  }

  return config;
};
