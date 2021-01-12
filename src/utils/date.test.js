/* global describe, test, expect beforeAll afterAll jest */
import momenttz from 'moment-timezone';

const { convertUtcToTimezone} = require('./date');

describe('date util function test', () => {
  describe('convertUtcToTimezone function test', () => {
    const testDate = new Date('2018-12-24T10:33:30.000+05:30');

    test('should not throw exception for bad params', () => {
      expect(convertUtcToTimezone('fasdf')).toEqual('Invalid date');
      expect(convertUtcToTimezone(123)).toEqual('Invalid date');
      expect(convertUtcToTimezone()).toEqual('Invalid date');
      expect(convertUtcToTimezone(null)).toEqual('Invalid date');
      expect(convertUtcToTimezone(null, null)).toEqual('Invalid date');
      expect(convertUtcToTimezone(testDate, '')).toEqual(' 10:33:30 am');
      expect(convertUtcToTimezone(testDate, '', '')).toEqual(' ');
    });

    test('should return correct time for convertUtctoTimezone in expected date and time formats', () => {
      expect(convertUtcToTimezone(testDate, 'MM/DD/YY', 'hh:mm')).toEqual('12/24/18 10:33');
      expect(convertUtcToTimezone(testDate, 'MM/DD/YYYY', 'hh:mm')).toEqual('12/24/2018 10:33');
      expect(convertUtcToTimezone(testDate, 'MM/DD/YY', 'HH:mm')).toEqual('12/24/18 10:33');
      expect(convertUtcToTimezone(testDate, 'MM/DD/YY', 'hh:mm:ss')).toEqual('12/24/18 10:33:30');
      expect(convertUtcToTimezone(testDate, 'MM/DD/YY', 'hh:mm:ss a')).toEqual('12/24/18 10:33:30 am');
      expect(convertUtcToTimezone(testDate, 'MM/DD/YY', 'hh:mm:ss A')).toEqual('12/24/18 10:33:30 AM');
    });

    test('should return in default time and date formats when formats not passed in params', () => {
      expect(convertUtcToTimezone(testDate)).toEqual('12/24/2018 10:33:30 am');
    });

    test('should return in correct timezone when timezone is passed in params', () => {
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Asia/Riyadh')).toEqual('12/24/2018 8:03:30 am');
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Asia/Baku')).toEqual('12/24/2018 9:03:30 am');
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Asia/Tokyo')).toEqual('12/24/2018 2:03:30 pm');
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Pacific/Auckland')).toEqual('12/24/2018 6:03:30 pm');
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Africa/Johannesburg')).toEqual('12/24/2018 7:03:30 am');
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'America/Santiago')).toEqual('12/24/2018 2:03:30 am');
    });

    test('should return in correct timezone when timezone is passed in params and date only when dateOnly is set to true and false', () => {
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Asia/Riyadh', true)).toEqual('12/24/2018');
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Asia/Baku', false)).toEqual('12/24/2018 9:03:30 am');
    });

    describe('', () => {
      let momentSpy;

      beforeAll(() => {
        // Lock timezone
        momentSpy = jest.spyOn(momenttz.tz, 'guess').mockImplementation(() => 'GMT');
      });

      afterAll(() => {
        // Unlock Timezone
        momentSpy.mockRestore();
      });
      test('should return in system timezone when timezone not passed in params', () => {
        expect(convertUtcToTimezone(testDate, undefined, undefined)).toEqual('12/24/2018 5:03:30 am');
      });
    });
  });
});
