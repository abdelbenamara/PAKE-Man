/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   helmet.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/05 14:11:07 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/16 12:37:25 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyHelmetPlugin, { FastifyHelmetOptions } from "@fastify/helmet";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    scope.register(FastifyHelmetPlugin, {
      contentSecurityPolicy: {
        directives: {
          "connect-src": ["'self'", "https:", "assets.babylonjs.com"],
          "img-src": [
            "'self'",
            "data:",
            "https:",
            "developers.google.com",
            "lh3.googleusercontent.com",
          ],
          "script-src": [
            "'self'",
            "'unsafe-eval'",
            "'sha256-rEoKEh+ixY/s4bkl+CNhaCR+cWdAJ6YviVnKiRKmB9o='",
          ],
        },
      },
      global: true,
    } as FastifyHelmetOptions);
  },
  { name: "helmet" },
);
