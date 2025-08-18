/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/09 14:27:16 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 02:58:11 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { loadPong } from "#pong";
import htmx from "htmx.org";

function loadTournaments() {
  const upcoming = [
    { name: "Summer Showdown", date: "2025-07-15" },
    { name: "July Clash", date: "2025-07-30" },
  ];
  const terminated = [{ name: "Spring Cup", date: "2025-05-20" }];
  const up = document.getElementById("upcomingList")!;

  up.replaceChildren();
  upcoming.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = `${t.name} - ${t.date}`;

    up.appendChild(li);
  });

  const term = document.getElementById("terminatedList")!;

  term.replaceChildren();
  terminated.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = `${t.name} - ${t.date}`;

    term.appendChild(li);
  });
}

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
