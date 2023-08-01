import { dirname, join } from "path"
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
    ...getStories({
      dirname: "components",
    }),
  ],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-mdx-gfm"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/vue3-vite"),
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
}
export default config
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")))
}
