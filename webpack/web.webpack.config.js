// const FileManagerPlugin = require('filemanager-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const _mode = 'development';
const _output = 'dist'

module.exports = {
	mode: 'development',
	entry: "./src/index.tsx",
	output: {
		filename: '[name].wish-to-go.js',
		path: __dirname + '/../' + _output + '/frontend',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
  devServer: {
		// host: '0.0.0.0', //publish in local network
		proxy: {
			'/api': 'http://localhost:3000'
		}
    // contentBase: _output,
  },
	// Enable sourcemaps for debugging webpack's output.
	devtool: "source-map",

	resolve: {
	// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".ts", ".tsx", ".js", ".json"]
	},

	module: {
		rules: [
			{
				test: /\.(png|jpe?g|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'images',
						},
					},
				],
			},
			{
				test: /\.svg$/,
				use: [
					'desvg-loader/preact', // Add loader (use 'desvg-loader/react' for React)
					'svg-loader' // svg-loader must precede desvg-loader
				],
			},
			{
				test: /\.css$/,
				loader: [
					MiniCssExtractPlugin.loader,
					"css-loader"
				]
			},
			{
		    test: /\.scss$/,
		    loader: [
		      MiniCssExtractPlugin.loader,
		      "css-loader",
		      "sass-loader"
		    ],
		  },
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				// exclude: [
				// 	"node_modules",
				// 	"webpack.config.js",
				// 	_output
				// ]
			},
		]
	},
	// optimization: {
	// 	splitChunks: {
	// 		chunks: 'all',
  //     minSize: 30000,
  //     maxSize: 0,
  //     minChunks: 1,
  //     maxAsyncRequests: 5,
  //     maxInitialRequests: 3,
  //     automaticNameDelimiter: '~',
  //     name: true,
  //     cacheGroups: {
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
	// 				name: 'vendor',
	// 				chunks: 'all',
	// 				enforce: true,
  //         priority: -10
  //       },
  //       default: {
  //         minChunks: 2,
  //         priority: -20,
  //         reuseExistingChunk: true
  //       }
  //     }
	// 	}
	// },
	// When importing a module whose path matches one of the following, just
	// assume a corresponding global variable exists and use that instead.
	// This is important because it allows us to avoid bundling all of our
	// dependencies, which allows browsers to cache those libraries between builds.
	// externals: buildExternals(),
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'wish-to-go.css'
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/index.html',
			templateParameters: {
				title: 'Test'
			},
			hash: true
		})
		// new FileManagerPlugin({
		// 	onStart: {
		// 		delete: [
		// 			_output+'/*',
		// 			'../kinlen/frontend/kinlen-bookings/*'
		// 		]
		// 	},
		// 	onEnd: {
		// 		copy: buildCopyDependencies().concat([
		// 			{ source: _output, destination:'../kinlen/frontend/kinlen-bookings' }
		// 		])
		// 	}
		// })
	]
};
