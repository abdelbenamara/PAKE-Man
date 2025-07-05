/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   helmet.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/05 14:11:07 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/05 14:25:19 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyHelmetPlugin, { FastifyHelmetOptions } from "@fastify/helmet";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    scope.register(FastifyHelmetPlugin, {
      global: false,
    } as FastifyHelmetOptions);
  },
  { name: "helmet" },
);
