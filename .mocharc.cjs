// .mocharc.cjs
module.exports = {
  require: [
    "ts-node/register", // Register TypeScript
  ],
  extension: ["ts"],
  file: "./test/setup.ts",
  recursive: true,
  timeout: 5000,
  colors: "true",
  spec: ["test/api/*.spec.ts"],
  reporter: "mochawesome",
  "reporter-option": [
    `reportFilename=alpha_vantage_api_test_${process.env.NAME}`,
    "overwrite=false",
    `reportTitle=Alpha Vantage API ${process.env.NAME}`,
    "timestamp=true",
    "showHooks=always",
    "code=true",
  ],
};
