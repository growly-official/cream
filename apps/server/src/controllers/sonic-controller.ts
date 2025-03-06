import { autoInjectable, container } from 'tsyringe';
import { BaseController } from './base-controller';
import { Request, Response } from 'express';
import { SonicApiService } from '../services/sonic-service';
import { TAddress, TTokenPortfolio } from 'chainsmith-sdk/types';
import { initChainsmithSdk } from '../config';

@autoInjectable()
class SonicController extends BaseController {
  constructor(private readonly sonicService: SonicApiService) {
    super();
  }

  async getWalletTokenPortfolio(req: Request, res: Response) {
    const sdk = initChainsmithSdk(['sonic']);
    console.log(sdk);
    return this.structure<TTokenPortfolio>(
      req,
      res
    )(async (req: Request, _: Response) => {
      const { walletAddress } = req.body as {
        walletAddress: TAddress;
      };
      return this.sonicService.getSonicTokenPortfolio(walletAddress);
    });
  }
}

export const sonicController = container.resolve(SonicController);
