import 'tsconfig-paths/register';

import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { AppModule } from './app.module';
import { isProduction } from './utils';
import { Wallets } from '../../../packages/core/src/data';
import { initializeSdk } from '../../../packages/core/src/sdk';
import { alchemy, buildEvmChains } from '../../../packages/core/src';
import * as Constants from './constants';
import { Adapters } from './config';

async function testing() {
  const chains = buildEvmChains(['base', 'mainnet'], alchemy(Constants.ALCHEMY_API_KEY));
  const sdk = initializeSdk(chains);

  // Set the memory storage for `walleAddress` key.
  sdk.storage.writeToRam('walletAddress', Wallets.ETH_MAINNET_WALLET_PCMINH);

  // Get multichain token portfolio.
  const multichainPortfolio = await sdk.portfolio.getMultichainTokenPortfolio(
    Adapters.CoinMarketcap
  )();

  console.log(multichainPortfolio);

  // TODO: Handle EVMScan
  // const multichainTokenActivities = await sdk.token.listTokenTransferActivities(Adapters.Evmscan)(
  //   'mainnet',
  //   wallet
  // );

  // console.log(multichainTokenActivities);
}
testing();

async function bootstrap() {
  const generalLogLevels: LogLevel[] = ['log', 'error'];
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_DEBUG === 'true' ? ['debug', ...generalLogLevels] : generalLogLevels,
  });

  app.enableCors({
    origin: '*',
  });
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use('/graphql', graphqlUploadExpress());

  const port = process.env.SERVER_PORT || 8080;
  // await app.listen(port);
  console.log(`DEBUG: ${!!process.env.NODE_DEBUG}`);
  console.log(`PRODUCTION: ${isProduction()}`);
  console.log(`Server is running at: http://localhost:${port}`);
}
bootstrap();
