import { ApolloDriver } from '@nestjs/apollo';
import { GqlModuleAsyncOptions } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import * as path from 'path';

export const gqlModuleAsyncOptions: GqlModuleAsyncOptions = {
  driver: ApolloDriver,
  useFactory: async () => ({
    autoSchemaFile: path.join(process.cwd(), './schema.gql'),
    driver: ApolloDriver,
    playground: false,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credenials: true,
      allowedHeaders: 'Content-Type, Accept',
    },
  }),
};
