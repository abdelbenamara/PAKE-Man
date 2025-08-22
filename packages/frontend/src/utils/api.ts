/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   api.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/07 21:04:09 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 02:25:32 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { FastifyRequest } from "fastify";

export const accessTokenCookieName = "__Host-access-token";
export const mfaTokenCookieName = "__Host-mfa-token";
export const refreshTokenCookieName = "__Host-refresh-token";
export const request = async (
  route: string,
  method: string,
  req: FastifyRequest,
  body?: Record<string, unknown>,
) => {
  const response = await fetch(process.env.PAKE_MAN_BACKEND_URL! + route, {
    method,
    headers: {
      Authorization:
        "Bearer " +
        req.unsignCookie(req.cookies[accessTokenCookieName] || "").value,
    },
    body: JSON.stringify(body),
  });
  const refreshToken = req.unsignCookie(
    req.cookies[refreshTokenCookieName] || "",
  );

  if (response.status === 401 && refreshToken.valid) {
    const refresh = await fetch(
      process.env.PAKE_MAN_BACKEND_URL! + "/api/v1/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({
          refresh_token: refreshToken.value,
        }),
      },
    );

    if (refresh.ok) {
      const payload = await refresh.json();
      const data = payload as { access_token: string };

      return fetch(process.env.PAKE_MAN_BACKEND_URL! + route, {
        method,
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
        body: JSON.stringify(body),
      });
    }
  }

  return Promise.resolve(response);
};
export const get = (route: string, req: FastifyRequest) => {
  return request(route, "GET", req);
};
export const post = (
  route: string,
  req: FastifyRequest,
  body?: Record<string, unknown>,
) => {
  return request(route, "POST", req, body);
};
