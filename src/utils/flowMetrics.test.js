/* global describe, test, expect beforeAll afterAll jest */
import moment from 'moment';
import momenttz from 'moment-timezone';
import addDays from 'date-fns/addDays';

const {
  isDate,
  getSelectedRange,
  getLineColor,
  getDateTimeFormat,
} = require('./flowMetrics');

describe('flowMetrics util function test', () => {
  describe('isDate function test', () => {
    test('should return correct result for isDate', () => {
      expect(isDate('fasdf')).toEqual(false);
      expect(isDate(123)).toEqual(false);
      expect(isDate(new Date())).toEqual(true);
      expect(isDate(moment())).toEqual(false);
      expect(isDate(moment().toISOString())).toEqual(false);
      expect(isDate(moment().toDate())).toEqual(true);
    });
  });

  describe('getDateTimeFormat function test', () => {
    let dateNowSpy;
    let momentSpy;

    beforeAll(() => {
    // Lock Time
      dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => +new Date('2020-06-05'));
      momentSpy = jest.spyOn(momenttz.tz, 'guess').mockImplementation(() => 'GMT');
    });

    afterAll(() => {
    // Unlock Time
      dateNowSpy.mockRestore();
      momentSpy.mockRestore();
    });
    test('should not throw any exception for bad params', () => {
      expect(getDateTimeFormat()).toEqual('06/05/2020 12:00:00 am');
      expect(getDateTimeFormat(null)).toEqual('06/05/2020 12:00:00 am');
      expect(getDateTimeFormat(null, null, null, null)).toEqual('Invalid date');
      expect(getDateTimeFormat('string', 123, '123')).toEqual('01/01/1970 12:00:00 am');
    });

    test('should return correct formatted date for respective params', () => {
      const testCases = [{
        range: {
          startDate: '2021-01-03T09:08:26.883Z',
          endDate: '2021-01-01T09:08:26.883Z',
        },
        epochTime: 1609664979229,
        preferences: {dateFormat: 'MM/DD/YY', timeFormat: 'hh:mm'},
        timezone: 'Asia/Calcutta',
        result: '01/03/21 02:39',
      },
      {
        range: {
          startDate: '2021-01-03T09:08:26.883Z',
          endDate: '2021-01-01T09:08:26.883Z',
        },
        epochTime: 1609664979229,
        preferences: {dateFormat: 'DD/MM/YY', timeFormat: 'hh:mm'},
        timezone: 'Asia/Calcutta',
        result: '03/01/21 02:39',
      },
      {
        range: {
          startDate: '2021-01-03T09:08:26.883Z',
          endDate: '2021-01-01T09:08:26.883Z',
        },
        epochTime: 1609664979229,
        preferences: {dateFormat: 'MM/DD/YYYY', timeFormat: 'hh:mm'},
        timezone: 'Asia/Calcutta',
        result: '01/03/2021 02:39',
      },
      {
        range: {
          endDate: '2021-01-03T09:08:26.883Z',
          startDate: '2020-12-24T09:08:26.883Z',
        },
        epochTime: 1609664979229,
        preferences: {dateFormat: 'MM/DD/YYYY', timeFormat: 'hh:mm'},
        timezone: 'Asia/Calcutta',
        result: '01/03/2021',
      },
      {
        range: {
          endDate: '2021-01-03T09:08:26.883Z',
          startDate: '2020-02-24T09:08:26.883Z',
        },
        epochTime: 1609664979229,
        preferences: {dateFormat: 'MM/DD/YYYY', timeFormat: 'hh:mm'},
        timezone: 'Asia/Calcutta',
        result: 'January',
      },
      {
        range: {
          endDate: '2021-01-03T09:08:26.883Z',
          startDate: '2021-01-01T09:08:26.883Z',
        },
        epochTime: 1609664979229,
        preferences: {dateFormat: 'MM/DD/YYYY', timeFormat: 'HH:MM:ss'},
        timezone: 'Asia/Calcutta',
        result: '01/03/2021 14:01:39',
      },
      {
        range: {
          endDate: '2021-01-03T09:08:26.883Z',
          startDate: '2021-01-01T09:08:26.883Z',
        },
        epochTime: 1609664979229,
        preferences: {dateFormat: 'MM/DD/YYYY', timeFormat: 'HH:MM:ss'},
        result: '01/03/2021 09:01:39',
      }];

      testCases.forEach(test => {
        expect(getDateTimeFormat(test.range, test.epochTime, test.preferences, test.timezone)).toEqual(test.result);
      });
    });
  });

  describe('getLineColor function test', () => {
    const expectedColorSpectrum = [
      '#2B5B36',
      '#24448E',
      '#3A6CA1',
      '#549FC3',
      '#8FC4C6',
      '#AFCF8B',
      '#80B875',
      '#57A05C',
    ];

    test('should return appropriate color for getLineColor', () => {
      expect(getLineColor(1)).toEqual(expectedColorSpectrum[1]);
      expect(getLineColor(-1)).toBeUndefined();
      for (let i = 0; i < 100; i += 1) {
        expect(getLineColor(i)).toEqual(expectedColorSpectrum[i % 8]);
      }
    });
  });

  describe('getSelectedRange function test', () => {
    test('should not throw any exception for invalid inputs', () => {
      expect(getSelectedRange()).toEqual({});
      expect(getSelectedRange(null)).toEqual({});
      expect(getSelectedRange(1)).toEqual({});
      expect(getSelectedRange(new Date())).toEqual({});
      expect(getSelectedRange('1')).toEqual({});
      expect(getSelectedRange({})).toEqual({});
      expect(getSelectedRange([])).toEqual({});
    });
    test('should return correct value for getSelectedRange', () => {
      const testRange = {
        startDate: addDays(new Date(), -1),
        endDate: new Date(),
      };

      expect(getSelectedRange(testRange)).toEqual(testRange);
      expect(getSelectedRange({...testRange, preset: 'custom'})).toEqual({...testRange, preset: 'custom'});
      expect(getSelectedRange({...testRange, preset: 'anyInvalidPreset'})).toEqual({...testRange, preset: 'anyInvalidPreset'});
    });
    test('getSelectedRange Last 1 hour test', () => {

    });
  });
});
