var GenerateDemoPlugin = require('./scripts/webpack/GenerateDemoPlugin');

module.exports = {
  plugins: [
    new GenerateDemoPlugin({
      modules: ['mdi']
    })
  ]
};