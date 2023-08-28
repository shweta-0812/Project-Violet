import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import compress from "@fastify/compress";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { myContextFunction } from "./context";
import typeDefs from "./type-defs";
import resolvers from "./resolvers";
const fastify = await Fastify();
const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [fastifyApolloDrainPlugin(fastify)],
});
await apollo.start();
await fastify.register(rateLimit);
await fastify.register(helmet);
await fastify.register(cors);
await fastify.register(compress);
await fastify.register(fastifyApollo(apollo), {
    context: myContextFunction,
});
await fastify.listen({
    port: 8080,
});
