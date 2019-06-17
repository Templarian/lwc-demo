var LwcDemoWebpackPlugin = require('lwc-demo-webpack-plugin');

module.exports = {
  plugins: [
    new LwcDemoWebpackPlugin({
      modules: ['mdi']
    })
  ],
  resolve: {
    symlinks: false
  }
};