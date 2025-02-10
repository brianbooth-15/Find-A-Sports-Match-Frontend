const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

console.log("BEFORE");

// Force aliasing of 'react-native' to 'react-native-web' for the web
defaultConfig.resolver.extraNodeModules = {
  'react-native': require.resolve('react-native-web'),
  'util': require.resolve('util/') // Ensure it resolves to the polyfill
};

console.log("AFTER");

// Additional configuration options can be added if needed
defaultConfig.resolver.assetExts = [...defaultConfig.resolver.assetExts, 'webp'];

module.exports = defaultConfig;
