/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/17 14:38:00 by abenamar          #+#    #+#             */
/*   Updated: 2025/06/01 18:51:28 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { User } from "#generated/prisma";
import FastifyJWTPlugin, { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export namespace jwt {
  export type UserInfo = Pick<
    User,
    "picture" | "email" | "name" | "created_at"
  >;

  export const accessTokenCookieName = "__Host-access-token";
  export const refreshTokenCookieName = "__Host-refresh-token";
  export const setAccessToken = (
    fastify: FastifyInstance,
    reply: FastifyReply,
    payload: jwt.UserInfo,
  ) => {
    const accessToken = fastify.jwt.sign(payload);
    const refreshToken = fastify.jwt.sign(
      { name: payload.name },
      { expiresIn: "1d" },
    );
    const secondsIn1Day = 86_400;
    const epochIn1Day = Date.now() + secondsIn1Day * 1_000;

    reply.cookie(refreshTokenCookieName, refreshToken, {
      maxAge: secondsIn1Day,
      expires: new Date(epochIn1Day),
    });

    return accessToken;
  };
}

export default fp(
  async (scope) => {
    scope
      .register(FastifyJWTPlugin, {
        secret: process.env.PAKE_MAN_JWT_SECRET!,
        cookie: {
          cookieName: jwt.refreshTokenCookieName,
          signed: true,
        },
        sign: {
          expiresIn: "10m",
        },
      } as FastifyJWTOptions)
      .decorate(
        "verifyAccessToken",
        async (req: FastifyRequest, reply: FastifyReply) => {
          try {
            await req.jwtVerify();
          } catch (err) {
            return reply.send(err);
          }
        },
      )
      .decorate(
        "verifyRefreshToken",
        async (req: FastifyRequest, reply: FastifyReply) => {
          try {
            await req.jwtVerify({ onlyCookie: true });
          } catch (err) {
            return reply.send(err);
          }
        },
      );
  },
  { name: "jwt", dependencies: ["cookie"] },
);

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: jwt.UserInfo | Pick<jwt.UserInfo, "name">;
    user: jwt.UserInfo;
  }
}

declare module "fastify" {
  type OnRequestHook = (
    req: FastifyRequest,
    reply: FastifyReply,
  ) => Promise<void>;

  interface FastifyInstance {
    verifyAccessToken: OnRequestHook;
    verifyRefreshToken: OnRequestHook;
  }
}
