import { createRequire } from "module";
const require = createRequire(import.meta.url);

import Dotenv from 'dotenv-webpack'

/** @param {import("webpack").Configuration} config */
export function webpack(config) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "crypto": false
    }

    config.plugins = [
        ...config.plugins, new Dotenv()
    ];
    return config;
  }