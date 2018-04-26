var webpack = require('webpack')
var path = require('path')

var BUILD_DIR = path.join(__dirname, './public/js/')
var APP_DIR = path.join(__dirname, './src/client/')

var config = {
  entry: APP_DIR + 'index.jsx',
  devtool: 'source-map',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/public/js/',
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      sourceMap: true,
      minimize: true,
      mangle: {
        screw_ie8: true,
        keep_fnames: true,
      },
      compress: {
        screw_ie8: true,
      },
      comments: false,
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel-loader',
        exclude: {
          test: path.resolve(__dirname, 'node_modules'),
        },
        query: {
          presets: ['env', 'react'],
          plugins: ['transform-class-properties'],
        },
      }, {
        test: /\.js?$/,
        exclude: {
          test: path.resolve(__dirname, 'node_modules'),
        },
        loaders: [
          'babel-loader?presets[]=react,presets[]=env',
        ],
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/fonts/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/img/[name].[hash:7].[ext]',
        },
      },
    ],
  },
  resolve: { extensions: ['.js', '.jsx'] },
};

module.exports = config
