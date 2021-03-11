/* global describe, test, expect */
import getFetchLogsPath from '.';

describe('Script logs saga Utils', () => {
  describe('getFetchLogsPath util', () => {
    test('should return correct fetchLogPath', () => {
      const mockTime = new Date();
      const testCases = [
        {
          input: {
            fetchNextPage: true,
            nextPageURL: '/api/nextPageUrl1',
          },
          result: '/nextPageUrl1',
        },
        {
          input: {
            selectedResources: [{type: 'flows', id: 'f1'}, {type: 'imports', id: 'i1'}],
            functionType: 'preMap',
            scriptId: 's1',
            dateRange: {
              startDate: mockTime,
              endDate: mockTime,
            },
          },
          result: `/scripts/s1/logs?time_gt=${mockTime.getTime()}&time_lte=${mockTime.getTime()}&_flowId=f1&_resourceId=i1&functionType=preMap`,
        },
      ];

      testCases.forEach(({input, result}) => {
        expect(getFetchLogsPath(input)).toEqual(result);
      });
    });
  });
});
