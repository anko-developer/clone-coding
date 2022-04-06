const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index.bundle.js'
  },
  devServer: {
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/images/[name][ext]'
        }
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: {
            list: [
              {
                tag: 'img',
                attribute: 'src',
                type: 'src'
              }
            ]
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/fonts/[name][ext]'
        }
      }
    ]
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    // 개발 중에도 실행하려면 해당 minimize 값을 넣어준다.
    minimize: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin({
      banner: `Study build time : ${new Date().toLocaleTimeString()}`
    }),
    new MiniCssExtractPlugin({ filename: 'assets/css/style.css' }),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.squooshMinify,
        options: {
          encodeOptions: {
            mozjpeg: {
              quality: 100
            },
            webp: {
              lossless: 1
            },
            avif: {
              cqLevel: 0
            }
          }
        }
      }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new HtmlWebpackPlugin({
      title: 'main',
      template: path.join(path.resolve(__dirname, 'src'), 'index.html')
    }),
  ],
  devtool: 'source-map'
};
