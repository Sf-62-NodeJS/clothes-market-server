module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    complexity: 0,
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
    'jest/valid-expect': 0,
    'consistent-return': 0,
    'jest/no-try-expect': 0,
    'jest/no-test-callback': 0,
    'comma-dangle': ['warn', 'never']
  }
};
