/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/29 16:22:19 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 02:29:10 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { User } from "#generated/prisma";
import { FastifyPluginAsync, FastifyReply } from "fastify";

type UserInfo = Pick<User, "public_id" | "email" | "name" | "hotp_enabled">;

const hotpChallenge = async (user: UserInfo, reply: FastifyReply) => {
  const hotpToken = reply.hotpGenerate();

  await reply.sendMail({
    from: `no-reply@${process.env.PAKE_MAN_DOMAIN_NAME}`,
    to: user.email,
    subject: `Pake-Man Security Code: ${hotpToken}`,
    html: `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
            <p style="font-size: 1.5em; font-weight: bold;">Hello ${user.name}!</p>
            <p>To complete your login, please enter the following security code:</p>
            <p style="font-size: 2em; color: #D745E2; font-weight: bold;">${hotpToken}</p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you!</p>
            <p>Best regards,</p>
            <p style="font-weight: bold; font-size: 1.2em;">The PAKE-Man team</p>
          </body>
        </html>
      `,
  });

  const mfaToken = await reply.mfaJwtSign({
    public_id: user.public_id,
  });

  return reply.code(202).send({
    mfa_token: mfaToken,
  });
};
const authenticate = async (
  user: Pick<User, "public_id">,
  reply: FastifyReply
) => {
  const accessToken = await reply.accessJwtSign({
    public_id: user.public_id,
  });
  const refreshToken = await reply.refreshJwtSign({
    public_id: user.public_id,
  });

  return reply.code(201).send({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
};
const challenge = async (user: UserInfo, reply: FastifyReply) => {
  if (user.hotp_enabled) {
    return hotpChallenge(user, reply);
  }

  return authenticate(user, reply);
};
const auth: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope
        .post<{
          Body: {
            google_id: string;
            email: string;
            name: string;
            picture: string;
          };
        }>(
          "",
          {
            schema: { tags: ["auth"] },
          },
          async (req, reply) => {
            try {
              const user = await scope.prisma.user.upsert({
                where: { google_id: req.body.google_id },
                create: {
                  google_id: req.body.google_id,
                  email: req.body.email,
                  name: req.body.name,
                  picture: req.body.picture,
                },
                update: {
                  email: req.body.email,
                },
                select: {
                  public_id: true,
                  email: true,
                  name: true,
                  hotp_enabled: true,
                },
              });

              return challenge(user, reply);
            } catch (err) {
              return reply.send(err);
            }
          }
        )
        .post(
          "/refresh",
          {
            onRequest: [scope.authenticateRefreshJwt],
            schema: { security: [{ bearerAuth: [] }], tags: ["auth"] },
          },
          async (req, reply) => {
            try {
              const user = await scope.prisma.user.findUniqueOrThrow({
                where: { public_id: req.user!.public_id },
                select: {
                  public_id: true,
                  email: true,
                  name: true,
                  hotp_enabled: true,
                },
              });

              return challenge(user, reply);
            } catch (err) {
              return reply.send(err);
            }
          }
        )
        .post<{ Body: { code: string } }>(
          "/hotp",
          {
            preHandler: [scope.authenticateMfaJwt],
            schema: { tags: ["hotp"] },
          },
          async (req, reply) => {
            try {
              if (!req.hotpValidate({ token: req.body.code })) {
                return reply
                  .unauthorized()
                  .send({ error: "Invalid HOTP code" });
              }

              return authenticate(req.user!, reply);
            } catch (err) {
              return reply.send(err);
            }
          }
        );
    },
    { prefix: "/auth" }
  );
};

export default auth;
