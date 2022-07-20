/* global expect, describe, test */

import { buildDrawerUrl, drawerPaths } from '.';

describe('buildDrawerUrl testcases', () => {
  const baseUrl = 'http://localhost.io:4000/integrations';

  test('should give expected drawer URL for the passed props', () => {
    const drawerPath = drawerPaths.ERROR_MANAGEMENT.V2.JOB_ERROR_DETAILS;
    const params = {
      resourceId: 'e1',
      flowJobId: 'f1',
      errorType: 'open',
    };
    const expectedUrl = `${baseUrl}/errors/e1/filter/f1/open`;

    expect(buildDrawerUrl({
      path: drawerPath,
      baseUrl,
      params,
    })).toBe(expectedUrl);
  });
});
