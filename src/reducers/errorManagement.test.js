/* global describe, expect, test */
import { selectors } from '.';

describe('Error Management region selector testcases', () => {
  describe('selectors.flowJobs test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowJobs()).toEqual([]);
    });
  });

  describe('selectors.flowDashboardJobs test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowDashboardJobs()).toEqual({data: [], status: undefined});
    });
  });

  describe('selectors.flowJob test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowJob(false)).toEqual();
    });
  });

  describe('selectors.job test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.job({}, {})).toEqual();
    });
  });

  describe('selectors.allJobs test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.allJobs({}, {})).toEqual();
    });
  });

  describe('selectors.flowJobConnections test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.flowJobConnections();

      expect(selector(undefined, {})).toEqual([]);
    });
  });

  describe('selectors.resourceError test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.resourceError({}, {})).toEqual();
    });
  });

  describe('selectors.selectedRetryIds test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.selectedRetryIds(undefined, {})).toEqual([]);
    });
  });

  describe('selectors.selectedErrorIds test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.selectedErrorIds({}, {})).toEqual([]);
    });
  });

  describe('selectors.isAllErrorsSelected test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isAllErrorsSelected({}, {})).toEqual(false);
    });
  });

  describe('selectors.isAnyErrorActionInProgress test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isAnyErrorActionInProgress({}, {})).toEqual(false);
    });
  });

  describe('selectors.errorDetails test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.errorDetails({}, {})).toEqual({});
    });
  });

  describe('selectors.makeResourceErrorsSelector test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.makeResourceErrorsSelector();

      expect(selector({}, {})).toEqual({errors: []});
    });
  });

  describe('selectors.integrationErrorsPerSection test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationErrorsPerSection()).toEqual({});
    });
  });

  describe('selectors.integrationErrorsPerStore test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationErrorsPerStore()).toEqual({});
    });
  });

  describe('selectors.getIntegrationUserNameById test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getIntegrationUserNameById()).toEqual();
    });
  });
});

