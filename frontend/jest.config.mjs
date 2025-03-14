export default {
    transform: {
      '^.+\\.jsx?$': 'babel-jest' 
    },
    extensionsToTreatAsEsm: ['.jsx'],
    testEnvironment: 'jsdom', 
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    }
  };
  