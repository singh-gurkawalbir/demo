module.exports = {
  hooks: {
    'pre-commit': 'lint-staged && yarn test && yarn coverage',
  },
};
