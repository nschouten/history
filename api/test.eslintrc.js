module.exports = {
  extends: 'airbnb',
  rules: {
    'max-len': [2, 150, 4],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'global-require': 0,
  },
};
