var webpack = require('webpack');
var path = require('path');

const script_dir = __dirname;
const root_dir = path.join(script_dir, '../../..');
const build_dir = path.join(root_dir, 'client/source/build');

module.exports = {
    context: script_dir,
    entry: ['angular', 'angular-cookies', 'angular-ui-router', 'angular-ui-bootstrap', 'angular-moment', './ng/app'],
    output: {
        path: build_dir,
        filename: '/bundle.js'
    },

    plugins: [
        // Stop if error
        new webpack.NoErrorsPlugin()
    ],

    resolve: {
        modulesDirectories: [
            root_dir + '/node_modules'
        ]
    },

    resolveLoader: {
        test: /\.jsx$/,
        root: [
            path.join(root_dir, 'node_modules')
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
