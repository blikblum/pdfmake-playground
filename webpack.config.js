var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var MiniCSSExtractPlugin = require('mini-css-extract-plugin')
var {GenerateSW} = require('workbox-webpack-plugin')
var CleanPlugin = require('clean-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')



var DIST_DIR = 'dist'
var devDevTool = 'source-map' // see https://webpack.js.org/configuration/devtool/ for options
var prodDevTool = false

var envPresetConfig = {
  modules: false,
  targets: {
    browsers: [
      'edge 14'
    ]
  }
}

var plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/index.html')
  }),

  new CopyWebpackPlugin([
    {from: 'src/assets/font/roboto/Roboto-Italic.woff', to: ''},
    {from: 'src/assets/font/roboto/Roboto-Regular.woff', to: ''},
    {from: 'src/assets/font/roboto/Roboto-Medium.woff', to: ''},
    {from: 'src/assets/font/roboto/Roboto-MediumItalic.woff', to: ''},
    {context: 'src/assets/font/', from: '*.woff', to: ''}
  ])
]

module.exports = function (env) {
  var isProd = env.mode === 'production'
  
  if (isProd) {
    plugins.push(new CleanPlugin([DIST_DIR + '/*.*']))
    plugins.push(new GenerateSW({
      swDest: path.join('sw.js')
    }))
    plugins.push(new MiniCSSExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    }))
  }

  return {
    entry: './src/main.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, DIST_DIR)
    },
    mode: isProd ? 'production' : 'development',    
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        include: [path.resolve('src')],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [['env', envPresetConfig]],
            plugins: ['transform-class-properties','transform-object-rest-spread','syntax-dynamic-import',['transform-react-jsx', {pragma: 'h'}],['babel-plugin-jsx-pragmatic', {module: 'snabbdom-pragma-lite', import: 'h', export: 'createElement'}]]
          }
        }]
    }, {
      test: /\.css$/,
      use: [
        isProd ? MiniCSSExtractPlugin.loader : 'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.(sass|scss)$/,
      use: [
        isProd ? MiniCSSExtractPlugin.loader : 'style-loader', 
        'css-loader', 
        'sass-loader'
      ]
     },{
      test: /\.(woff|woff2)$/,
      use: "url-loader?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.ttf$/,
      use: "url-loader?limit=10000&mimetype=application/octet-stream"
    }, {
      test: /\.eot$/,
      use: "file-loader"
    }, {
      test: /\.svg$/,
      use: "url-loader?limit=10000&mimetype=image/svg+xml"
    }]
    },
    resolve: {
      modules: [path.resolve(__dirname, './src/common'), 'node_modules']
    },    
    plugins: plugins,
    devtool: isProd ? prodDevTool : devDevTool
  }
}
