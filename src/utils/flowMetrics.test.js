/* global describe, test, expect beforeAll afterAll jest */
import moment from 'moment';
import momenttz from 'moment-timezone';
import addDays from 'date-fns/addDays';
import * as d3 from 'd3';

const {
  isDate,
  getSelectedRange,
  getLineColor,
  getDateTimeFormat,
  getAxisLabel,
  getLabel,
  getLegend,
  getTicks,
  getRoundedDate,
} = require('./flowMetrics');

describe('flowMetrics util function test', () => {
  let dateNowSpy;
  let momentSpy;
  const mockDate = new Date('2020-06-05T00:00:00.000Z');

  beforeAll(() => {
  // Lock Time
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => +mockDate);
    momentSpy = jest.spyOn(momenttz.tz, 'guess').mockImplementation(() => 'GMT');
  });

  afterAll(() => {
  // Unlock Time
    dateNowSpy.mockRestore();
    momentSpy.mockRestore();
  });
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

  describe('getRoundedDate function test', () => {
    test('should not throw exception for bad params', () => {
      expect(() => getRoundedDate(null, 1, true)).not.toThrow();
      expect(() => getRoundedDate()).not.toThrow();
    });
    test('should return correct result for getRoundedDate', () => {
      const testDate = new Date('2020-06-05T11:33:15.111Z');

      expect(getRoundedDate(testDate, 1, true).toISOString()).toEqual('2020-06-05T11:33:00.000Z');
      expect(getRoundedDate(testDate, 1, false).toISOString()).toEqual('2020-06-05T11:34:00.000Z');
    });
  });

  describe('getDateTimeFormat function test', () => {
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
        result: '01/03/2021 GMT',
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

  describe('getTicks function test', () => {
    test('should not throw exception for bad params', () => {
      expect(getTicks()).toEqual([]);
      expect(getTicks(null)).toEqual([]);
      expect(getTicks([])).toEqual([]);
      expect(getTicks(123)).toEqual([]);
    });

    test('should return correct format for range', () => {
      const testCases = [
        {
          range: {
            startDate: '2020-06-04T09:08:26.883Z',
            endDate: '2020-06-04T09:00:26.883Z',
          },
          isValue: true,
          result: [
            1591261680000,
            1591261620000,
            1591261560000,
            1591261500000,
            1591261440000,
            1591261380000,
            1591261320000,
            1591261260000,
          ],
        },
        {
          range: {
            startDate: '2020-06-04T09:08:26.883Z',
            endDate: '2020-06-04T09:00:26.883Z',
          },
          isValue: false,
          result: [
            1591261500000,
          ],
        },
        {
          range: {
            startDate: '2020-06-04T09:08:26.883Z',
            endDate: '2020-06-04T07:07:26.883Z',
          },
          isValue: true,
          result: [
            1591261680000,
            1591261620000,
            1591261560000,
            1591261500000,
            1591261440000,
            1591261380000,
            1591261320000,
            1591261260000,
            1591261200000,
            1591261140000,
            1591261080000,
            1591261020000,
            1591260960000,
            1591260900000,
            1591260840000,
            1591260780000,
            1591260720000,
            1591260660000,
            1591260600000,
            1591260540000,
            1591260480000,
            1591260420000,
            1591260360000,
            1591260300000,
            1591260240000,
            1591260180000,
            1591260120000,
            1591260060000,
            1591260000000,
            1591259940000,
            1591259880000,
            1591259820000,
            1591259760000,
            1591259700000,
            1591259640000,
            1591259580000,
            1591259520000,
            1591259460000,
            1591259400000,
            1591259340000,
            1591259280000,
            1591259220000,
            1591259160000,
            1591259100000,
            1591259040000,
            1591258980000,
            1591258920000,
            1591258860000,
            1591258800000,
            1591258740000,
            1591258680000,
            1591258620000,
            1591258560000,
            1591258500000,
            1591258440000,
            1591258380000,
            1591258320000,
            1591258260000,
            1591258200000,
            1591258140000,
            1591258080000,
            1591258020000,
            1591257960000,
            1591257900000,
            1591257840000,
            1591257780000,
            1591257720000,
            1591257660000,
            1591257600000,
            1591257540000,
            1591257480000,
            1591257420000,
            1591257360000,
            1591257300000,
            1591257240000,
            1591257180000,
            1591257120000,
            1591257060000,
            1591257000000,
            1591256940000,
            1591256880000,
            1591256820000,
            1591256760000,
            1591256700000,
            1591256640000,
            1591256580000,
            1591256520000,
            1591256460000,
            1591256400000,
            1591256340000,
            1591256280000,
            1591256220000,
            1591256160000,
            1591256100000,
            1591256040000,
            1591255980000,
            1591255920000,
            1591255860000,
            1591255800000,
            1591255740000,
            1591255680000,
            1591255620000,
            1591255560000,
            1591255500000,
            1591255440000,
            1591255380000,
            1591255320000,
            1591255260000,
            1591255200000,
            1591255140000,
            1591255080000,
            1591255020000,
            1591254960000,
            1591254900000,
            1591254840000,
            1591254780000,
            1591254720000,
            1591254660000,
            1591254600000,
            1591254540000,
            1591254480000,
          ],
        },
        {
          range: {
            startDate: '2020-06-04T09:08:26.883Z',
            endDate: '2020-06-04T07:07:26.883Z',
          },
          isValue: false,
          result: [
            1591261500000,
            1591261200000,
            1591260900000,
            1591260600000,
            1591260300000,
            1591260000000,
            1591259700000,
            1591259400000,
            1591259100000,
            1591258800000,
            1591258500000,
            1591258200000,
            1591257900000,
            1591257600000,
            1591257300000,
            1591257000000,
            1591256700000,
            1591256400000,
            1591256100000,
            1591255800000,
            1591255500000,
            1591255200000,
            1591254900000,
            1591254600000,
          ],
        },
        {
          range: {
            startDate: '2020-05-20T09:08:26.883Z',
            endDate: '2020-05-20T02:00:26.883Z',
          },
          isValue: true,
          result: [
            1589963400000,
            1589959800000,
            1589956200000,
            1589952600000,
            1589949000000,
            1589945400000,
            1589941800000,
          ],
        },
        {
          range: {
            startDate: '2020-05-20T09:08:26.883Z',
            endDate: '2020-05-20T02:00:26.883Z',
          },
          isValue: false,
          result: [
            1589963400000,
            1589959800000,
            1589956200000,
            1589952600000,
            1589949000000,
            1589945400000,
            1589941800000,
          ],
        },
        {
          range: {
            startDate: '2020-05-10T09:08:26.883Z',
            endDate: '2020-05-20T02:00:26.883Z',
          },
          isValue: true,
          result: [
            1589135400000,
            1589221800000,
            1589308200000,
            1589394600000,
            1589481000000,
            1589567400000,
            1589653800000,
            1589740200000,
            1589826600000,
            1589913000000,
          ],
        },
        {
          range: {
            startDate: '2020-05-10T09:08:26.883Z',
            endDate: '2020-05-20T02:00:26.883Z',
          },
          isValue: false,
          result: [
            1589135400000,
            1589221800000,
            1589308200000,
            1589394600000,
            1589481000000,
            1589567400000,
            1589653800000,
            1589740200000,
            1589826600000,
            1589913000000,
          ],
        },
        {
          range: {
            startDate: '2020-01-01T09:08:26.883Z',
            endDate: '2020-05-05T02:00:26.883Z',
          },
          isValue: true,
          result: [
            1580495400000,
            1583001000000,
            1585679400000,
            1588271400000,
          ],
        },
        {
          range: {
            startDate: '2020-01-01T09:08:26.883Z',
            endDate: '2020-05-05T02:00:26.883Z',
          },
          isValue: false,
          result: [
            1580495400000,
            1583001000000,
            1585679400000,
            1588271400000,
          ],
        },
      ];

      testCases.forEach(test => {
        const domainRange = d3.scaleTime().domain([new Date(test.range.startDate), new Date(test.range.endDate)]);

        expect(getTicks(domainRange, test.range, test.isValue)).toEqual(test.result);
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

  describe('getLegend function test', () => {
    const expectedShapes = [
      'line',
      'square',
      'circle',
      'cross',
      'diamond',
      'star',
      'triangle',
      'wye',
      'rect',
      'plainline',
    ];

    test('should return appropriate shape for getLegend', () => {
      expect(getLegend(1)).toEqual(expectedShapes[1]);
      expect(getLegend(-1)).toBeUndefined();
      for (let i = 0; i < 100; i += 1) {
        expect(getLegend(i)).toEqual(expectedShapes[i % 10]);
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
    describe('getSelectedRange all preset test cases', () => {
      test('getSelectedRange last15minutes test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'last15minutes',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-06-04T23:45:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
      });
      test('getSelectedRange last30minutes test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'last30minutes',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-06-04T23:30:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
      });

      test('getSelectedRange last1hour test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'last1hour',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-06-04T23:00:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
      });

      test('getSelectedRange last4hours test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'last4hours',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-06-04T20:00:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
      });

      test('getSelectedRange last24hours test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'last24hours',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-06-04T00:00:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
      });

      test('getSelectedRange today test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'today',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-06-04T18:30:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
      });

      test('getSelectedRange yesterday test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'yesterday',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-06-03T18:30:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-04T18:29:59.999Z');
      });

      test('getSelectedRange last7days test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'last7days',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-05-29T18:30:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
      });

      test('getSelectedRange last15days test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'last15days',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-05-21T18:30:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
      });

      test('getSelectedRange last30days test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'last30days',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-05-06T18:30:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
      });

      test('getSelectedRange last3months test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'last3months',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-03-04T18:30:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
      });

      test('getSelectedRange last6months test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'last6months',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2019-12-04T18:30:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
      });

      test('getSelectedRange last9months test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'last9months',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2019-09-04T18:30:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
      });

      test('getSelectedRange lastyear test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'lastyear',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2019-06-04T18:30:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
      });

      test('getSelectedRange after14days test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'after14days',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-06-18T18:29:59.999Z');
      });

      test('getSelectedRange after30days test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'after30days',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-07-04T18:29:59.999Z');
      });

      test('getSelectedRange after6months test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'after6months',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
        expect(endDate.toISOString()).toEqual('2020-12-05T18:29:59.999Z');
      });

      test('getSelectedRange after1year test', () => {
        const testRange = {
          startDate: new Date(),
          endDate: new Date(),
          preset: 'after1year',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2020-06-05T00:00:00.000Z');
        expect(endDate.toISOString()).toEqual('2021-06-05T18:29:59.999Z');
      });

      test('getSelectedRange lastrun test', () => {
        const testRange = {
          startDate: new Date('2011-11-07T00:00:00.000Z'),
          endDate: new Date('2011-11-11T00:00:00.000Z'),
          preset: 'lastrun',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2011-11-07T00:00:00.000Z');
        expect(endDate.toISOString()).toEqual('2011-11-11T00:00:00.000Z');
      });

      test('getSelectedRange custom test', () => {
        const testRange = {
          startDate: new Date('2011-11-07T00:00:00.000Z'),
          endDate: new Date('2011-11-11T00:00:00.000Z'),
          preset: 'custom',
        };

        const {startDate, endDate} = getSelectedRange(testRange);

        expect(startDate.toISOString()).toEqual('2011-11-07T00:00:00.000Z');
        expect(endDate.toISOString()).toEqual('2011-11-11T00:00:00.000Z');
      });
    });
  });

  describe('getAxisLabel function test', () => {
    test('should return appropriate color for getLineColor', () => {
      const data = {
        success: '# of Successes',
        error: '# of Errors',
        ignored: '# of Ignores',
        resolved: '# of Resolved',
        averageTimeTaken: 'Average processing time (ms)',
        anyInvalidKey: 'Average processing time (ms)',
      };

      Object.keys(data).forEach(k => {
        expect(getAxisLabel(k)).toEqual(data[k]);
      });
    });
  });

  describe('getLabel function test', () => {
    test('should return appropriate color for getLineColor', () => {
      const data = {
        success: 'Flow: Success',
        error: 'Flow: Errors',
        ignored: 'Flow: Ignored',
        resolved: 'Flow: Resolved',
        averageTimeTaken: 'Average processing time/success record',
        anyInvalidKey: 'Average processing time/success record',
      };

      Object.keys(data).forEach(k => {
        expect(getLabel(k)).toEqual(data[k]);
      });
    });
  });
});
