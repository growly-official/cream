import { TAddress } from 'chainsmith-sdk/types';

type LocalStorageCacheKey = [string, number];

const HOUR = 1000 * 60 * 60;

export const INVESTMENT_OBJECTIVES = (addressInput: TAddress | undefined): LocalStorageCacheKey => [
  `${addressInput}.investmentObjectives`,
  HOUR * 24 * 10,
];

export const MULTICHAIN_TOKEN_PORTFOLIO = (
  addressInput: TAddress | undefined
): LocalStorageCacheKey => [`${addressInput}.multichainTokenPortfolio`, HOUR * 5];

export const SELECTED_NETWORKS = (addressInput: TAddress | undefined): LocalStorageCacheKey => [
  `${addressInput}.selectedNetworks`,
  HOUR * 24 * 10,
];
