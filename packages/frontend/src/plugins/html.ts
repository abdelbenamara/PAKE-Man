/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   html.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/05 14:18:11 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/05 14:34:31 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyHtmlPlugin, { FastifyHtmlOptions } from "fastify-html";
import fp from "fastify-plugin";
import { includeFile } from "ghtml/includeFile.js";
import { resolve } from "node:path";

export default fp(
  async (scope) => {
    await scope.register(FastifyHtmlPlugin, {
      async: true,
    } as FastifyHtmlOptions);

    scope.addLayout(
      (inner) => {
        const base = includeFile(
          resolve(import.meta.dirname, "..", "client", "index.html"),
        ).split("<!-- inner -->");

        return scope.html`!${base[0]}!${inner}!${base[1]}`;
      },
      { skipOnHeader: "hx-request" },
    );
  },
  { name: "helmet" },
);
