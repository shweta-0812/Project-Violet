import { ApolloFastifyContextFunction } from "@as-integrations/fastify";
export interface MyContext {
    greeting: string;
}
export declare const myContextFunction: ApolloFastifyContextFunction<MyContext>;
