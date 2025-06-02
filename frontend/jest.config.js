// frontend/jest.config.js
export default {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/setupTests.js"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  extensionsToTreatAsEsm: [".jsx", ".tsx"], // optional, keep if using ESM
   globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json"
    }
  }
};
