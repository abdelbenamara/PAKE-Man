/*
  TypeScript with fastify : https://fastify.dev/docs/latest/Reference/TypeScript/
 */
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import oauthPlugin from '@fastify/oauth2';
import * as dotenv from 'dotenv';

dotenv.config(); // env variables

class AuthServer {
  private app: FastifyInstance;

  constructor() {
    this.app = Fastify({ logger: { level: 'info' } });
    this.setupOAuth();
    this.setupRoutes();
  }


  private setupOAuth() {
    this.app.register(oauthPlugin, {
      name: 'googleOAuth2',
      scope: ['profile'],
      credentials: {
        client: {
          id: process.env.CLIENT_ID || '',
          secret: process.env.CLIENT_SECRET || '',
        },
        auth: oauthPlugin.GOOGLE_CONFIGURATION,
      },
      startRedirectPath: '/login/google',
      callbackUri: process.env.CALLBACK_URI || 'http://localhost:8080/login/google/callback',
    });
  }

  private setupRoutes() {
    this.app.get('/', this.handleHome);
    this.app.after(() => {
        this.app.get('/login/google/callback', this.handleGoogleCallback.bind(this));
      });
  }

  private async handleHome(_request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: 'Welcome to Fastify OAuth2 API!' });
  }

  private async handleGoogleCallback(request: FastifyRequest, reply: FastifyReply) {
    try {
    request.log.info("OAuth callback initiated...");

    const oauth2 = (request.server as any).googleOAuth2;

    if (!oauth2) {
        throw new Error("Google OAuth2 plugin is not registered correctly.");
    }

    const result = await oauth2.getAccessTokenFromAuthorizationCodeFlow(request);
    request.log.info("Access token received:", result.token);

    const userInfo = await this.fetchGoogleUserInfo(result.token.access_token);
    request.log.info("User info received:", userInfo);

    const formattedUser = {
        firstName: userInfo.given_name || '',
        lastName: userInfo.family_name || '',
        profilePicture: userInfo.picture || '',
    };

    return reply.send(formattedUser);
    } catch (error: any) {
    request.log.error("OAuth callback failed:", error);
    return reply.code(500).send({ error: "OAuth callback failed", details: error.message });
    }
  }

  private async fetchGoogleUserInfo(accessToken: string) {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) throw new Error(`Failed to fetch user info: ${response.statusText}`);
    return response.json();
  }

  public async start() {
    try {
      await this.app.listen({ port: 8080, host: '127.0.0.1' });
      console.log('Server running at http://localhost:8080');
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}

const server = new AuthServer();
server.start();
