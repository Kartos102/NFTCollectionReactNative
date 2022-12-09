const crypto = require.resolve("crypto-browserify");
const url = require.resolve("url/");
const axios = require.resolve("axios");
const blacklist = require("metro-config/src/defaults/exclusionList");
module.exports = {
  resolver: {
    blacklistRE: blacklist([/nodejs-assets\/.*/, /\/android\/.*/, /\/ios\/.*/]),
    extraNodeModules: {
      crypto,
      url,
      axios,
      fs: require.resolve("expo-file-system"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      net: require.resolve("react-native-tcp"),
      os: require.resolve("os-browserify/browser.js"),
      path: require.resolve("path-browserify"),
      stream: require.resolve("readable-stream"),
      vm: require.resolve("vm-browserify"),
    },
  },
};
