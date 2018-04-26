var webpack = require('webpack')
var path = require('path')
var LiveReloadPlugin = require('webpack-livereload-plugin')

var BUILD_DIR = path.join(__dirname, './public/js/')
var APP_DIR = path.join(__dirname, './src/client/')

var config = {
  entry: APP_DIR + 'index.js',
  devtool: 'source-map',
  mode: 'development',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/js/',
  },
  plugins: [
    new LiveReloadPlugin({}),
  ],
  module: {
    rules: [
      {
        test: /\.js?/,
        include: APP_DIR,
        loader: 'babel-loader',
        exclude: {
          test: path.resolve(__dirname, 'node_modules'),
        },
        query: {
          presets: ['latest', 'react'],
          plugins: ['transform-class-properties'],
        },
      }, {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: false,
        },
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/fonts/[name].[hash:7].[ext]',
        },
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/img/[name].[hash:7].[ext]',
        },
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: { extensions: ['.js', '.jsx'] },
}

module.exports = config
