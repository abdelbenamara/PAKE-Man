/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sensible.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/05 14:12:38 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/05 14:12:41 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifySensiblePlugin, {
  FastifySensibleOptions,
} from "@fastify/sensible";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    scope.register(FastifySensiblePlugin, {
      sharedSchemaId: "HttpError",
    } as FastifySensibleOptions);
  },
  { name: "sensible" },
);
