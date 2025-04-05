/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   web-test-runner.config.js                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/24 15:09:02 by abenamar          #+#    #+#             */
/*   Updated: 2025/04/01 19:03:31 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { litSsrPlugin } from "@lit-labs/testing/web-test-runner-ssr-plugin.js";
import {
  removeViteLogging,
  vitePlugin,
} from "@remcovaes/web-test-runner-vite-plugin";
import { playwrightLauncher } from "@web/test-runner-playwright";
import { join } from "node:path";

/**
 * @type {import('@web/test-runner').TestRunnerConfig}
 */
export default {
  files: ["src/client/**/*.test.ts"],
  nodeResolve: true,
  preserveSymlinks: true,
  rootDir: join(import.meta.dirname, "src", "client"),
  browsers: [
    playwrightLauncher({ product: "chromium" }),
    playwrightLauncher({ product: "firefox" }),
    playwrightLauncher({ product: "webkit" }),
  ],
  plugins: [litSsrPlugin(), vitePlugin()],
  filterBrowserLogs: removeViteLogging,
  coverage: true,
};
