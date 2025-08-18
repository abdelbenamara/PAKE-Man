/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   html.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/05 14:18:11 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/16 14:06:05 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { layoutSeparator } from "#utils/views.js";
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
        const view = includeFile(
          resolve(import.meta.dirname, "..", "client", "index.html"),
        ).split(layoutSeparator);

        return scope.html`!${view[0]} !${inner} !${view[1]}`;
      },
      { skipOnHeader: "hx-request" },
    );
  },
  { name: "html", dependencies: ["csrf-protection"] },
);
