/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   etag.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/05 14:11:57 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/05 14:12:00 by abenamar         ###   ########.fr       */
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
