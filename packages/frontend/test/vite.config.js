/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   vite.config.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 08:56:20 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/09 14:36:03 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { resolve } from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  root: resolve(import.meta.dirname, "..", "src", "client"),
  plugins: [tsconfigPaths()],
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  build: {
    outDir: resolve(import.meta.dirname, "dist"),
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    },
    ssr: "./index.ts",
    emptyOutDir: true,
  },
});
