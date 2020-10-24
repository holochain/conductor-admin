const path = require("path");
module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
        "vuetify-file-browser":
          process.env.NODE_ENV === "development"
            ? path.resolve(__dirname, "../component")
            : "vuetify-file-browser"
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: "string-replace-loader",
          options: {
            search: "__AXIOS_BASE_URL__",
            replace:
              process.env.NODE_ENV === "development"
                ? "http://localhost:8081"
                : "https://vuetify-file-browser-server.herokuapp.com",
            flags: "g"
          }
        }
      ]
    }
  }
};
