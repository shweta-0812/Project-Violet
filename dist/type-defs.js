const typeDefs = `
	type PullRequest {
	    title: String
	    author : Int
	}
	
	type Query {
		helloWorld: String!
		pullRequest: [PullRequest]
	}
`;
export default typeDefs;
