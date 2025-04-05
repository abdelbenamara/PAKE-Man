/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lint-staged.config.js                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/12 18:09:31 by abenamar          #+#    #+#             */
/*   Updated: 2025/04/05 09:47:20 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  "!(*.js|*.ts|.prettierignore)": "prettier --write",
  "*.{js,ts}": ["eslint --fix", "prettier --write"],
  "**/client/**/*.ts": () => "tsc -p src/client --noEmit",
  "!(**/client/**/*).ts": () => "tsc -p . --noEmit",
};
