const nodeExternals = require('webpack-node-externals')

const _output = 'dist'

module.exports = {
	target: 'node',
	mode: 'production',
	entry: {
		server: './backend/server.ts'
	},
	output: {
		filename: '[name].numdist.js',
		path: __dirname + '/../' + _output + '/backend',
	},
	// devtool: "source-map",
	resolve: {
	// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".ts", ".tsx", ".js", ".json"]
	},
	node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false,   // if you don't put this is, __dirname
    __filename: false,  // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
	module: {
		rules: [
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
	]
};
