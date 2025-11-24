export interface MarketData {
  symbol: string;
  price: string;
  changePercent: number;
}

export interface WebSocketMessage {
  type: 'marketData';
  data: MarketData[];
}

