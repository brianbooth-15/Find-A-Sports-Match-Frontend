module.exports = {
    preset: 'react-native',
    transform: {
      '^.+\\.[tj]sx?$': 'babel-jest', // Ensure Babel transforms JS and TS files
    },
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|expo-secure-store|@react-native|react-native-reanimated)/)', // ✅ Allow transforming expo-secure-store
    ],
    setupFiles: [
      './node_modules/react-native-gesture-handler/jestSetup.js',
    ],
    setupFilesAfterEnv: [
      '@testing-library/jest-native/extend-expect',
      '<rootDir>/jestSetup.js',
    ],
    testEnvironment: 'node',
  };
  