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
            filename: prod ? "[name].[contenthash].js" : "[name].bundle.js",
            chunkFilename: prod ? "[name].[contenthash].chunk.js" : "[name].chunk.js",
            // 절대 경로 — 주소에 슬래시가 붙어도(/files/) 번들을 루트에서 찾게 한다. 사이트는 도메인 루트에 산다.
            publicPath: "/",
            clean: true,
        },
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                chunks: "all",
            },
        },
        devServer: {
            // 포트 번호 설정
            port: process.env.PORT || 9000,
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
                favicon: "./template/favicon.png",
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
                    // interior_7.glb(31MB)은 어디서도 로드되지 않는데 폴더째 복사되는 바람에
                    // 배포물에 그대로 실려 나갔다. 실제로 쓰는 모델만 내보낸다.
                    {
                        from: 'src/assets/models',
                        to: 'models',
                        globOptions: {ignore: ['**/interior_7.glb']},
                    },
                    // 평문 PDF 는 싣지 않는다 — scripts/encrypt-files.mjs 가 봉한 .enc 와 manifest 만 나간다.
                    // 폴더 이름은 라우트(/files)와 **달라야 한다** — dist/files/ 가 있으면 GitHub Pages 가 /files 를
                    // /files/ 로 301 보내고, 거기서 상대 경로 스크립트가 /files/runtime.js 로 풀려 화면이 검게 섰다(v1.1.1).
                    {from: 'src/assets/sealed', to: 'sealed'},
                    {from: 'src/assets/images/star-bubble.png', to: 'logo.png'},
                    {from: 'template/robots.txt', to: 'robots.txt'},
                    {from: 'template/sitemap.xml', to: 'sitemap.xml'},
                    {from: 'template/manifest.json', to: 'manifest.json'},
                    {from: 'template/apple-touch-icon.png', to: 'apple-touch-icon.png'},
                    {from: 'template/404.html', to: '404.html'},
                    {from: 'template/og.png', to: 'og.png'},
                ],
            }),
            new CnameWebpackPlugin({
                domain: 'me.twinklelabs.kr',
            }),
        ],
    };
};
