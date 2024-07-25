// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    coverageDirectory: 'coverage',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],


    // setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

    "transform": {
  "^.+\\.ts$": "ts-jest"
},
"moduleFileExtensions": ["ts", "js"]
};
  