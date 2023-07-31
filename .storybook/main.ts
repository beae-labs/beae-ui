import type { StorybookConfig } from "@storybook/vue3-vite"

import { existsSync, readdirSync } from "fs"

function getStories({ dirname = "components" }) {
  const dirName = `packages/${dirname}`
  const scope = readdirSync(dirName)
  return scope
    .map((component: string) => `${dirName}/${component}/stories`)
    .filter((storyDirname) => existsSync(storyDirname))
    .map((storyDirname) => `../${storyDirname}/*.stories.ts`)
}

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ...getStories({ dirname: "components" }),
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
}
export default config
