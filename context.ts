import { ApolloFastifyContextFunction } from "@as-integrations/fastify";

export interface MyContext {
    greeting: string;
    mongo: any
}

// @ts-ignore
export const myContextFunction =  (fastify) => {
    return async (request, response) => ({
        greeting: "Hello World!!",
        mongo: fastify.mongo
    })
}