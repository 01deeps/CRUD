// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    coverageDirectory: 'coverage',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],


    setupFiles: ['<rootDir>/jest.setup.ts'],

    "transform": {
  "^.+\\.ts$": "ts-jest"
},
"moduleFileExtensions": ["ts", "js"]
};
  