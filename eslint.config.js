/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   eslint.config.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 17:02:32 by abenamar          #+#    #+#             */
/*   Updated: 2025/04/01 19:12:41 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import eslintConfigPrettier from "eslint-config-prettier/flat";
import { configs as litConfigs } from "eslint-plugin-lit";
import { configs as wcConfigs } from "eslint-plugin-wc";
import { defineConfig } from "eslint/config";
import neostandard, { resolveIgnoresFromGitignore } from "neostandard";

/**
 * @type {import('eslint').Linter.Config}
 */
export default defineConfig([
  eslintConfigPrettier,
  ...neostandard({
    ignores: resolveIgnoresFromGitignore(),
    noStyle: true,
    ts: true,
  }),
  { ...litConfigs["flat/recommended"] },
  { ...wcConfigs["flat/recommended"] },
]);
