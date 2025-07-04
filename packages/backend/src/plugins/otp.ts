/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   otp.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/08 11:00:25 by abenamar          #+#    #+#             */
/*   Updated: 2025/07/04 00:36:24 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { HOTP, Secret } from "otpauth";

type FastifyOTPOptions = NonNullable<ConstructorParameters<typeof HOTP>[0]>;

const fastifyOtp: FastifyPluginCallback<FastifyOTPOptions> = (
  fastify,
  options,
  next,
) => {
  if (!options.secret) {
    options.secret = new Secret({ size: 32 });
  }

  const hotp = new HOTP(options);

  fastify.decorate("hotp", hotp);
  fastify.decorateRequest("hotpValidate", hotp.validate.bind(hotp));
  fastify.decorateReply("htopGenerate", hotp.generate.bind(hotp));

  next();
};
const FastifyOTPPlugin = fp(fastifyOtp, {
  fastify: "5.x",
  name: "fastify-otp",
});

export default fp(
  async (scope) => {
    scope.register(FastifyOTPPlugin, {
      issuer: "PAKE-Man",
      secret: Secret.fromHex(process.env.PAKE_MAN_OTP_SECRET!),
    } as FastifyOTPOptions);
  },
  { name: "otp" },
);

declare module "fastify" {
  interface FastifyInstance {
    hotp: HOTP;
  }

  interface FastifyRequest {
    hotpValidate: HOTP["validate"];
  }

  interface FastifyReply {
    htopGenerate: HOTP["generate"];
  }
}
