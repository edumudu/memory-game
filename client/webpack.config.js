const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const PUBLIC_DIR = 'public'

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, PUBLIC_DIR),
        hot: true,
        port: 3030
    },
    entry: path.resolve(__dirname, 'src', 'js','main.js'),
    mode: 'development',
    module: {
        rules: [
            {
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        '@babel/preset-env'
                    ]
                },
                test: /\.js$/
            },
            {
              exclude: /node_modules/,
              test: /\.scss$/,  
              use: ['style-loader', 'css-loader', 'sass-loader'] 
            },
            {
              exclude: /node_modules/,
              test: /\.(wav|mp3)$/,
              use: ['file-loader'] 
            },
            {
              exclude: /node_modules/,
              test: /\.svg$/,
              loader: 'svg-inline-loader'
            }
        ]
    },
    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, PUBLIC_DIR, 'index.html')
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    target: 'web'
}
