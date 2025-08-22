/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cors.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/12 20:19:45 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/31 13:56:37 by abenamar         ###   ########.fr       */
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
