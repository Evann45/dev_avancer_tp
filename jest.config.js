module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: './apps/realtime-elo-ranker-server/src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
      '**/*.(t|j)s',
    ],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
  };