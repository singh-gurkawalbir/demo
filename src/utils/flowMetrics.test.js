/* global describe, test, expect */
import moment from 'moment';
import addDays from 'date-fns/addDays';

const {
  isDate,
  getSelectedRange,
  getLineColor,
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
