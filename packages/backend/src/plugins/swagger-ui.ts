/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   swagger-ui.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/11 16:01:57 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/31 15:59:29 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifySwaggerUiPlugin, {
  FastifySwaggerUiOptions,
} from "@fastify/swagger-ui";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    scope.register(FastifySwaggerUiPlugin, {
      routePrefix: "/api/docs",
    } as FastifySwaggerUiOptions);
  },
  { name: "swagger-ui", dependencies: ["swagger"] },
);
