'use client';

interface ChartErrorFallbackProps {
  error: Error;
  reset: () => void;
}

export default function ChartErrorFallback({ error, reset }: Readonly<ChartErrorFallbackProps>) {
  return (
    <div className='text-center p-8'>
      <p className='text-red-500 mb-4'>Charts failed to load: {error.message}</p>
      <button
        onClick={reset}
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
        Retry Charts
      </button>
    </div>
  );
}
