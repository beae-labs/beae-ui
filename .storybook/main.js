const path = require("path")
const fs = require("fs")

function getStories({ pkg, dir = "components" }) {
  const dirName = `packages/${dir}`
  const scope = pkg ? [pkg] : fs.readdirSync(dirName)
  return scope
    .map((package) => `${dirName}/${package}/stories`)
    .filter((storyDir) => fs.existsSync(storyDir))
    .map((storyDir) => `../${storyDir}/*.stories.ts`)
}

module.exports = {
  core: {
    builder: "@storybook/builder-webpack5",
    disableTelemetry: true,
  },
  stories: [...getStories({ dir: "components" })],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-essentials",
    "@storybook/addon-storysource",
    "@chakra-ui/storybook-addon",
  ],
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@beae-ui/vue": path.resolve(__dirname, "../packages/components"),
    }
    config.resolve.extensions.push(".ts", ".ts")
    return config
  },
  typescript: {
    reactDocgen: false,
  },
}
