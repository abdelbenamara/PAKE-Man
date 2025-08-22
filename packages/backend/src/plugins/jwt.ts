/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/17 14:38:00 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/16 13:54:27 by abenamar         ###   ########.fr       */
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

export type UserId = Pick<User, "public_id">;

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
        secret: process.env.PAKE_MAN_JWT_SECRET_MFA!,
        sign: {
          expiresIn: "10m",
        },
        verify: {
          extractToken: (req: FastifyRequest<{ Body: { token: string } }>) => {
            return req.body.token;
          },
        },
        namespace: "mfa",
      } as FastifyJWTOptions)
      .register(FastifyJWTPlugin, {
        secret: process.env.PAKE_MAN_JWT_SECRET_REFRESH!,
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
        "authenticateMfaJwt",
        async (req: FastifyRequest, reply: FastifyReply) => {
          try {
            await req.mfaJwtVerify();
          } catch (err) {
            return reply.send(err);
          }
        },
      )
      .decorate(
        "authenticateRefreshJwt",
        async (req: FastifyRequest, reply: FastifyReply) => {
          try {
            await req.refreshJwtVerify();
          } catch (err) {
            return reply.send(err);
          }
        },
      );
  },
  { name: "jwt" },
);

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: UserId;
    user: UserId | null;
  }
}

declare module "fastify" {
  interface FastifyInstance
    extends FastifyJwtNamespace<{ namespace: "access" }>,
      FastifyJwtNamespace<{ namespace: "query" }>,
      FastifyJwtNamespace<{ namespace: "refresh" }> {
    authenticateAccessJwt: onRequestAsyncHookHandler;
    authenticateMfaJwt: onRequestAsyncHookHandler;
    authenticateRefreshJwt: onRequestAsyncHookHandler;
  }

  interface FastifyRequest {
    accessJwtVerify: FastifyRequest["jwtVerify"];
    mfaJwtVerify: FastifyRequest["jwtVerify"];
    refreshJwtVerify: FastifyRequest["jwtVerify"];
  }

  interface FastifyReply {
    accessJwtSign: FastifyReply["jwtSign"];
    mfaJwtSign: FastifyReply["jwtSign"];
    refreshJwtSign: FastifyReply["jwtSign"];
  }
}
