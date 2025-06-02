/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   helmet.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/10 18:03:10 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/14 20:27:31 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyHelmetPlugin, { FastifyHelmetOptions } from "@fastify/helmet";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    scope.register(FastifyHelmetPlugin, {
      global: true,
    } as FastifyHelmetOptions);
  },
  { name: "helmet" },
);
