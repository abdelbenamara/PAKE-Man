/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   formbody.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 00:15:18 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 00:17:30 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyFormbodyPlugin, {
  FastifyFormbodyOptions,
} from "@fastify/formbody";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    scope.register(FastifyFormbodyPlugin, {
      bodyLimit: undefined,
    } as FastifyFormbodyOptions);
  },
  { name: "formbody" },
);
