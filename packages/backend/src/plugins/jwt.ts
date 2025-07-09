/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/17 14:38:00 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/08 20:01:35 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { User } from "#generated/prisma";
import FastifyJWTPlugin, {
  FastifyJwtNamespace,
  FastifyJWTOptions,
} from "@fastify/jwt";
import {
  FastifyReply,
  FastifyRequest,
  onRequestAsyncHookHandler,
} from "fastify";
import fp from "fastify-plugin";

export namespace jwt {
  export type UserInfo = Pick<User, "public_id">;

  export const cookieName = "__Host-refresh-token";
  export const setAccessToken = async (
    reply: FastifyReply,
    payload: jwt.UserInfo,
  ) => {
    const accessToken = await reply.accessJwtSign(payload);
    const refreshToken = await reply.refreshJwtSign(payload);
    const secondsIn1Day = 86_400;
    const epochIn1Day = Date.now() + secondsIn1Day * 1_000;

    reply.cookie(cookieName, refreshToken, {
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
        secret: process.env.PAKE_MAN_JWT_SECRET_ACCESS!,
        sign: {
          expiresIn: "5m",
        },
        namespace: "access",
      } as FastifyJWTOptions)
      .register(FastifyJWTPlugin, {
        secret: process.env.PAKE_MAN_JWT_SECRET_QUERY!,
        sign: {
          expiresIn: "10m",
        },
        verify: {
          extractToken: (
            req: FastifyRequest<{ Querystring: { token?: string } }>,
          ) => req.query.token,
        },
        namespace: "query",
      } as FastifyJWTOptions)
      .register(FastifyJWTPlugin, {
        secret: process.env.PAKE_MAN_JWT_SECRET_REFRESH!,
        cookie: {
          cookieName: jwt.cookieName,
        },
        sign: {
          expiresIn: "1d",
        },
        namespace: "refresh",
      } as FastifyJWTOptions)
      .decorate(
        "authenticateAccessJwt",
        async (req: FastifyRequest, reply: FastifyReply) => {
          try {
            await req.accessJwtVerify();
          } catch (err) {
            return reply.send(err);
          }
        },
      )
      .decorate(
        "authenticateQueryJwt",
        async (req: FastifyRequest, reply: FastifyReply) => {
          try {
            await req.queryJwtVerify();
          } catch (err) {
            return reply.send(err);
          }
        },
      )
      .decorate(
        "authenticateRefreshJwt",
        async (req: FastifyRequest, reply: FastifyReply) => {
          try {
            await req.refreshJwtVerify({ onlyCookie: true });
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
    payload: jwt.UserInfo;
    user: jwt.UserInfo | null;
  }
}

declare module "fastify" {
  interface FastifyInstance
    extends FastifyJwtNamespace<{ namespace: "access" }>,
      FastifyJwtNamespace<{ namespace: "query" }>,
      FastifyJwtNamespace<{ namespace: "refresh" }> {
    authenticateAccessJwt: onRequestAsyncHookHandler;
    authenticateQueryJwt: onRequestAsyncHookHandler;
    authenticateRefreshJwt: onRequestAsyncHookHandler;
  }

  interface FastifyRequest {
    accessJwtVerify: FastifyRequest["jwtVerify"];
    queryJwtVerify: FastifyRequest["jwtVerify"];
    refreshJwtVerify: FastifyRequest["jwtVerify"];
  }

  interface FastifyReply {
    accessJwtSign: FastifyReply["jwtSign"];
    queryJwtSign: FastifyReply["jwtSign"];
    refreshJwtSign: FastifyReply["jwtSign"];
  }
}
