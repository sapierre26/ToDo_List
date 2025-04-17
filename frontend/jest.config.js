export default {
  transform: {
    '^.+\\.jsx?$': 'babel-jest' 
  },
  extensionsToTreatAsEsm: ['.jsx', '.tsx'],
  testEnvironment: 'jsdom', 
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  preset: 'ts-jest',
};
