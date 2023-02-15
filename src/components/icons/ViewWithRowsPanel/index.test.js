
import React from 'react';
import ViewResolvedHistoryIcon from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders} from '../../../test/test-utils';

async function initViewResolvedHistoryIcon({ props = {}} = {}) {
  const ui = (
    <ViewResolvedHistoryIcon
      {...props}
    />
  );

  return renderWithProviders(ui);
}

describe('viewResolvedHistoryIcon component Test cases', () => {
  runServer();

  test('should pass the intial render no props', async () => {
    const { utils } = await initViewResolvedHistoryIcon();

    expect(utils.container).not.toBeEmptyDOMElement();
  });
});
