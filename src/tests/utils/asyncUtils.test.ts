import { delay, retry, asyncBatchMap } from '../../utils/asyncUtils';

describe('Асинхронные утилиты', () => {
  describe('delay', () => {
    test('должен создавать задержку на указанное время', async () => {
      const start = Date.now();
      await delay(100);
      const elapsed = Date.now() - start;
      
      expect(elapsed).toBeGreaterThanOrEqual(90);
    });
  });
  
  describe('retry', () => {
    test('должен вернуть результат при успешном выполнении', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      
      const result = await retry(mockFn, {
        retries: 3,
        retryInterval: 10
      });
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
    
    test('должен пытаться снова при ошибке', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');
      
      const onRetry = jest.fn();
      
      const result = await retry(mockFn, {
        retries: 3,
        retryInterval: 10,
        onRetry
      });
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(onRetry).toHaveBeenCalledTimes(2);
    });
    
    test('должен выбросить последнюю ошибку после всех попыток', async () => {
      const error = new Error('test error');
      const mockFn = jest.fn().mockRejectedValue(error);
      
      await expect(retry(mockFn, {
        retries: 2,
        retryInterval: 10
      })).rejects.toThrow('test error');
      
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
  
  describe('asyncBatchMap', () => {
    test('должен обрабатывать элементы пакетами указанного размера', async () => {
      const timestamps: number[] = [];
      const processingTimes: number[] = [];
      
      const mockAsyncFn = jest.fn().mockImplementation(async (item: number) => {
        const startTime = Date.now();
        timestamps.push(startTime);
        
        await delay(50);
        
        const endTime = Date.now();
        processingTimes.push(endTime - startTime);
        return item * 2;
      });
      
      const items = [1, 2, 3, 4, 5, 6, 7];
      const results = await asyncBatchMap(items, mockAsyncFn, 2);
      
      expect(results).toEqual([2, 4, 6, 8, 10, 12, 14]);
      expect(mockAsyncFn).toHaveBeenCalledTimes(7);
      
      const timeDiffs: number[] = [];
      for (let i = 1; i < timestamps.length; i++) {
        timeDiffs.push(timestamps[i] - timestamps[i-1]);
      }
      
      const batchBoundaries = [2, 4, 6];
      const boundaryIndices = timeDiffs
        .map((_, index) => index)
        .filter(index => batchBoundaries.includes(index + 1));
        
      const nonBoundaryIndices = timeDiffs
        .map((_, index) => index)
        .filter(index => !batchBoundaries.includes(index + 1));
        
      boundaryIndices.forEach(index => {
        expect(timeDiffs[index]).toBeGreaterThanOrEqual(40);
      });
      
      nonBoundaryIndices.forEach(index => {
        expect(timeDiffs[index]).toBeLessThan(20);
      });
    });
    
    test('должен обрабатывать пустой массив', async () => {
      const mockFn = jest.fn();
      const result = await asyncBatchMap([], mockFn);
      
      expect(result).toEqual([]);
      expect(mockFn).not.toHaveBeenCalled();
    });
  });
});