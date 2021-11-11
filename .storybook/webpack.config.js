const webpack = require('webpack');

module.exports = async ({ config }) => {
  config.node = {
    ...config.node, 
    fs: 'empty'
  };

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.FOO': 'value of process.env.FOO',
      'process.env.STORYBOOK_FOO': 'value of process.env.STORYBOOK_FOO',
    })
  );

  return config;
};
