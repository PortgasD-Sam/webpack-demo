const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

const cssLoaders = [parts.tailwind()];

const commonConfig = merge([
  { entry: ["./src"] },
  parts.page({ title: "Demo" }),
  parts.extractCSS({ loaders: cssLoaders }),
]);

const productionConfig = merge([parts.eliminateUnusedCSS()]);

const developmentConfig = merge([
  { entry: ["webpack-plugin-serve/client"] },
  parts.devServer(),
]);

const getConfig = (mode) => {
  switch (mode) {
    case "production":
      return merge(commonConfig, productionConfig, { mode });
    case "development":
      return merge(commonConfig, developmentConfig, { mode });
    default:
      throw new Error(`Trying to use an unkown mode, ${mode}`);
  }
};

module.exports = getConfig(mode);
