'use client';

import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import type { BinanceTickerData, BinanceTradeData } from '@/types/binance';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';
const RECONNECT_DELAY = 5000;

export const useBinanceWebSocket = (streams: string[]) => {
  const updateTicker = useDashboardStore((s) => s.updateTicker);
  const addTrade = useDashboardStore((s) => s.addTrade);
  const addChartPoint = useDashboardStore((s) => s.addChartPoint);

  const streamsRef = useRef(streams);
  const updateTickerRef = useRef(updateTicker);
  const addTradeRef = useRef(addTrade);
  const addChartPointRef = useRef(addChartPoint);

  const lastTickerTimeBySymbol = useRef<Record<string, number>>({});
  const THROTTLE_MS = 500;

  useEffect(() => {
    streamsRef.current = streams;
    updateTickerRef.current = updateTicker;
    addTradeRef.current = addTrade;
    addChartPointRef.current = addChartPoint;
  });

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let intentionalClose = false;

    const unsubscribe = (socket: WebSocket, params: string[]) => {
      if (socket.readyState === WebSocket.OPEN && params.length > 0) {
        socket.send(
          JSON.stringify({
            method: 'UNSUBSCRIBE',
            params,
            id: 1,
          }),
        );
      }
    };

    const connect = () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }

      intentionalClose = false;

      const socket = new WebSocket(BINANCE_WS_URL);
      ws = socket;

      socket.onopen = () => {
        const currentStreams = streamsRef.current;
        if (currentStreams.length > 0) {
          socket.send(
            JSON.stringify({
              method: 'SUBSCRIBE',
              params: currentStreams,
              id: 1,
            }),
          );
        }
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.result !== undefined) return;

          if (message.e === '24hrTicker') {
            const symbol = message.s;
            const now = Date.now();
            const lastTime = lastTickerTimeBySymbol.current[symbol] || 0;

            if (now - lastTime >= THROTTLE_MS) {
              const ticker: BinanceTickerData = {
                event: message.e,
                eventTime: message.E,
                symbol,
                priceChange: message.p,
                priceChangePercent: message.P,
                lastPrice: message.c,
              };
              updateTickerRef.current(ticker);

              if (ticker.symbol === useDashboardStore.getState().selectedSymbol) {
                addChartPointRef.current(ticker.lastPrice);
              }

              lastTickerTimeBySymbol.current[symbol] = now;
            }
          } else if (message.e === 'trade') {
            const trade: BinanceTradeData = {
              event: message.e,
              eventTime: message.E,
              symbol: message.s,
              tradeId: message.t,
              price: message.p,
              quantity: message.q,
              buyerOrderId: message.b,
              time: message.T,
              isBuyer: !message.m,
            };
            const amount = parseFloat(trade.price) * parseFloat(trade.quantity);

            if (amount >= 10) {
              addTradeRef.current(trade);
            }
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message', error);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error', error);
      };

      socket.onclose = () => {
        if (intentionalClose) return;

        console.log('WebSocket disconnected, trying to reconnect in', RECONNECT_DELAY);
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY);
      };
    };

    connect();

    return () => {
      intentionalClose = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      if (ws) {
        unsubscribe(ws, streamsRef.current);
        ws.onerror = null;
        ws.close();
        ws = null;
      }
    };
  }, [streams]);
};
