'use client';

import { useMemo } from 'react';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';
import { useDashboardStore } from '@/store/dashboardStore';
import { TickerCard } from './TickerCard';
import { MiniChart } from './MiniChart';

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT'];

export default function Dashboard() {
  const selectedSymbol = useDashboardStore((state) => state.selectedSymbol);
  const setSelectedSymbol = useDashboardStore((state) => state.setSelectedSymbol);
  const tickers = useDashboardStore((state) => state.tickers);

  const streams = useMemo(() => {
    const tickerStreams = SYMBOLS.map((s) => `${s.toLowerCase()}@ticker`);
    return [...tickerStreams, `${selectedSymbol.toLowerCase()}@trade`];
  }, [selectedSymbol]);

  useBinanceWebSocket(streams);

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white p-6 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#e4e7ed]">Live Crypto Tracker</h1>
          <p className="text-[#7a8194] text-sm font-medium">
            Real‑time market data via Binance WebSocket
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {SYMBOLS.map((symbol) => (
            <TickerCard
              key={symbol}
              symbol={symbol}
              data={tickers[symbol]}
              isSelected={selectedSymbol === symbol}
              onClick={() => setSelectedSymbol(symbol)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <MiniChart symbol={selectedSymbol} />
          </div>
        </div>
      </div>
    </div>
  );
}
