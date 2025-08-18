/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   swagger.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/10 18:21:41 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 04:08:20 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifySwaggerPlugin, {
  SwaggerOptions as FastifySwaggerOptions,
} from "@fastify/swagger";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    scope.register(FastifySwaggerPlugin, {
      openapi: {
        openapi: "3.1.1",
        info: {
          title: "PAKE-Man frontend API",
          version: "0.2.0",
        },
        components: {
          securitySchemes: {
            csrfAuth: {
              type: "apiKey",
              name: "x-csrf-token",
              in: "header",
            },
          },
        },
      },
    } as FastifySwaggerOptions);
  },
  { name: "swagger", dependencies: ["etag"] },
);
