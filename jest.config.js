module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    'src/**/*.js',
    'migrations/*.js',
    '!src/routers/*',
    '!src/**/index.js',
    '!src/models/*'
  ],
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    'html',
    'json',
    'text',
    'text-summary',
    'lcov',
    'clover'
  ],
  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  // Automatically reset mock state between every test
  resetMocks: true,
  // Automatically restore mock state between every test
  restoreMocks: true
};
