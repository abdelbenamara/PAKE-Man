/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   swagger.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/10 18:21:41 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/31 10:59:07 by abenamar         ###   ########.fr       */
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
          title: "PAKE-Man backend API",
          version: "0.1.0",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
            csrfAuth: {
              type: "apiKey",
              name: "x-crsf-token",
              in: "header",
            },
          },
        },
      },
    } as FastifySwaggerOptions);
  },
  { name: "swagger", dependencies: ["static"] },
);
