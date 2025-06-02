module.exports = {
  setupFiles: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/*.test.js"],
  testEnvironment: "node", // Use node environment for tests
  transform: {
    "^.+\\.(js|ts)$": "ts-jest", // For TypeScript (if needed)
  },
};
