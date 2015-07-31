var webpack = require('webpack');
var autoprefixer = require('autoprefixer-core');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: [
      './client/js/app.jsx',
      './client/css/app.css',
      './client/css/main.scss'
    ],
    output: {
      path: './client/build',
      filename: '[name].js'
    },
    module: {
      loaders: [
        { test: /\.jsx?$/, loader: 'babel?stage=0', exclude: /node_modules/ },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel'},
        { test: /\.png$/, loader: 'url?limit=100000' },
        { test: /\.jpg$/, loader: 'file' },
        { test: /\.gif$/, loader: 'file' },
        // Extract css files
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css?sourceMap!postcss-loader?sourceMap')
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract(
              'css?sourceMap!sass?sourceMap!postcss-loader?sourceMap'
          )
        }
      ]
    },
    postcss: function () {
      return [autoprefixer];
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new ExtractTextPlugin('[name].css')
    ]

};
