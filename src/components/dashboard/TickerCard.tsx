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
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevPriceRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!data) return;

    const currentPrice = parseFloat(data.lastPrice);
    const prevPriceRaw = prevPriceRef.current;

    if (prevPriceRaw) {
      const previousPrice = parseFloat(prevPriceRaw);
      if (currentPrice > previousPrice) {
        setFlash('up');
      } else if (currentPrice < previousPrice) {
        setFlash('down');
      }

      const timer = setTimeout(() => {
        setFlash(null);
      }, 500);
      return () => clearTimeout(timer);
    }
    prevPriceRef.current = data.lastPrice;
  }, [data]);

  if (!data) {
    return (
      <Card className={cn('cursor-pointer', isSelected && 'ring-2 ring-primary')} onClick={onClick}>
        <CardContent className={'p-4 flex flex-col items-center gap-2'}>
          <div className="font-semibold">{symbol.replace('USDT', '/USDT')}</div>
          <div className="animate-pulse h-6 w-20 bg-muted rounded mt-2" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = parseFloat(data.priceChangePercent) >= 0;
  const formattedPrice = parseFloat(data.lastPrice).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const changePercent = parseFloat(data.priceChangePercent).toFixed(2);

  return (
    <motion.div
      animate={
        flash === 'up'
          ? { backgroundColor: ['#22c55e20', '#00000000'] }
          : flash === 'down'
            ? { backgroundColor: ['#ef444430', '#00000000'] }
            : {}
      }
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          'cursor-pointer transition-all hover:shadow-md',
          isSelected && 'ring-2 ring-primary',
        )}
        onClick={onClick}
      >
        <CardContent className={'p-4 flex flex-col items-center'}>
          <div className="font-semibold text-lg">{symbol.replace('USDT', '/USDT')}</div>
          <div
            className={`text-2xl font-bold mt-1 ${isPositive ? 'text-green-600' : 'text-red-500'}`}
          >
            {formattedPrice}
          </div>
          <div
            className={`flex items-center gap-1 mt-1 text-sm ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            <motion.span
              animate={{ rotate: isPositive ? 0 : 180 }}
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
