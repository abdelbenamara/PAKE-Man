/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   oauth2.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/17 10:56:21 by abenamar          #+#    #+#             */
/*   Updated: 2025/06/19 23:08:17 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import FastifyOauth2Plugin, { FastifyOAuth2Options } from "@fastify/oauth2";
import fp from "fastify-plugin";

export default fp(
  async (scope) => {
    const googleOAuth2Options = {
      name: "google",
      scope: ["openid", "profile", "email"],
      credentials: {
        client: {
          id: process.env.PAKE_MAN_OAUTH2_GOOGLE_CLIENT_ID!,
          secret: process.env.PAKE_MAN_OAUTH2_GOOGLE_CLIENT_SECRET!,
        },
      },
      callbackUri: process.env.PAKE_MAN_OAUTH2_GOOGLE_CALLBACK_URI!,
      callbackUriParams: {
        access_type: "offline",
        include_granted_scopes: true,
      },
      startRedirectPath: "/api/auth/google",
      schema: {
        tags: ["auth"],
      },
      cookie: {
        path: "/api/auth/google",
        signed: false,
      },
      userAgent: "@pake-man/backend",
      discovery: {
        issuer: "https://accounts.google.com",
      },
      redirectStateCookieName: "__Secure-google-oauth2-redirect-state",
      verifierCookieName: "__Secure-google-oauth2-code-verifier",
    } as FastifyOAuth2Options;

    scope
      .register(FastifyOauth2Plugin, googleOAuth2Options)
      .register(FastifyOauth2Plugin, {
        ...googleOAuth2Options,
        name: "googleV1",
        startRedirectPath: "/api/v1/auth/google",
        cookie: {
          path: "/api/v1/auth/google",
          signed: false,
        },
      } as FastifyOAuth2Options);
  },
  { name: "oauth2", dependencies: ["cookie", "swagger"] },
);
