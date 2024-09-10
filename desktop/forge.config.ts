// import {MakerDeb} from "@electron-forge/maker-deb"
import {MakerZIP} from "@electron-forge/maker-zip"
// import {MakerSquirrel} from "@electron-forge/maker-squirrel"
import {WebpackPlugin} from "@electron-forge/plugin-webpack"
import type {ForgeConfig} from "@electron-forge/shared-types"
import * as dotenv from "dotenv"
import path from "path"
import {forgeWebpackRules} from "./forge.webpack.rules"

dotenv.config({
  path: path.join(__dirname, ".env"),
})

const config: ForgeConfig = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    // build window on mac: https://github.com/Squirrel/Squirrel.Windows/issues/1605
    // new MakerSquirrel({}), // remove remote release if error
    new MakerZIP({}, ["darwin"]),
    // new MakerRpm({}),
    // new MakerDeb({}),
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig: {
        module: {rules: forgeWebpackRules},
        resolve: {extensions: [".js", ".ts", ".json"]},
        entry: "./src/main.ts",
      },
      renderer: {
        config: {
          module: {rules: forgeWebpackRules},
          resolve: {extensions: [".js", ".ts", ".json"]},
        },
        entryPoints: [{name: "main_window", preload: {js: "./src/preload.ts"}}],
      },
    }),
  ],
  publishers: [
    // {
    //   name: "@electron-forge/publisher-s3",
    //   config: {
    //     bucket: "public-electron-packages",
    //     region: "ap-southeast-2",
    //     folder: "id-scan-ai",
    //     public: true,
    //   },
    // },
    {
      name: "@electron-forge/publisher-github",
      config: {
        prerelease: true,
        authToken: process.env.GITHUB_TOKEN,
        repository: {
          owner: "jackrobertscott",
          name: "id-scan-ai",
        },
      },
    },
  ],
}

export default config
