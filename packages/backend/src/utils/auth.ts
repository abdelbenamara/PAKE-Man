/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/07 22:53:25 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/08 13:53:18 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { jwt } from "#plugins/jwt.js";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export namespace auth {
  async function hotp(
    req: FastifyRequest,
    reply: FastifyReply,
    csrfToken: string,
    user: { email: string; name: string },
  ) {
    const hotpToken = reply.htopGenerate();

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

    const queryToken = await reply.queryJwtSign({
      public_id: req.user!.public_id,
    });

    reply.code(202);

    return {
      query_token: queryToken,
      csrf_token: csrfToken,
    };
  }

  export const successfulResponseSchema = {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              access_token: { type: "string" },
              csrf_token: { type: "string" },
            },
          },
        },
      },
    },
    202: {
      description: "Two-factor authentication required",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              query_token: { type: "string" },
              csrf_token: { type: "string" },
            },
          },
        },
      },
    },
  };

  export const unauthorizedResponseSchema = {
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
  };

  export const internalServerErrorResponseSchema = {
    500: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
  };

  export async function successful(
    req: FastifyRequest,
    reply: FastifyReply,
    accessToken: string,
  ) {
    try {
      const csrfToken = reply.generateCsrf({ userInfo: req.user!.public_id });

      return {
        access_token: accessToken,
        csrf_token: csrfToken,
      };
    } catch (err) {
      return err;
    }
  }

  export async function verify(
    fastify: FastifyInstance,
    req: FastifyRequest,
    reply: FastifyReply,
  ) {
    try {
      const csrfToken = reply.generateCsrf({ userInfo: req.user!.public_id });
      const user = await fastify.prisma.user.findUnique({
        where: { public_id: req.user!.public_id },
        select: { email: true, name: true, hotp_enabled: true },
      });

      if (user!.hotp_enabled) {
        return hotp(req, reply, csrfToken, user!);
      }

      const accessToken = await jwt.setAccessToken(reply, req.user!);

      return successful(req, reply, accessToken);
    } catch (err) {
      return err;
    }
  }

  export const cookieName = "__Host-auth-token";
}
