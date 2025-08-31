export default {
  preset: 'ts-jest', // Enables TypeScript support with ts-jest
  testEnvironment: 'jsdom', // Simulates a browser-like environment for React components
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Runs a setup file after the test environment is set up
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Defines file extensions Jest should look for
  testPathIgnorePatterns: ['node_modules/(?!(.pnpm/)?(@mui|@babel)/)'],
  // Optional: Configure coverage collection
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    'node_modules/',
    '/coverage',
    'package.json',
    'package-lock.json',
    'reportWebVitals.ts',
    'setupTests.ts',
    'index.tsx',
    'App.tsx',
  ],
};
