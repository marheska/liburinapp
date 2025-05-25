const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
devServer: {
  static: path.resolve(__dirname, 'dist'),
  open: false,
  port: 9005,
  client: {
    overlay: {
      errors: true,
      warnings: true,
    },
  },
  proxy: [
    {
      context: ['/api'],
      target: 'https://story-api.dicoding.dev',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/api': '' },
    },
  ],
},
});
