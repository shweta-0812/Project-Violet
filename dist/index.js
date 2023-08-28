import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import compress from "@fastify/compress";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import mongodb from "@fastify/mongodb";
import Fastify from "fastify";
import { myContextFunction } from "./context.js";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";
import fenv from "@fastify/env";
const fastify = await Fastify();
const schema = {
    type: 'object',
    required: ['PORT', 'MONGODB_URL'],
    properties: {
        PORT: {
            type: 'string',
            default: 3000
        },
        MONGODB_URL: {
            type: 'string'
        }
    }
};
const options = {
    confKey: 'config',
    schema: schema,
    dotenv: true // load .env if it is there, default: false
    // data: data,
};
const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        fastifyApolloDrainPlugin(fastify),
    ],
});
await fastify.register(fenv, options);
await fastify.register(mongodb, {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
    url: fastify.config.MONGODB_URL
});
await apollo.start();
await fastify.register(rateLimit);
await fastify.register(helmet, 
// Example disables the `contentSecurityPolicy` middleware but keeps the rest.
{ contentSecurityPolicy: false });
await fastify.register(cors);
await fastify.register(compress);
await fastify.register(fastifyApollo(apollo), {
    context: myContextFunction(fastify),
});
// await fastify.register((fastify, options) => {
//     fastify.register(
//         fastifyApollo(apollo), {
//             context: myContextFunction,
//         }
//     )
// })
//sample req
// fastify.get('/user/:id', function (req, reply) {
//     // Or this.mongo.client.db('mydb').collection('users')
//     const users = this.mongo.db.collection('users')
//
//     // if the id is an ObjectId format, you need to create a new ObjectId
//     const id = this.mongo.ObjectId(req.params.id)
//     users.findOne({ id }, (err, user) => {
//         if (err) {
//             reply.send(err)
//             return
//         }
//         reply.send(user)
//     })
// })
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server is now listening on ${address}`);
});
