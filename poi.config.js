const OfflinePlugin = require('offline-plugin')
module.exports = options => ({
  entry: './src/index.js',
  devServer: {
    proxy: 'http://localhost:4001/api',
  },
  port: 4040,
  presets: [
    require('poi-preset-karma')({
      port: 5001, // default,
      files: ['test/unit/*.test.js'] // default
    }),
    require('poi-preset-offline')({
      pwa: './src/pwa.js' // Use your own runtime, relative to $cwd
    })
  ]
})