import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from "@apollo/client";

const httpLink = new HttpLink({
    uri: "https://fullstack-engineer-test-n4ouilzfna-uc.a.run.app/graphql",
});

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([httpLink]),
});