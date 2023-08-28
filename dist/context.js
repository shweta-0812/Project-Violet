// @ts-ignore
export const myContextFunction = (fastify) => {
    return async (request, response) => ({
        greeting: "Hello World!!",
        mongo: fastify.mongo
    });
};
