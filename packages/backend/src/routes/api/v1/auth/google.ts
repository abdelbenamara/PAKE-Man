/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   google.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/14 10:14:01 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/07 00:49:45 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { User } from "#generated/prisma";
import { auth } from "#utils/auth.js";
import { FastifyInstance, FastifyPluginAsync } from "fastify";

type GoogleUserInfo = {
  email: string;
  picture: string;
  sub: string;
};

async function registerUserFromGoogleInfo(
  fastify: FastifyInstance,
  info: Readonly<GoogleUserInfo>,
) {
  const last = (await fastify.prisma.user.findFirst({
    select: { id: true },
    orderBy: { id: "desc" },
  })) || { id: 0 };

  return await fastify.prisma.user.create({
    data: {
      google_id: info.sub,
      email: info.email,
      name: "Player#" + (last.id + 1),
      picture: info.picture,
    },
    select: { private_id: true, email: true },
  });
}

async function getUserFromGoogleInfo(
  fastify: FastifyInstance,
  info: Readonly<GoogleUserInfo>,
) {
  const user = ((await fastify.prisma.user.findUnique({
    where: { google_id: info.sub },
    select: { private_id: true, email: true },
  })) || {}) as Partial<User>;

  if (!user.private_id) {
    Object.assign(user, await registerUserFromGoogleInfo(fastify, info));
  }

  const data = { email: user.email };

  if (info.email === data.email) {
    delete data.email;
  }

  return await fastify.prisma.user.update({
    where: { private_id: user.private_id },
    data,
    select: { public_id: true },
  });
}

const google: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.get(
        "/callback",
        {
          schema: {
            tags: ["auth"],
            response: auth.successfulResponseSchema,
          },
        },
        async (req, reply) => {
          try {
            const oauth2 =
              await scope.oauth2Google!.getAccessTokenFromAuthorizationCodeFlow(
                req,
                reply,
              );
            req.user = await getUserFromGoogleInfo(
              scope,
              (await scope.oauth2Google!.userinfo(
                oauth2.token,
              )) as Readonly<GoogleUserInfo>,
            );
            const frontendUrl = process.env.PAKE_MAN_FRONTEND_URL;
            const payload = await auth.verify(scope, req, reply);

            if (frontendUrl) {
              const secondsIn5Minutes = 60 * 5;
              const epochIn5Minutes = Date.now() + secondsIn5Minutes * 1_000;

              reply.cookie(auth.cookieName, JSON.stringify(payload), {
                maxAge: secondsIn5Minutes,
                expires: new Date(epochIn5Minutes),
                sameSite: "lax",
                signed: false,
              });

              scope.log.warn(JSON.stringify(payload));

              return reply.redirect(frontendUrl);
            }

            return reply.send(payload);
          } catch (err) {
            return reply.send(err);
          }
        },
      );
    },
    { prefix: "/google" },
  );
};

export default google;
