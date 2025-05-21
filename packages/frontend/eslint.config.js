/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   eslint.config.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 17:02:32 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/19 10:54:18 by abenamar         ###   ########.fr       */
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
