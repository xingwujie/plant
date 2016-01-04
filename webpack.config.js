var HtmlWebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var path = require('path');
var webpack = require('webpack');

var TARGET = process.env.TARGET;
var ROOT_PATH = path.resolve(__dirname);

var common = {
  addVendor: function (vendorName, moduleLocation) {
    moduleLocation = path.join(__dirname, moduleLocation);
    this.resolve.alias[vendorName] = moduleLocation;
    // this.module.noParse.push(new RegExp(moduleLocation));
  },
  entry: [
    // 'bootstrap-webpack!./bootstrap.config.js',
    path.resolve(ROOT_PATH, 'app/main')
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {}
  },
  output: {
    path: path.resolve(ROOT_PATH, 'build'),
    filename: '/bundle.js'
  },
  module: {
    noParse: [],
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      // **IMPORTANT** This is needed so that each bootstrap js file required by
      // bootstrap-webpack has access to the jQuery object
      // { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },

      // Needed for the css-loader when [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
      // loads bootstrap's css.
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Plant'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'root.jQuery': 'jquery'
    })
  ]
};

common.addVendor('jquery', 'node_modules/jquery/dist/jquery.js');
common.addVendor('bootstrap', 'node_modules/bootstrap/dist/js/bootstrap.js');
common.addVendor('bootstrap.css', 'node_modules/bootstrap/dist/css/bootstrap.css');

if(TARGET === 'build') {
  module.exports = merge(common, {
    module: {
      loaders: [
        {
          // test for both js and jsx
          test: /\.jsx?$/,

          // use babel loader with Stage 1 features
          loader: 'babel?presets[]=stage-1',

          // operate only on our app directory
          include: path.resolve(ROOT_PATH, 'app')
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}

if(TARGET === 'dev') {
  module.exports = merge(common, {
    entry: [
      'webpack/hot/dev-server'
    ],
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['react-hot', 'babel?presets[]=stage-1'],
          include: path.resolve(ROOT_PATH, 'app')
        }
      ]
    },
    devServer: {
      proxy: {
        '/auth/*': {
          target: 'http://localhost:3000/',
          secure: false,
          autoRewrite: true,
        },
        '/api/*': {
          target: 'http://localhost:3000/',
          secure: false,
          autoRewrite: true,
        },
        '/img/*': {
          target: 'http://localhost:3000/',
          secure: false,
          autoRewrite: true,
        },
        '/plant/*': {
          target: 'http://localhost:3000/',
          secure: false,
          autoRewrite: true,
        },
        '/favicon.ico': {
          target: 'http://localhost:3000/',
          secure: false,
          autoRewrite: true,
        },
      },
    },
  });
}
