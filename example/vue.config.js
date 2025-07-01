const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  lintOnSave: false,

  pluginOptions: {
    vuetify: {
      // Vuetify plugin options
    },
  },

  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/variables.sass"`, // Adjust this path if you have Sass variables
      },
    },
  },

  configureWebpack: {
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        process: require.resolve('process/browser'),
        vm: require.resolve('vm-browserify'),  // Polyfill for vm module
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',  // Make process available globally
      }),
    ],
  },
});
