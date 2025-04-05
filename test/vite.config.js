/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   vite.config.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 08:56:20 by abenamar          #+#    #+#             */
/*   Updated: 2025/03/28 11:51:02 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { join } from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  root: join(import.meta.dirname, "..", "src", "client"),
  plugins: [tsconfigPaths()],
  build: {
    target: "esnext",
    outDir: join(import.meta.dirname, "dist"),
    sourcemap: "hidden",
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    },
    ssr: "./index.ts",
    emptyOutDir: true,
  },
  ssr: {
    external: ["fastify"],
  },
});
