import { useDashboardStore } from '@/store/dashboardStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const TradeTable = () => {
  const trades = useDashboardStore((state) => state.trades);

  if (trades.length === 0) {
    return (
      <Card className="bg-[#1a1d23] border-[#2b3139] rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-[#7a8194]">
            Recent Trades
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <Skeleton className="h-5 w-full bg-[#2b3139]" />
          <Skeleton className="h-5 w-full bg-[#2b3139]" />
          <Skeleton className="h-5 w-full bg-[#2b3139]" />
          <Skeleton className="h-5 w-full bg-[#2b3139]" />
          <Skeleton className="h-5 w-full bg-[#2b3139]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1a1d23] border-[#2b3139] rounded-xl shadow-sm overflow-hidden max-h-[450px] flex flex-col">
      <CardHeader className="pb-2 px-4 pt-4 shrink-0">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-[#7a8194]">
          Recent Trades
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto dark-scrollbar">
        <Table>
          <TableHeader className="sticky top-0 bg-[#1a1d23] z-10">
            <TableRow className="border-b border-[#2b3139] hover:bg-transparent">
              <TableHead className="text-xs font-medium uppercase tracking-wider text-[#7a8194] px-4 py-3">
                Price (USDT)
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-[#7a8194] px-4 py-3">
                Quantity
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-[#7a8194] px-4 py-3 text-right">
                Time
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow
                key={trade.tradeId}
                className={`border-b border-[#2b3139] transition-colors ${
                  trade.isBuyer
                    ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                    : 'bg-red-500/5 hover:bg-red-500/10'
                }`}
              >
                <TableCell
                  className={`px-4 py-3 text-sm font-mono ${
                    trade.isBuyer ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {parseFloat(trade.price).toFixed(2)}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-[#e4e7ed] font-mono">
                  {parseFloat(trade.quantity).toFixed(5)}
                </TableCell>
                <TableCell className="px-4 py-3 text-xs text-[#7a8194] text-right font-mono">
                  {new Date(trade.time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
