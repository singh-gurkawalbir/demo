export default function (date, tzString) {
  if (!date) {
    return;
  }

  return new Date((typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {timeZone: tzString}));
}
