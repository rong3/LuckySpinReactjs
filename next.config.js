require("dotenv").config();
const webpack = require("webpack");
// const CompressionPlugin = require('compression-webpack-plugin');
// const zlib = require("zlib");

module.exports =
{
  experimental: { styledComponents: true },
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    BASE_AUTH_URL: process.env.BASE_AUTH_URL,
    PREFIX_VONGQUAY: process.env.PREFIX_VONGQUAY
  },
  swcMinify: false,
  images: {
    disableStaticImages: true
  },
  webpack: function (config) {
    console.log({ config_mode: config.mode });
    config.module.rules.push(
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            encoding: true,
            limit: 100000,
            name: "[name].[ext]"
          }
        }
      },
    ),
      config.plugins.push(
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
        }),
        // new CompressionPlugin({
        //   filename: "[path][base].br",
        //   algorithm: "brotliCompress",
        //   test: /\.(js|css|html|svg)$/,
        //   compressionOptions: {
        //     params: {
        //       [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        //     },
        //   },
        //   threshold: 10240,
        //   minRatio: 0.8,
        //   deleteOriginalAssets: false,
        // })
      )
    if (
      config.mode === "production"
      && Array.isArray(config.optimization.minimizer)
    ) {
      const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
      const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

      config.optimization.minimizer.push(
        new OptimizeCSSAssetsPlugin({}),
        new UglifyJsPlugin({
          cache: true,
          extractComments: false,
          sourceMap: false,
          parallel: true,
          uglifyOptions: {
            compress: true,
            mangle: true,
            warnings: false
          }
        }));
    }
    return config;
  }
};

