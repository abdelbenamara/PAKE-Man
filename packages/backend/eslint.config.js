/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   eslint.config.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/10 17:20:55 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/10 17:21:18 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import eslintConfigPrettier from "eslint-config-prettier/flat";
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
]);
