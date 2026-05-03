import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react';

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <Alert className="border-red-500/30 bg-red-500/5 backdrop-blur-sm rounded-xl shadow-md">
      <AlertCircle className="h-4 w-4 text-red-400" />
      <AlertTitle className="text-red-300 text-sm font-medium">Connection Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span className="text-red-200/80 text-sm">{message}</span>
        <button
          onClick={() => setHidden(true)}
          className="ml-2 text-xs text-red-400 hover:text-red-300 underline underline-offset-2"
        >
          Dismiss
        </button>
      </AlertDescription>
    </Alert>
  );
}
