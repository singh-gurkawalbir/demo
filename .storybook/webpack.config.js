const webpack = require('webpack');

module.exports = async ({ config }) => {
  config.node = {
    ...config.node, 
    fs: 'empty'
  };

  // This plugin config tells webpack (that is responsible for building the static 
  // storybook UI), to "search/replace" the constant/value pairs below since storybook 
  // deployments are static builds, they have no access to environment variables at runtime
  // The exception is if env vars are injected into the terminal session prior to running 
  // build-storybook in the scripts section of package.json
  config.plugins.push(
    new webpack.DefinePlugin({
      // replaces Globals defined in the UI code.
      'CDN_BASE_URI': JSON.stringify('HTTPS://d142hkd03ds8ug.cloudfront.net/'),
      // replaces env vars referenced in the UI code.
      'process.env.STORYBOOK_FOO': JSON.stringify('value of process.env.STORYBOOK_FOO'),
    })
  );

  return config;
};
