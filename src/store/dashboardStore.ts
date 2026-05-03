import { BinanceTickerData, BinanceTradeData } from '@/types/binance';
import { create } from 'zustand';

interface TickerInfo {
  lastPrice: string;
  priceChangePercent: string;
}

interface TradeInfo {
  id: number;
  price: string;
  quantity: string;
  time: number;
  isBayer: boolean;
}

interface ChartPoint {
  time: number;
  price: number;
}

interface DashboardState {
  tickers: Record<string, TickerInfo>;
  trades: TradeInfo[];
  selectedSymbol: string;
  chartData: ChartPoint[];
  addChartPoint: (price: string) => void;
  clearChartData: () => void;
  updateTicker: (data: BinanceTickerData) => void;
  addTrade: (data: BinanceTradeData) => void;
  setSelectedSymbol: (symbol: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  tickers: {},
  trades: [],
  selectedSymbol: 'BTCUSDT',
  chartData: [],
  addChartPoint: (price) =>
    set((state) => {
      const newPoint = { time: Date.now(), price: parseFloat(price) };
      const newData = [...state.chartData, newPoint].slice(-200);
      return { chartData: newData };
    }),
  clearChartData: () => set({ chartData: [] }),
  updateTicker: (data) =>
    set((state) => ({
      tickers: {
        ...state.tickers,
        [data.symbol]: { lastPrice: data.lastPrice, priceChangePercent: data.priceChangePercent },
      },
    })),
  addTrade: (data) =>
    set((state) => {
      if (data.symbol !== state.selectedSymbol) return state;

      const newTrade: TradeInfo = {
        id: data.tradeId,
        price: data.price,
        quantity: data.quantity,
        time: data.time,
        isBayer: data.buyerOrderId === data.tradeId,
      };

      const updateTrades = [newTrade, ...state.trades].slice(0, 50);
      return {
        trades: updateTrades,
      };
    }),
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol, trades: [], chartData: [] }),
}));
