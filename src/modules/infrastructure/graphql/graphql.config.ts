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
      origin: true,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials',
      ],
    },
  }),
};
