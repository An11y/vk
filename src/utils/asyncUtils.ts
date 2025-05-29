export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retry = async <T>(
  fn: () => Promise<T>,
  options: {
    retries: number;
    retryInterval: number;
    onRetry?: (attempt: number, error: Error) => void;
  }
): Promise<T> => {
  const { retries, retryInterval, onRetry } = options;
  let lastError: Error;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }
      
      if (attempt < retries - 1) {
        await delay(retryInterval);
      }
    }
  }
  
  // eslint-disable-next-line no-throw-literal
  throw lastError!;
};

export const asyncBatchMap = async <T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  batchSize: number = 3
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((item, index) => fn(item, i + index))
    );
    results.push(...batchResults);
  }
  
  return results;
};