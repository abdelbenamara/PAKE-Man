/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mailer.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/11 22:44:25 by abenamar          #+#    #+#             */
/*   Updated: 2025/06/23 20:29:32 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import nodemailer, { Transporter } from "nodemailer";

interface FastifyMailerOptions {
  transport: Parameters<typeof nodemailer.createTransport>[0];
  defaults?: Parameters<typeof nodemailer.createTransport>[1];
}

const fastifyMailer: FastifyPluginCallback<FastifyMailerOptions> = (
  fastify,
  options,
  next,
) => {
  const { transport, defaults } = options;
  const transporter = nodemailer.createTransport(transport, defaults);

  fastify.decorate("mailer", transporter);
  fastify.decorateReply("sendMail", transporter.sendMail.bind(transporter));

  next();
};
const FastifyMailerPlugin = fp(fastifyMailer, {
  fastify: "5.x",
  name: "fastify-mailer",
});

export default fp(
  async (scope) => {
    scope.register(FastifyMailerPlugin, {
      transport: {
        host: process.env.PAKE_MAN_MAIL_TRANSPORT_HOST!,
        port: parseInt(process.env.PAKE_MAN_MAIL_TRANSPORT_PORT!),
      },
    } as FastifyMailerOptions);
  },
  { name: "mailer" },
);

declare module "fastify" {
  interface FastifyInstance {
    mailer: Transporter;
  }
}
declare module "fastify" {
  interface FastifyReply {
    sendMail: Transporter["sendMail"];
  }
}
