import { formatUnits, getContract } from 'viem';
import { stoi } from '../../utils/index.ts';
import { Abis } from '../../data/index.ts';
import type {
  TAddress,
  TBlockNumber,
  TClient,
  TContractToken,
  TContractTokenMetadata,
  TTokenListResponse,
} from '../../types/index.d.ts';
import { autoInjectable } from 'tsyringe';
import { Logger } from 'tslog';

const TOKEN_LIST_URLS = {
  // Multi-EVM (popular tokens only)
  uniswap: 'https://ipfs.io/ipns/tokens.uniswap.org', // TODO: Cannot access ipfs directly with axios
  superchain: 'https://static.optimism.io/optimism.tokenlist.json',
};

@autoInjectable()
export class EvmTokenPlugin {
  logger = new Logger({ name: 'EvmTokenPlugin' });

  getTokenMetadataList = async (chainId: number): Promise<TContractTokenMetadata[]> => {
    try {
      // Extracting all EVM token list URLs from the constants
      const evmTokenListURLs = Object.values(TOKEN_LIST_URLS);

      // Fetching all token lists simultaneously
      const promises = evmTokenListURLs.map(url => fetch(url));

      // Waiting for all fetch promises to resolve
      const responses = await Promise.all(promises);

      // Extracting JSON data from the responses
      const data: any[] = await Promise.all(responses.map(response => response.json()));

      // Flattening the tokens arrays from all responses into a single array
      const allTokens = data.flatMap((item: TTokenListResponse) => item.tokens);

      // Filtering tokens by the specified chainId and removing duplicates by address
      const distinctTokens = Array.from(
        new Map(
          allTokens.filter(t => t.chainId === chainId).map(token => [token.address, token])
        ).values()
      );

      return distinctTokens;
    } catch (error: any) {
      this.logger.error(`Failed to get token metadata list: ${error.message}`);
      return [];
    }
  };

  /// The batch size defines the payload size for `Multicall3` contract's `aggregate3` method.
  /// Increasing the batch size reduces the number of RPC calls.
  getBatchLatestTokens = async (
    client: TClient,
    tokenList: TContractTokenMetadata[],
    walletAddress: TAddress,
    config?: Partial<{
      blockNumber: TBlockNumber;
      batchSize: number;
    }>
  ): Promise<TContractToken[]> => {
    try {
      const results = await client.multicall({
        ...config,
        // @ts-ignore
        contracts: tokenList.map(token => ({
          abi: Abis.erc20ABI,
          functionName: 'balanceOf',
          args: [walletAddress],
          address: token.address as TAddress,
        })),
      });

      let tokenIndx = 0;
      const tokenBalanceList: TContractToken[] = [];
      for (const callResult of results) {
        const token = tokenList[tokenIndx];
        if (callResult.status === 'success' && stoi(callResult.result) > 0) {
          const formattedBalance = formatUnits(BigInt(callResult.result || 0), token.decimals);
          tokenBalanceList.push({
            ...token,
            balance: parseFloat(formattedBalance),
          });
        }
        tokenIndx++;
      }
      return tokenBalanceList;
    } catch (error: any) {
      this.logger.error(`Failed to get batch tokens: ${error.message}`);
      return [];
    }
  };

  getTokenBalance = async (
    client: TClient,
    tokenAddress: TAddress,
    walletAddress: TAddress,
    blockNumber?: bigint
  ): Promise<bigint> => {
    try {
      const data = await client.readContract({
        address: tokenAddress,
        abi: Abis.erc20ABI,
        functionName: 'balanceOf',
        args: [walletAddress],
        blockNumber,
      });
      return data;
    } catch (error: any) {
      this.logger.error(`Failed to get token balance: ${error.message}`);
      throw new Error(error);
    }
  };

  getTokenMetadataFromContract = async (
    client: TClient,
    tokenAddress: TAddress
  ): Promise<TContractTokenMetadata> => {
    try {
      const chainId = await client.getChainId();
      const contract: any = getContract({
        address: tokenAddress as TAddress,
        abi: Abis.erc20ABI,
        client: client as any,
      });

      const [name, decimals, symbol] = await Promise.all([
        contract.read.name(),
        contract.read.decimals(),
        contract.read.symbol(),
      ]);

      return {
        chainId,
        address: tokenAddress,
        name,
        symbol,
        decimals,
        type: 'contract',
      };
    } catch (error: any) {
      this.logger.error(`Failed to get token contract metadata: ${error.message}`);
      throw new Error(error);
    }
  };
}
