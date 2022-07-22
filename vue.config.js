const path = require("path");

let publicPath = process.env.NODE_ENV === 'production' ? '/' : '/';

module.exports = {
  publicPath,
  // outputDir: path.resolve(__dirname, "../vue-build/dist"),
  // assetsDir: "../../static/SPA"
};