const OfflinePlugin = require('offline-plugin')
// const path = require('path')
// const PHASER_DIR = path.join(__dirname, '/node_modules/phaser-ce');
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
  // webpack(config) {
  //   const pix = [
  //     {
  //       test: /pixi\.js/,
  //       use: [{
  //         loader: 'expose-loader',
  //         options: 'PIXI',
  //       }],
  //     },
  //     {
  //       test: /phaser-split\.js$/,
  //       use: [{
  //         loader: 'expose-loader',
  //         options: 'Phaser',
  //       }],
  //     },
  //     {
  //       test: /p2\.js/,
  //       use: [{
  //         loader: 'expose-loader',
  //         options: 'p2',
  //       }],
  //     }
  //   ]
  //
  //   const phaserObj = {
  //     phaser: path.join(PHASER_DIR, 'build/custom/phaser-split.js'),
  //     pixi: path.join(PHASER_DIR, 'build/custom/pixi.js'),
  //     p2: path.join(PHASER_DIR, 'build/custom/p2.js'),
  //   }
  //   Object.assign(config.resolve.alias, phaserObj)
  //   config.module.rules = config.module.rules.concat(pix)
  //   console.log(config.module.rules)
  //   return config // <-- Important, must return it
  // }
})