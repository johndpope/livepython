const path = require('path');

module.exports = {
    entry: {
        main: './src/index.js',
        variable_inspector: './src/variable_inspector.js'
    },
    target: 'electron-renderer', // Correct target for renderer process
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader', exclude: /(node_modules|main)/ }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
};