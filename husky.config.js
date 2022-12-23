module.exports = {
  hooks: {
    'pre-commit': 'lint-staged && yarn test -o && yarn coverage',
  },
};
