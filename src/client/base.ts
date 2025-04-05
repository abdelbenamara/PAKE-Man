/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   base.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 17:21:47 by abenamar          #+#    #+#             */
/*   Updated: 2025/03/25 15:19:19 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "@pake-man/ui/components/my-element.ts";
import { html } from "lit";

export function createApp() {
  return html`<my-element></my-element>`;
}
