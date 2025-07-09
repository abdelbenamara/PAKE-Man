/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   views.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 00:51:03 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 00:51:53 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { resolve } from "path";

export namespace views {
  export const path = resolve(import.meta.dirname, "..", "views");
}
