const resolvers = {
    Query: {
        helloWorld: (parent, args, context, info) => context.greeting,
    },
};
export default resolvers;
