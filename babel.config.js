// we are in node land here, no export keyword
module.exports = (api) => {
  // cannot be cached, i.e. outside of this function at module level
  const config = {
    presets: [
      ['@babel/preset-env', { targets: '> 0.25%, not dead' }],
      '@babel/preset-react',
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-transform-modules-commonjs', { strict: false }],
      ['@babel/plugin-proposal-optional-chaining'],
      ['babel-plugin-transform-react-remove-prop-types', { removeImport: true }],
      // It would be nice to have this plugin working...
      // https://reactjs.org/docs/error-boundaries.html#component-stack-traces
      // ['transform-react-jsx-source'],

    ],
  }
  if (api && api.env('development')) {
    config.plugins.push(['react-refresh/babel'])
  } else if (api && api.env('test')) {
    config.presets.push(['babel-preset-jest'])
  }
  return config
}
