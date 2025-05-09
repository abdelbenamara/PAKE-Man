/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   base.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 17:21:47 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/09 13:00:13 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { html } from "lit";

export function createApp() {
  return html`<canvas id="app" class="m-0 h-full w-full p-0"></canvas>`;
}
