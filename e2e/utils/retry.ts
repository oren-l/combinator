type RetryOptions = {
  maxRetries: number;
  delayMS: number;
};

export async function retry<T>(options: RetryOptions, operation: () => Promise<T>) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${attempt}/${options.maxRetries} failed: ${error.message}`);

      if (attempt < options.maxRetries) {
        console.log(`Waiting ${options.delayMS}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, options.delayMS));
      }
    }
  }

  throw lastError; // If all retries fail, throw the last error
}
