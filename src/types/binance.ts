export interface BinanceTickerData {
  event: string;
  eventTime: number;
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
}

export interface BinanceTradeData {
  event: string;
  eventTime: number;
  symbol: string;
  tradeId: number;
  price: string;
  quantity: string;
  buyerOrderId: number;
  time: number;
  isBuyer: boolean;
}
