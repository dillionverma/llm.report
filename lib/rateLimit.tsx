type ApiFunction<T> = (...args: any[]) => Promise<T>;

let requestQueue: Array<() => void> = [];
let lastExecuted = Date.now();

const limiter = () => {
  if (requestQueue.length === 0) return;
  const now = Date.now();
  const timeSinceLast = now - lastExecuted;
  const rateLimitTime = (60 * 1000) / 5;

  if (timeSinceLast < rateLimitTime) {
    setTimeout(limiter, rateLimitTime - timeSinceLast);
  } else {
    const task = requestQueue.shift();
    if (task) task();
    lastExecuted = Date.now();
    setTimeout(limiter, rateLimitTime);
  }
};

export const rateLimitQuery = <T extends unknown>(
  apiFn: ApiFunction<T>,
  ...args: any[]
): Promise<T> => {
  return new Promise((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        const data = await apiFn(...args);
        resolve(data);
      } catch (error: any) {
        reject(error);
      }
    });
    limiter();
  });
};
