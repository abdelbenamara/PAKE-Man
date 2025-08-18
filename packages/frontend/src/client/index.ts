/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/09 14:27:16 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 15:04:51 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { loadPong } from "#pong";
import { loadTournaments } from "#tournaments";
import htmx from "htmx.org";

function hydrate() {
  const routes = {
    "/pong": loadPong,
    "/tournaments": loadTournaments,
  };
  const path = document.location.pathname;

  if (path in routes) {
    routes[path]();
  }
}

htmx.on("htmx:afterSettle", hydrate);
hydrate();
