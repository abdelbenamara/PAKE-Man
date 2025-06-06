/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   api-reference.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/11 16:01:57 by abenamar          #+#    #+#             */
/*   Updated: 2025/06/06 19:35:26 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyApiReferencePlugin, {
  FastifyApiReferenceOptions,
} from "@scalar/fastify-api-reference";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    await scope.register(FastifyApiReferencePlugin, {
      routePrefix: "/api/docs",
    } as FastifyApiReferenceOptions);
  },
  { name: "api-reference", dependencies: ["swagger"] }
);
