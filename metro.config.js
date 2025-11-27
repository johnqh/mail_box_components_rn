const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot);

const config = getDefaultConfig(projectRoot);

// Watch all workspace packages
config.watchFolders = [workspaceRoot];

// Resolve workspace packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  ...require('find-workspaces')(projectRoot).map((ws) =>
    path.resolve(ws.location, 'node_modules')
  ),
];

// Export with NativeWind support
module.exports = withNativeWind(mergeConfig(getDefaultConfig(projectRoot), config), {
  input: './global.css',
});
