export interface ExchangeDto {
  id: string;
  name: string;
  rank: string;
  percentTotalVolume: string;
  volumeUsd: string;
  tradingPairs: string;
  socket: boolean;
  exchangeUrl: string;
  updated: number;
}
