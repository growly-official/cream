import { Button, Modal, TooltipContainer } from '../../atoms';

import { useEffect, useMemo, useState } from 'react';
import { ButtonProps } from '@radix-ui/themes';
import { makeid, selectState, useNativeMagic, useNativeMagicContext } from '@/core';
import { Badge } from '../../../eliza/components/badge';

type Props = {
  token?: any;
  tooltipContent: string;
  children: React.ReactNode;
  walletAddress?: string;
  reviewFrequency?: string;
  riskLevel?: string;
  investmentObjective?: string;
  buttonProps?: ButtonProps;
};

const DiscoverProtocolButton = ({ children, token, tooltipContent, buttonProps }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const {
    query: { fetchProtocolData },
  } = useNativeMagic();
  const { nativeProtocolData } = useNativeMagicContext();

  const data = useMemo(() => selectState(nativeProtocolData), [nativeProtocolData]);

  useEffect(() => {
    fetchProtocolData();
  }, []);

  return (
    <TooltipContainer
      tooltipId={`${token?.chainId || makeid(3)}-${token?.name || makeid(3)}-Protocol-Discover`}
      tooltipContent={tooltipContent}>
      <Button
        {...buttonProps}
        onClick={() => {
          setOpen(true);
        }}
        size={'2'}
        color="teal">
        {children}
      </Button>
      <Modal open={open} handleOpen={open => setOpen(open)}>
        <div className="flex gap-3 overflow-scroll max-h-[800px] flex-col">
          <h1 className="text-2xl font-bold mb-5">Protocol Statistics</h1>
          <div className="flex gap-5">
            <div className="font-bold">Angles</div>
            <Badge>Sonic: {data?.anglesMarketData.s.toLocaleString()}</Badge>
            <Badge>USD: {data?.anglesMarketData.usd.toLocaleString()}</Badge>
            <Badge>APY: {data?.anglesMarketData.apy.toFixed(2)}</Badge>
            <Badge>APY (7 days): {data?.anglesMarketData.apy7.toFixed(2)}</Badge>
            <Badge>APY (30 days): {data?.anglesMarketData.apy30.toFixed(2)}</Badge>
          </div>
          <div className="flex gap-5">
            <div className="font-bold">Metropolis</div>
            <Badge>
              Liquidity USD:{' '}
              {selectState(
                nativeProtocolData
              )?.metropolisProtocolStatistics.liquidityUSD.toLocaleString()}
            </Badge>
            <Badge>
              Total Volumn USD:{' '}
              {selectState(
                nativeProtocolData
              )?.metropolisProtocolStatistics.totalVolumeUSD.toLocaleString()}
            </Badge>
            <Badge>
              Transactions:{' '}
              {selectState(
                nativeProtocolData
              )?.metropolisProtocolStatistics.txCount.toLocaleString()}
            </Badge>
          </div>
          <div className="flex gap-5">
            <div className="font-bold">Shadow</div>
            <Badge>Total Supply: {data?.shadowStatistics.shadowTotalSupply.toLocaleString()}</Badge>
            <Badge>xShadow Staked: {data?.shadowStatistics.xShadowStaked.toLocaleString()}</Badge>
            <Badge>
              Shadow Circulating USD:{' '}
              {selectState(
                nativeProtocolData
              )?.shadowStatistics.shadowCirculatingUSD.toLocaleString()}
            </Badge>
            <Badge>
              Shadow Circulating USD:{' '}
              {selectState(
                nativeProtocolData
              )?.shadowStatistics.shadowCirculatingUSD.toLocaleString()}
            </Badge>
          </div>
          <br />
          <h1 className="text-2xl font-bold mb-5">DeFi Activities</h1>
          <div className="flex flex-col gap-4">
            {[
              data?.beetsPools.map(pool => ({
                protocolName: 'Beets',
                name: pool.name,
                color: 'bg-orange-300',
                symbol: pool.symbol,
                liquidity: pool.dynamicData.totalLiquidity,
                volumn: pool.dynamicData.volume24h,
              })),
              data?.metropolisPools.map(pool => ({
                protocolName: 'Metropolis',
                name: pool.name,
                color: 'bg-teal-300',
                symbol: `${pool.tokenX.symbol}-${pool.tokenY.symbol}`,
                liquidity: pool.liquidityUSD,
                volumn: pool.volumeUSD,
              })),
            ]
              .flat()
              .sort((pA, pB) => pA?.name.localeCompare(pB?.name || '') || 0)
              .map(pool => (
                <div>
                  <div className="flex hover:bg-gray-200 cursor-pointer rounded-xl py-1 px-2 gap-3">
                    <Badge className={pool?.color}>{pool?.protocolName}</Badge>
                    <h1>{pool?.name}</h1>
                    <Badge>{pool?.symbol}</Badge>
                    <Badge>Total Liquidity: {pool?.liquidity}</Badge>
                    <Badge>Volumn 24h: {pool?.volumn}</Badge>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Modal>
    </TooltipContainer>
  );
};

export default DiscoverProtocolButton;
