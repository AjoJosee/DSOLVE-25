const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'styles.css', to: 'styles.css' },
                { from: 'maps.js', to: 'maps.js' },
                { from: 'events.html', to: 'events.html' },
                { from: 'leaderboard.html', to: 'leaderboard.html' },
                { from: 'community.html', to: 'community.html' },
                { from: 'resources.html', to: 'resources.html' }
            ]
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        proxy: {
            '/api': 'http://localhost:3000'
        }
    }
};