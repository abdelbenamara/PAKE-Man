/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cookie.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/06 20:27:19 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/06 23:38:09 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyCookiePlugin from "@fastify/cookie";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    scope.register(FastifyCookiePlugin);
  },
  { name: "cookie", dependencies: ["cors"] },
);
