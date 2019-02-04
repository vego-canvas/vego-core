const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        bundle: __dirname + '/test/performance.test.js',
    },
    output: {
        path: __dirname + '/',
        filename: '[name].js',
        publicPath: '/',
    },
    devServer: {
        contentBase: path.join(__dirname, './'),
        compress: true,
        port: 8086,
    },
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'demo',
            chunks: ['bundle'],
        }),
    ],
};
