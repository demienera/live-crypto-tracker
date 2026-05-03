import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXAxis(tickItem: number) {
  return new Date(tickItem).toLocaleTimeString('ru-Ru', {
    minute: '2-digit',
    second: '2-digit',
  });
}
