const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: 'images/[name][ext]'
    },
    module: {
        rules: [{
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new CssMinimizerPlugin()

    ],
    optimization: {
        minimizer: [
            "...",
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            ["gifsicle", {
                                interlaced: true
                            }],
                            ["mozjpeg", {
                                quality: 60
                            }],
                            ["optipng", {
                                optimizationLevel: 5
                            }],
                            [
                                "svgo",
                                {
                                    name: 'preset-default',
                                    params: {
                                        overrides: {
                                            convertShapeToPath: {
                                                convertArcs: true
                                            },
                                            convertPathData: false
                                        }
                                    }
                                }
                            ],
                        ]
                    }
                }
            })
        ]

    }
}