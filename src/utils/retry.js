export default function retry(fn, retriesLeft = 5, interval = 100) {
  const rl = Math.min(10, Math.floor(Number.isNaN(+retriesLeft) ? 0 : +retriesLeft));

  return new Promise((resolve, reject) => {
    fn().then(resolve)
      .catch(error => {
        if (rl <= 1) {
          return reject(error);
        }
        setTimeout(() => {
          const newInterval = Math.max(1, Math.floor(interval * (1 + Math.random() * (Math.random() > 0.5 ? 1 : -1))));

          retry(fn, rl - 1, newInterval).then(resolve, reject);
        }, interval);
      });
  });
}
