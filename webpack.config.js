var webpack = require("webpack");
var path = require("path");
var fs = require("fs");

function getNodeModules() {
  var nodeModules = {};
  fs.readdirSync("node_modules")
    .filter(function (x) {
      return [".bin"].indexOf(x) === -1;
    })
    .forEach(function (mod) {
      nodeModules[mod] = "commonjs " + mod;
    });
  return nodeModules;
}

module.exports = {
  entry: "./",
  resolve: {
    modulesDirectories: [
      "."
    ]
  },
  output: {
    path: __dirname + '/build',
    filename: 'server_prod.js',
  },
  externals: getNodeModules(),
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'URL': JSON.stringify(process.env.URL),
        'PORT': JSON.stringify(process.env.PORT)
      }
    })
  ]
};
