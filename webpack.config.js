const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CnameWebpackPlugin = require('cname-webpack-plugin');
const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => {
    const prod = argv.mode === "production";

    return {
        mode: prod ? "production" : "development",
        devtool: prod ? "hidden-source-map" : "eval",
        entry: {
            main: path.resolve(__dirname, "src/index.tsx")
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].bundle.js",
            clean: true,
        },
        devServer: {
            // 포트 번호 설정
            port: 9000,
            // 핫 모듈 교체(HMR) 활성화 설정
            hot: true,
            // gzip 압축 활성화
            compress: true,
            // History 라우팅 대체 사용 설정
            historyApiFallback: true,
            // 개발 서버 자동 실행 설정
            open: true,
            watchFiles: [path.resolve(__dirname, 'src')],
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", "..."],
            alias: {
                "@Components": path.resolve(__dirname, "src/components/"),
                "@Layout": path.resolve(__dirname, "src/components/layout"),
                "@Pages": path.resolve(__dirname, "src/pages/"),
                "@Images": path.resolve(__dirname, "src/assets/images"),
                "@Fonts": path.resolve(__dirname, "src/assets/fonts"),
                "@Models": path.resolve(__dirname, "src/assets/models"),
                "@Data": path.resolve(__dirname, "src/data"),
                "@Store": path.resolve(__dirname, "src/store"),
                "@Style": path.resolve(__dirname, "src/assets/css"),
                "@Utils": path.resolve(__dirname, "src/utils"),
            },
        },
        module: {
            rules: [
                {
                    test: /.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use: ["babel-loader", "ts-loader"],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: "fonts/[hash][ext]"
                    }
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: "images/[hash][ext]"
                    }
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },
        plugins: [
            new webpack.ProvidePlugin({
                process: "process/browser.js",
                React: "react",
            }),
            new HtmlWebpackPlugin({
                template: "./template/index.html",
                favicon: "./src/assets/images/favicon.png",
                inject: "body",
                minify:
                    process.env.NODE_ENV === "production"
                        ? {
                            collapseWhitespace: true, // 빈칸 제거
                            removeComments: true, // 주석 제거
                        }
                        : false,
            }),
            // dotenv 사용을 위한 설정
            new Dotenv(),
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    {from: 'src/assets/models', to: 'models'},
                    {from: 'src/assets/pdf', to: 'pdf'},
                    {from: 'src/assets/images/star-bubble.png', to: 'logo.png'},
                    {from: 'template/robots.txt', to: 'robots.txt'},
                    {from: 'template/manifest.json', to: 'manifest.json'},
                    {from: 'template/404.html', to: '404.html'},
                    {from: 'template/og.png', to: 'og.png'},
                    {from: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs', to: 'pdf.worker.min.mjs'},
                ],
            }),
            new CnameWebpackPlugin({
                domain: 'twinklekhj.xyz',
            }),
        ],
    };
};
