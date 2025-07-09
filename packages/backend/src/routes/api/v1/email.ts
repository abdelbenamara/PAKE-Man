/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   email.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/10 21:25:03 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/09 03:06:10 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { auth } from "#utils/auth.js";
import { FastifyPluginAsync } from "fastify";

const email: FastifyPluginAsync = async (scope) => {
  scope.register(
    async (scope) => {
      scope.register(
        async (scope) => {
          scope
            .get(
              "",
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
                    required: ["token"],
                  },
                  response: {
                    204: {
                      description: "Email verified successfully",
                    },
                    ...auth.unauthorizedResponseSchema,
                  },
                },
              },
              async (req, reply) => {
                try {
                  const user = await scope.prisma.user.findUniqueOrThrow({
                    where: { public_id: req.user!.public_id },
                    select: { email_verified: true },
                  });

                  if (!user.email_verified) {
                    await scope.prisma.user.update({
                      where: { public_id: req.user!.public_id },
                      data: { email_verified: true },
                    });
                  }

                  return reply.code(204).send();
                } catch (err) {
                  return reply.send(err);
                }
              },
            )
            .post(
              "/link",
              {
                onRequest: [scope.authenticateAccessJwt, scope.csrfProtection],
                schema: {
                  security: [{ bearerAuth: [], csrfAuth: [] }],
                  tags: ["email"],
                  response: {
                    204: {
                      description: "Verification email sent successfully",
                    },
                    ...auth.unauthorizedResponseSchema,
                  },
                },
              },
              async (req, reply) => {
                try {
                  const user = await scope.prisma.user.findUniqueOrThrow({
                    where: { public_id: req.user!.public_id },
                    select: { email: true, name: true },
                  });
                  const token = await reply.queryJwtSign({
                    public_id: req.user!.public_id,
                  });
                  const link = `${req.protocol}://${req.host}/api/email/check?token=${token}`;

                  await reply.sendMail({
                    from: `no-reply@${process.env.PAKE_MAN_DOMAIN_NAME}`,
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

                  return reply.code(204).send();
                } catch (err) {
                  return reply.send(err);
                }
              },
            );
        },
        { prefix: "/verification" },
      );
    },
    { prefix: "/email" },
  );
};

export default email;
