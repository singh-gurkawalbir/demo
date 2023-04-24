
import momenttz from 'moment-timezone';

const { convertUtcToTimezone, getNDaysBeforeDate } = require('./date');

describe('date util function test', () => {
  let momentSpy;

  beforeAll(() => {
    // Lock timezone
    momentSpy = jest.spyOn(momenttz.tz, 'guess').mockImplementation(() => 'GMT');
  });

  afterAll(() => {
    // Unlock Timezone
    momentSpy.mockRestore();
  });

  describe('convertUtcToTimezone function test', () => {
    const testDate = new Date('2018-12-24T10:33:30.000+05:30');

    test('should not throw exception for bad params', () => {
      expect(convertUtcToTimezone('fasdf')).toBe('Invalid date');
      expect(convertUtcToTimezone(123)).toBe('Invalid date');
      expect(convertUtcToTimezone()).toBe('Invalid date');
      expect(convertUtcToTimezone(null)).toBe('Invalid date');
      expect(convertUtcToTimezone(null, null)).toBe('Invalid date');
      expect(convertUtcToTimezone(testDate, '')).toBe(' 5:03:30 am');
      expect(convertUtcToTimezone(testDate, '', '')).toBe(' ');
    });

    test('should return correct time for convertUtctoTimezone in expected date and time formats', () => {
      expect(convertUtcToTimezone(testDate, 'MM/DD/YY', 'hh:mm')).toBe('12/24/18 05:03');
      expect(convertUtcToTimezone(testDate, 'MM/DD/YYYY', 'hh:mm')).toBe('12/24/2018 05:03');
      expect(convertUtcToTimezone(testDate, 'MM/DD/YY', 'HH:mm')).toBe('12/24/18 05:03');
      expect(convertUtcToTimezone(testDate, 'MM/DD/YY', 'hh:mm:ss')).toBe('12/24/18 05:03:30');
      expect(convertUtcToTimezone(testDate, 'MM/DD/YY', 'hh:mm:ss a')).toBe('12/24/18 05:03:30 am');
      expect(convertUtcToTimezone(testDate, 'MM/DD/YY', 'hh:mm:ss A')).toBe('12/24/18 05:03:30 AM');
    });

    test('should return in default time and date formats when formats not passed in params', () => {
      expect(convertUtcToTimezone(testDate)).toBe('12/24/2018 5:03:30 am');
    });

    test('should return in correct timezone when timezone is passed in params', () => {
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Asia/Riyadh')).toBe('12/24/2018 8:03:30 am');
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Asia/Baku')).toBe('12/24/2018 9:03:30 am');
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Asia/Tokyo')).toBe('12/24/2018 2:03:30 pm');
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Pacific/Auckland')).toBe('12/24/2018 6:03:30 pm');
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Africa/Johannesburg')).toBe('12/24/2018 7:03:30 am');
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'America/Santiago')).toBe('12/24/2018 2:03:30 am');
    });

    test('should return in correct timezone when timezone is passed in params and date only when dateOnly is set to true and false', () => {
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Asia/Riyadh', {dateOnly: true})).toBe('12/24/2018');
      expect(convertUtcToTimezone(testDate, undefined, undefined, 'Asia/Baku', {dateOnly: false})).toBe('12/24/2018 9:03:30 am');
    });

    test('should return in system timezone when timezone not passed in params', () => {
      expect(convertUtcToTimezone(testDate, undefined, undefined)).toBe('12/24/2018 5:03:30 am');
    });
  });

  describe('getNDaysBeforeDate test cases', () => {
    test('get 1 day before date', () => {
      jest.spyOn(Date.prototype, 'setDate').mockReturnValue(Date.now());
      jest.spyOn(Date.prototype, 'setDate').mockImplementation(num => num);
      jest.spyOn(Date.prototype, 'getDate').mockReturnValue(10);

      const date = getNDaysBeforeDate(1);

      expect(date).toEqual(new Date(new Date().setDate(new Date().getDate() - 1)));
    });
  });
});
