import {ApolloServer} from "@apollo/server";
import fastifyApollo, {fastifyApolloDrainPlugin, fastifyApolloHandler} from "@as-integrations/fastify";
import Fastify from "fastify";

import compress from "@fastify/compress";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import mongodb from "@fastify/mongodb";
import fenv from "@fastify/env";

import { Octokit } from "octokit";

import {MyContext, myContextFunction} from "./context.js";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";


const fastify = await Fastify();

const envSchema = {
    type: 'object',
    required: [ 'PORT', 'MONGODB_URL' ],
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
        }
    }
}

const envOptions = {
    confKey: 'config',
    schema: envSchema,
    dotenv: true // load .env if it is there, default: false
    // data: data,
}

await fastify.register(fenv, envOptions)

await fastify.register(mongodb, {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
    url: fastify.config.MONGODB_URL
})

const apollo = new ApolloServer<MyContext>({
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
    { contentSecurityPolicy: false }
)
await fastify.register(cors);
await fastify.register(compress);
const octokit = new Octokit({
    auth: fastify.config.GITHUB_PERSONAL_TOKEN,
});

await fastify.register(fastifyApollo(apollo), {
    context: myContextFunction(fastify),
});

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

type GithubLoginData ={
    viewer: object;
    login: string;
}

const githubData: GithubLoginData = await octokit.graphql(`{
  viewer {
    login
  }
}`);

console.log(githubData)

fastify.listen({ port: 3000 }, function (err,address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    console.log(`Server is now listening on ${address}`)
});

