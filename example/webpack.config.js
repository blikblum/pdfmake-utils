const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      filename: __dirname + '/dist/index.html',
      template: __dirname + '/index.html'
    }),

    new CopyWebpackPlugin([      
      { from: 'assets' },
      { context: 'node_modules/pdfkit/js/data', from: '*.afm', to: 'fonts' }
    ])
  ]
};