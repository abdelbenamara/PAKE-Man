/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   email.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/10 21:25:03 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/04 01:23:21 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { auth } from "#utils/auth.js";
import { FastifyPluginAsync } from "fastify";

const email: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope
        .get(
          "/verify",
          {
            onRequest: [scope.authenticateQueryJwt],
            schema: {
              tags: ["email"],
              querystring: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                  },
                },
              },
              response: {
                200: {
                  description: "Email verification successful",
                  content: {
                    "application/json": {
                      schema: {
                        example: {
                          message: "Player#1 email verified successfully!",
                        },
                        type: "object",
                        properties: {
                          message: { type: "string" },
                        },
                      },
                    },
                  },
                },
                ...auth.unauthorizedResponseSchema,
              },
            },
          },
          async (req, reply) => {
            try {
              const user = await scope.prisma.user.update({
                where: {
                  public_id: req.user!.public_id,
                },
                data: {
                  hotp_enabled: true,
                },
                select: {
                  name: true,
                },
              });

              return reply.send({
                message: user.name + " email verified successfully!",
              });
            } catch (err) {
              return reply.send(err);
            }
          },
        )
        .post(
          "/verification/send",
          {
            onRequest: [scope.authenticateAccessJwt, scope.csrfProtection],
            schema: {
              security: [{ bearerAuth: [], csrfAuth: [] }],
              tags: ["email"],
              response: {
                200: {
                  description: "Verification email sent successfully",
                  content: {
                    "application/json": {
                      schema: {
                        example: {
                          message: "Verification email sent successfully!",
                        },
                        type: "object",
                        properties: {
                          message: { type: "string" },
                        },
                      },
                    },
                  },
                },
                ...auth.unauthorizedResponseSchema,
              },
            },
          },
          async (req, reply) => {
            try {
              const user = await scope.prisma.user.findUniqueOrThrow({
                where: {
                  public_id: req.user!.public_id,
                },
                select: {
                  email: true,
                  name: true,
                },
              });
              const token = await reply.queryJwtSign({
                public_id: req.user!.public_id,
              });
              const link = `${req.protocol}://${req.host}/api/email/verify?token=${token}`;

              await reply.sendMail({
                from: "no-reply@pake-man.fun",
                to: user.email,
                subject: "PAKE-Man Email Verification",
                html: `
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <body>
                    <p style="font-size: 1.5em; font-weight: bold;">Hello ${user.name}!</p>
                    <p style="font-size: 1.2em;">Please use the following <a href="${link}">link</a> to verify your email address.<p>
                    <br />
                    <p>If the link does not work, copy and paste the following URL into your browser:</p>
                    <a style=font-size: 0.9em; href="${link}">${link}</a>
                    <br />
                    <p>This link will expire in 10 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <br />
                    <p>Best regards,</p>
                    <p style="font-weight: bold; font-size: 1.2em;">The PAKE-Man team</p>
                  </body>
                </html>
              `,
              });

              return reply.send({
                message: "Verification email sent successfully!",
              });
            } catch (err) {
              return reply.send(err);
            }
          },
        );
    },
    { prefix: "/email" },
  );
};

export default email;
