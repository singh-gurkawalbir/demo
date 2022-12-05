const webpack = require('webpack');

module.exports = async ({ config }) => {
  config.node = {
    ...config.node,
  };
  config.resolve = {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
    }
  };

  config.module = {
    rules: [
      {
        test: /\.mdx?$/,
        use: [
          {
            loader: '@mdx-js/loader',
            options: {}
          }
        ]
      },
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
        test: /\.scss$/,
        use: [
            "style-loader",
            "css-loader",
            "sass-loader",
        ],
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
  }

  // This plugin config tells webpack (that is responsible for building the static 
  // storybook UI), to "search/replace" the constant/value pairs below since storybook 
  // deployments are static builds, they have no access to environment variables at runtime
  // The exception is if env vars are injected into the terminal session prior to running 
  // build-storybook in the scripts section of package.json
  config.plugins.push(
    new webpack.DefinePlugin({
      // replaces Globals referenced in the UI code
      'CDN_BASE_URI': JSON.stringify('HTTPS://d142hkd03ds8ug.cloudfront.net/'),
      'IO_LOGIN_PROMOTION_URL': JSON.stringify('https://staging.celigo.com/login/display'),
      // replaces env vars referenced in the UI code
      'process.env.STORYBOOK_FOO': JSON.stringify('value of process.env.STORYBOOK_FOO'),
    })
  );

  return config;
};
