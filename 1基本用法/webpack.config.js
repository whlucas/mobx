const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const config = {
    mode: 'development',
    entry: path.resolve(__dirname, "src/index.ts"),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            // 以哪一个html模板去在dist目录下去创建html
            template: './src/index.html'
        }),
        new CleanWebpackPlugin(),  // 每次打包的时候这个插件会帮你把上次的结果清理一下
    ],
    // 如果里面有ts代码,则必须要加这个,在解析模块的时候让他不光去找js文件,还要去找ts文件
    // 否则ts文件加载不进来
    resolve: {
        extensions: [".ts", ".js"]
    }
}

module.exports = config