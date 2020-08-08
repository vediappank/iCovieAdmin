const HtmlWebpackPlugin = require('html-webpack-plugin');
const LinkTypePlugin = require('html-webpack-link-type-plugin').HtmlWebpackLinkTypePlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require('path')
const helpers = require('./config/helpers');

var webpackConfig = {
  entry: {
    main: './src/main.ts'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
	path: path.join(__dirname, 'dist', ''),
	// publicPath: 'beINInsight'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: ['ts-loader', 'angular2-template-loader']
	},
	{
		//IMAGE LOADER
		test: /\.(jpe?g|png|gif|svg)$/i,
		use:'file-loader'
	},
    {
      test: /\.html$/,
      use: 'html-loader'
    },
    {
      test: /\.css$/,
      use: [
        'to-string-loader', 'css-loader',
      ],
    },
	{
		//SCSS Loader Try 1
		test: /\.(scss|sass)$/,
		use: [
			'to-string-loader',
			{ 
				loader: 'css-loader', 
				options: { 
					sourceMap: true 
				} 
			},
			{ 
				loader: 'sass-loader', 
				options: { 
					sourceMap: true 
				} 
			}
		],
		include: helpers.root('src', 'app')
	},
	// {
	// 	//SCSS Loader Try 2
	// 	test: /\.scss$/,
	// 	use: [{
	// 			loader: MiniCssExtractPlugin.loader,
	// 			options: {

	// 			}
	// 		},
	// 		"css-loader",
	// 		"resolve-url-loader",
	// 		{
	// 			loader: "sass-loader?sourceMap",
	// 			options: {
	// 				includePaths: [
	// 				],
	// 				sourceMap: true
	// 			}
	// 		}
	// 	],
	// 	exclude: /node_modules/
	// }
    ]
  },
  devServer: {
	writeToDisk: true
  },
};
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: './src/index.html',
});
webpackConfig.plugins = [
  htmlWebpackPlugin,
  new LinkTypePlugin({
    '*.css' : 'text/css',
    '*.js' : 'text/js'
  })
];
module.exports = webpackConfig;