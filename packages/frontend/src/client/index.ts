/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/09 14:27:16 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 02:28:40 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { loadPong } from "#pong.ts";
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

function loadProfile() {
  document
    .getElementById("profilePicInput")!
    .addEventListener("change", (e) => {
      const file = (e.target! as any).files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = () =>
          ((document.getElementById("displayPic")! as any).src = reader.result);

        reader.readAsDataURL(file);
      }
    });

  document.getElementById("profileForm")!.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = (document.getElementById("nameInput")! as any).value;
    document.getElementById("displayName")!.textContent = name;
  });

  let twoFAEnabled = false;

  document.getElementById("enable2faBtn")!.addEventListener("click", () => {
    twoFAEnabled = !twoFAEnabled;
    document.getElementById("enable2faBtn")!.textContent = twoFAEnabled
      ? "Disable 2FA"
      : "Enable 2FA";
  });
}

function hydrate() {
  const routes = {
    "/pong": loadPong,
    "/tournaments": loadTournaments,
    "/user/profile": loadProfile,
  };
  const path = document.location.pathname;

  if (routes[path]) {
    routes[path]();
    console.info(`Hydrated path: ${path}`);
  } else {
    console.warn(`No script found for path: ${path}`);
  }
}

htmx.on("htmx:afterSettle", hydrate);
hydrate();
