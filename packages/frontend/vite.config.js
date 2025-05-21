/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   vite.config.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 08:56:20 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/21 10:51:45 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { resolve } from "node:path";
import { defineConfig } from "vite";

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  root: resolve(import.meta.dirname, "src", "client"),
  build: {
    outDir: resolve(import.meta.dirname, "dist", "client"),
    emptyOutDir: true,
  },
});
