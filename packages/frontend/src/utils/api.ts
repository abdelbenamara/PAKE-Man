/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   api.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/07 21:04:09 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 02:21:07 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { IncomingHttpHeaders } from "node:http";

export namespace api {
  export const authCookieName = "__Host-auth-token";
  export const refreshCookieName = "__Host-refresh-token";
  export const csrfHeaderName = "x-csrf-token";
  export const request = async (
    route: string,
    method: string,
    headers: IncomingHttpHeaders,
    body?: Record<string, any>,
  ) => {
    const response = await fetch(process.env.PAKE_MAN_BACKEND_URL! + route, {
      method,
      headers: {
        Authorization: headers.authorization,
        "x-csrf-token": headers[csrfHeaderName] as string | undefined,
        Cookie: headers.cookie,
      },
      body: JSON.stringify(body),
    });

    if (
      response.status === 401 &&
      headers[csrfHeaderName] &&
      headers.cookie?.includes(refreshCookieName)
    ) {
      const refresh = await fetch(process.env.PAKE_MAN_BACKEND_URL! + route, {
        method: "POST",
        headers: {
          Authorization: headers.authorization,
          "x-csrf-token": headers[csrfHeaderName] as string | undefined,
          Cookie: headers.cookie,
        },
      });

      if (refresh.ok) {
        const payload = await refresh.json();
        const fresh = payload as { access_token: string; csrf_token: string };

        return fetch(process.env.PAKE_MAN_BACKEND_URL! + route, {
          method,
          headers: {
            Authorization: `Bearer ${fresh.access_token}`,
            "x-csrf-token": fresh.csrf_token,
            Cookie: headers.cookie,
          },
          body: JSON.stringify(body),
        });
      }
    }

    return Promise.resolve(response);
  };
  export const get = (route: string, headers: IncomingHttpHeaders) => {
    return request(route, "GET", headers);
  };
  export const post = (
    route: string,
    headers: IncomingHttpHeaders,
    body?: Record<string, any>,
  ) => {
    return request(route, "POST", headers, body);
  };
}
