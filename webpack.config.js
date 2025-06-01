const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  
  entry: {
    main: './static/src/js/main.js',
    style: './static/src/scss/main.scss',
  },
  
  output: {
    path: path.resolve(__dirname, 'static/dist'),
    filename: 'js/[name].[contenthash].js',
    publicPath: '/static/dist/',
    clean: true,
  },
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(scss|sass|css)$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer']],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[contenthash][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash][ext]',
        },
      },
    ],
  },
  
  plugins: [
    new CleanWebpackPlugin(),
    
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'static/src/images'),
          to: path.resolve(__dirname, 'static/dist/images'),
          noErrorOnMissing: true,
        },
      ],
    }),
    
    // BrowserSync для автоматического обновления страницы
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      proxy: 'http://localhost:8000',
      files: [
        {
          match: ['**/*.py', 'templates/**/*.html'],
          fn: function(event, file) {
            console.log(`File ${file} has been changed`);
          }
        }
      ]
    }, {
      reload: false,
    }),
  ],
  
  devtool: isDevelopment ? 'source-map' : false,
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'static/dist'),
    },
    compress: true,
    port: 3001,
    hot: true,
    open: false,
  },
  
  watch: isDevelopment,
  watchOptions: {
    ignored: /node_modules/,
    poll: 1000,
  },
};