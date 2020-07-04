const CRASH = 'crash';

export default function reportCrash(error) {
  const err = error;
  const ts = new Date().getTime();
  const {href} = window.location;
  err.timestamp = ts;
  err.href = href;
  err.userAgent = navigator.userAgent;
  const key = `${CRASH}.${href}`;
  let lastCrashTs = localStorage.getItem(key);
  lastCrashTs = (Number.isNaN(lastCrashTs) || lastCrashTs < 0) ? 0 : +lastCrashTs;
  localStorage.setItem(key, ts);
  if (lastCrashTs + 6E4 < ts) {
    fetch('/ui/crashReport', {
      redirect: 'manual',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(err),
    })
      .catch(() => {
        // swallow the error
      });
  }
}
