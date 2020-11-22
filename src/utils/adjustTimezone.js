import moment from 'moment-timezone';

export default function (isoStringInput, zone) {
  // should parse it to the browser locale
  if (!isoStringInput || !moment(isoStringInput).isValid()) { return null; }
  const momentLocalObj = moment(isoStringInput).format();
  // last 4 digits and remove Z
  // this gives me microseconds fraction
  const microsecondFraction = isoStringInput.slice(-4, -1);
  // this give me the actual selected time without the offset
  const actualSelectedTime = momentLocalObj.slice(0, -6);
  // this date has no significance...im using it to just get the offset...which i can
  // manually concatenate to the timezone
  const timeZoneOffset = moment('2013-11-18').tz(zone).format('Z');
  const newTimezoneAdjustedFormat = `${actualSelectedTime}.${microsecondFraction}${timeZoneOffset}`;

  return moment(newTimezoneAdjustedFormat)?.toISOString();
}
