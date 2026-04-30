import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { memo, useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '../ui/card';

interface TickerCardProps {
  symbol: string;
  data?: {
    lastPrice: string;
    priceChangePercent: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

const TickerCardComponent = ({ symbol, data, isSelected, onClick }: TickerCardProps) => {
  const prevPriceRef = useRef<string | undefined>(undefined);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (!data) return;
    const currentPrice = parseFloat(data.lastPrice);
    const prevPriceRaw = prevPriceRef.current;
    if (prevPriceRaw) {
      const previousPrice = parseFloat(prevPriceRaw);
      if (currentPrice > previousPrice) setDirection('up');
      else if (currentPrice < previousPrice) setDirection('down');
    }
    prevPriceRef.current = data.lastPrice;
  }, [data]);

  const isPositive =
    direction !== null ? direction === 'up' : parseFloat(data?.priceChangePercent ?? '0') >= 0;

  if (!data) {
    return (
      <Card
        className={cn(
          'bg-[#16181c] border-[#2a2d33] rounded-xl shadow-sm cursor-pointer',
          isSelected && 'bg-[#1e2128] shadow-lg shadow-black/20',
        )}
        onClick={onClick}
      >
        <CardContent className="p-5 flex flex-col items-center gap-2">
          <div className="text-xs font-medium uppercase tracking-wider text-[#7a8194]">
            {symbol.replace('USDT', '/USDT')}
          </div>
          <div className="animate-pulse h-5 w-20 bg-[#2a2d33] rounded mt-1" />
        </CardContent>
      </Card>
    );
  }

  const formattedPrice = parseFloat(data.lastPrice).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const changePercent = parseFloat(data.priceChangePercent).toFixed(2);

  return (
    <motion.div whileHover={{ translateY: -2 }}>
      <Card
        className={cn(
          'relative bg-[#1a1d23] border-[#2b3139] rounded-xl shadow-sm cursor-pointer overflow-hidden',
          isSelected && 'bg-[#1e2128] shadow-lg shadow-black/20',
          direction === 'up' && 'bg-emerald-500/5!',
          direction === 'down' && 'bg-red-500/5!',
        )}
        onClick={onClick}
      >
        {isSelected && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-0.75 rounded-b-full bg-[#3772ff]" />
        )}
        <CardContent className="p-2 flex flex-col items-center">
          <div className="text-xs font-medium uppercase tracking-wider text-[#7a8194] mb-1">
            {symbol.replace('USDT', '/USDT')}
          </div>
          <motion.div
            key={data.lastPrice}
            initial={{ scale: 1.02 }}
            animate={{ scale: 1 }}
            className={cn(
              'text-2xl font-semibold tracking-tight',
              isPositive ? 'text-[#2dd4bf]' : 'text-[#f87171]',
            )}
          >
            {formattedPrice}
          </motion.div>
          <div
            className={cn(
              'flex items-center gap-1 mt-1 text-sm font-medium',
              isPositive ? 'text-[#2dd4bf]' : 'text-[#f87171]',
            )}
          >
            <motion.span
              animate={{ rotate: isPositive ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              ▼
            </motion.span>
            {changePercent}%
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const TickerCard = memo(
  TickerCardComponent,
  (prev, next) =>
    prev.symbol === next.symbol &&
    prev.isSelected === next.isSelected &&
    prev.data?.lastPrice === next.data?.lastPrice &&
    prev.data?.priceChangePercent === next.data?.priceChangePercent,
);
