var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [
      "./client/js/app.jsx",
      "./client/css/app.css"
    ],
    output: {
      path: "./client/build",
      filename: "[name].js"
    },
    module: {
      loaders: [
        { test: /\.jsx?$/, loader: 'react-hot-loader!babel-loader?stage=0', exclude: /node_modules/ },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel'},
        { test: /\.png$/, loader: "url?limit=100000" },
        { test: /\.jpg$/, loader: "file" },
        { test: /\.gif$/, loader: "file" },
        // Extract css files
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        },
        // Extract sass files
        {
            test: /\.sass$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new ExtractTextPlugin("[name].css")
    ]

};
