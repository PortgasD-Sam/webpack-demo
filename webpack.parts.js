const { WebpackPluginServe } = require("webpack-plugin-serve");

exports.devServer = () => ({
  watch: true,
  plugins: [
    new WebpackPluginServe({
      port: parseInt(process.env.PORT, 10) || 8080,
      static: "./dist",
      liveReload: true,
      waitForBuild: true,
    }),
  ],
});

const { MiniHtmlWebpackPlugin } = require("mini-html-webpack-plugin");

exports.page = ({ title }) => ({
  plugins: [new MiniHtmlWebpackPlugin({ context: { title } })],
});

exports.loadCSS = () => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
});

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

exports.extractCSS = ({ options = {}, loaders = [] } = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader, options },
            "css-loader",
          ].concat(loaders),
          sideEffects: true,
        },
      ],
    },
    plugins: [new MiniCssExtractPlugin({ filename: "styles/[name].css" })],
  };
};

exports.tailwind = () => ({
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: [require("tailwindcss")()],
    },
  },
});

const path = require("path");
const glob = require("glob");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");

const ALL_FILES = glob.sync(path.join(__dirname, "src/*.js"));

exports.eliminateUnusedCSS = () => ({
  plugins: [
    new PurgeCSSPlugin({
      paths: ALL_FILES,
      extractors: [
        {
          extractor: (content) =>
            content.match(/[^<>"'`\s]*{^<>"'`\s:]/g) || [],
          extensions: ["html"],
        },
      ],
    }),
  ],
});
