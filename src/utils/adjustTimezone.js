import moment from 'moment-timezone';
//
export default function (isoStringInput, zone) {
  if (!isoStringInput || !moment(isoStringInput).isValid()) { return null; }
  // should parse it to the browser locale
  const momentLocalObj = moment(isoStringInput).format();

  // example of a format 2013-11-22T19:55:00+05:30
  // last 4 digits and remove Z
  // this gives me microseconds fraction
  const microsecondFraction = isoStringInput.slice(-4, -1);
  // this give me the actual selected time without the offset
  const actualSelectedTime = momentLocalObj.slice(0, -6);

  // trying to compute offset for user selected input and manually concatenate it
  const timeZoneOffset = moment(actualSelectedTime).tz(zone).format('Z');
  const newTimezoneAdjustedFormat = `${actualSelectedTime}.${microsecondFraction}${timeZoneOffset}`;

  return moment(newTimezoneAdjustedFormat)?.toISOString();
}
