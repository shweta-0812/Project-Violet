const typeDefs = `
	type PullRequest {
	    title: String
	    author : Int
	}
		
	type Query {
		helloWorld: String!
		pullRequests: [PullRequest]
	}
	
	input  PullRequestInput {
	  	title: String
	    author : Int
	}
	
	type Mutation {
	    createPullRequest(pullRequestData: PullRequestInput): PullRequest 
	}
	
`;

export default typeDefs;