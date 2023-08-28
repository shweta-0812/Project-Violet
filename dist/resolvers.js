const resolvers = {
    Query: {
        helloWorld: (parent, args, context, info) => context.greeting,
        pullRequests: async (parent, args, context, info) => {
            const { mongo } = context;
            // console.log(context)
            const pullRequestCollection = mongo.db.collection('github_pullrequest');
            // console.log(pullRequests);
            return await pullRequestCollection.find().toArray();
        },
    },
    Mutation: {
        createPullRequest: async (parent, args, context, info) => {
            const { mongo } = context;
            const { pullRequestData } = args;
            const pullRequestCollection = mongo.db.collection('github_pullrequest');
            const insertResult = await pullRequestCollection.insertOne(pullRequestData);
            // console.log('Inserted documents =>', insertResult);
            return pullRequestData;
        }
    }
};
export default resolvers;
