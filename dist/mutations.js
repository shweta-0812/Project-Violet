const pullRequestData = [
    {
        "title": "Update index.html",
        "author": 10701255
    },
    {
        "title": "Edit index file",
        "author": 53709285
    }
];
const mutations = {
    Query: {
        pullRequests: async (parent, args, context, info) => {
            const { mongo } = context;
            // console.log(context)
            const pullRequests = mongo.db.collection('github_pullrequest');
            const pullRequest = await pullRequests.findOne();
            console.log(pullRequest);
            return pullRequestData;
        },
    },
};
export default mutations;
