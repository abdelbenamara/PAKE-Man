/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   views.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 00:51:03 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 11:07:52 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { html } from "ghtml";
import { resolve } from "path";

export namespace views {
  export const path = resolve(import.meta.dirname, "..", "views");
  export const mainClass =
    'class="m-0 flex min-h-screen w-screen flex-col bg-gray-100 p-0"';
  export const homeHtml = html`
    <div
      hx-post="/home"
      hx-target="#content"
      hx-trigger="load"
      class="hidden"
      hidden
    ></div>
  `;
}
