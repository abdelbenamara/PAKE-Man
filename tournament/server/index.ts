import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = Fastify({ logger: true });

server.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/',
});

server.listen({ port: 5174, host: '0.0.0.0' }, err => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
});
