import axios from 'axios';
import { TAddress, TTokenPortfolio, TTokenTransferActivity } from 'chainsmith-sdk/types';
import { BACKEND_SERVER_URL } from '../../config';

export class SonicChainApiService {
  async getWalletTokenPortfolio(walletAddress: TAddress): Promise<TTokenPortfolio> {
    try {
      const response = await axios.post<TTokenPortfolio>(`${BACKEND_SERVER_URL}/sonic/portfolio`, {
        walletAddress,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async listTokenTransferActivities(walletAddress: TAddress): Promise<TTokenTransferActivity[]> {
    try {
      const response = await axios.post<TTokenTransferActivity[]>(
        `${BACKEND_SERVER_URL}/sonic/activity`,
        {
          walletAddress,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
