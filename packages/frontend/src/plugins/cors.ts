/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cors.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/05 14:11:30 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/05 16:33:57 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyCorsPlugin, { FastifyCorsOptions } from "@fastify/cors";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    scope.register(FastifyCorsPlugin, {
      origin: false,
    } as FastifyCorsOptions);
  },
  { name: "cors", dependencies: ["helmet"] },
);
