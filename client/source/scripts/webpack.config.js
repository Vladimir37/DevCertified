var webpack = require('webpack');
var path = require('path');

const script_dir = __dirname;
const root_dir = path.join(script_dir, '../../..')
const client_js = path.join(script_dir, 'client/source/scripts');
const build_dir = path.join(root_dir, 'client/source/build');

module.exports = {
    context: script_dir,
    entry: {
        'app': './app'
    },
    output: {
        path: build_dir,
        filename: '/bundle.js'
    },

    plugins: [
        // Stop if error
        new webpack.NoErrorsPlugin()
    ],

    resolve: {
        extensions: ['.js'],
        modulesDirectories: [
            root_dir + '/node_modules'
        ]
    },

    resolveLoader: {
        extensions: ['.js'],
        modulesDirectories: [
            root_dir + '/node_modules'
        ]
    },

    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            query: {
                presets: [root_dir + '/node_modules/babel-preset-es2015']
            }
        }]
    },

    cache: true,
    watch: false,

    watchOptions: {
        aggregateTimeout: 300
    }
};
