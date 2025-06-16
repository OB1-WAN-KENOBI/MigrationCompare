const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    mode: argv.mode,

    entry: {
      index: path.resolve(__dirname, "src/js/main.js"),
      countries: path.resolve(__dirname, "src/js/updateTable.js"),
      about: path.resolve(__dirname, "src/js/pdf-export.js"),
    },

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/[name].[contenthash].js",
      clean: true, // очищает dist перед сборкой
    },

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpe?g|svg|gif)$/i,
          type: "asset/resource",
          generator: {
            filename: "images/[name][ext]",
          },
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src/index.html"),
        filename: "index.html",
        chunks: ["index"],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src/countries.html"),
        filename: "countries.html",
        chunks: ["countries"],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src/about.html"),
        filename: "about.html",
        chunks: ["about"],
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, "src/images"), to: "images" },
          {
            from: path.resolve(__dirname, "src/numbeo-data.json"),
            to: "numbeo-data.json",
          },
        ],
      }),
    ],

    devServer: {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      port: 8080,
      hot: true,
      open: true,
    },

    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    optimization: {
      splitChunks: { chunks: "all" },
    },
  };
};
