import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import Fastify from "fastify";
import compress from "@fastify/compress";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import mongodb from "@fastify/mongodb";
import fenv from "@fastify/env";
import * as crypto from "crypto";
import { Octokit } from "octokit";
import { myContextFunction } from "./context.js";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";
const fastify = await Fastify();
const envSchema = {
    type: 'object',
    required: ['PORT', 'MONGODB_URL'],
    properties: {
        PORT: {
            type: 'string',
            default: 3000
        },
        MONGODB_URL: {
            type: 'string'
        },
        GITHUB_PERSONAL_TOKEN: {
            type: 'string'
        },
        GITHUB_WEBHOOK_SECRET_TOKEN: {
            type: 'string'
        }
    }
};
const envOptions = {
    confKey: 'config',
    schema: envSchema,
    dotenv: true // load .env if it is there, default: false
    // data: data,
};
await fastify.register(fenv, envOptions);
await fastify.register(mongodb, {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
    url: fastify.config.MONGODB_URL
});
const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        fastifyApolloDrainPlugin(fastify),
    ],
});
await apollo.start();
await fastify.register(rateLimit);
await fastify.register(helmet, 
// Example disables the `contentSecurityPolicy` middleware but keeps the rest.
{ contentSecurityPolicy: false });
await fastify.register(cors);
await fastify.register(compress);
const octokit = new Octokit({
    auth: fastify.config.GITHUB_PERSONAL_TOKEN,
});
await fastify.register(fastifyApollo(apollo), {
    context: myContextFunction(fastify),
});
const githubData = await octokit.graphql(`{
  viewer {
    login
  }
}`);
console.log(githubData);
// verify webhook signature for authentication
const GITHUB_WEBHOOK_SECRET_TOKEN = fastify.config.GITHUB_WEBHOOK_SECRET_TOKEN;
const verify_signature = (request) => {
    const signature = crypto
        .createHmac("sha256", GITHUB_WEBHOOK_SECRET_TOKEN)
        .update(JSON.stringify(request.body))
        .digest("hex");
    let trusted = Buffer.from(`sha256=${signature}`, 'ascii');
    let untrusted = Buffer.from(request.headers["x-hub-signature-256"], 'ascii');
    return crypto.timingSafeEqual(trusted, untrusted);
};
fastify.post('/payload', {}, (request, reply) => {
    if (!verify_signature(request)) {
        reply.status(401).send("Unauthorized");
        return;
    }
    console.log(":::::request verified::");
    // console.log(request.body)
    reply.send();
});
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server is now listening on ${address}`);
});
