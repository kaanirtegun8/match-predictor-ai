/**
 * Splits an array into chunks of specified size.
 * @template T
 * @param {Array<T>} array The array to split
 * @param {number} size The size of each chunk
 * @return {Array<Array<T>>} Array of chunks
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Creates a delay promise.
 * @param {number} ms The number of milliseconds to delay
 * @return {Promise<void>} Promise that resolves after delay
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
