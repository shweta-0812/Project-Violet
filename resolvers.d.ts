import { MyContext } from "./context";
declare const resolvers: {
    Query: {
        helloWorld: (parent: any, args: any, context: MyContext, info: any) => string;
    };
};
export default resolvers;
