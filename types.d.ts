import fastify from "fastify";

declare module 'fastify' {
    interface FastifyInstance {
        config: { // this should be same as the confKey in options
            // specify your typing here
            PORT:  string,
            MONGODB_URL: string
            GITHUB_PERSONAL_TOKEN: string
            GITHUB_WEBHOOK_SECRET_TOKEN: string
        }
    }
}
