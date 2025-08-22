/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   eslint.config.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/10 17:20:55 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/17 17:44:00 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import neostandard, { resolveIgnoresFromGitignore } from "neostandard";
import tseslint from "typescript-eslint";

/**
 * @type {import('eslint').Linter.Config}
 */
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ...tseslint.configs.recommended.parserOptions,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintConfigPrettier,
  ...neostandard({
    ignores: resolveIgnoresFromGitignore(),
    noStyle: true,
    ts: true,
  }),
);
