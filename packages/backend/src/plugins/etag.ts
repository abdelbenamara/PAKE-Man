/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   etag.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/13 11:27:15 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/29 17:44:45 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyEtagPlugin, { FastifyEtagOptions } from "@fastify/etag";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    scope.register(FastifyEtagPlugin, {
      algorithm: "sha1",
    } as FastifyEtagOptions);
  },
  { name: "etag", dependencies: ["cors"] },
);
