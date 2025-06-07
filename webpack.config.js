const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    style: './static/src/scss/main.scss',
  },
  output: {
    path: path.resolve(__dirname, 'static/dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        use: [
          MiniCssExtractPlugin.loader, // Создает файл dist/css/style.css
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css', // → static/dist/css/style.css
    }),
  ],
  watch: true, // Автоматически пересобирает при изменениях
};