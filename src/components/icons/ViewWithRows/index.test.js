
import React from 'react';
import ViewWithRows from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders} from '../../../test/test-utils';

async function initViewWithRows({ props = {}} = {}) {
  const ui = (
    <ViewWithRows
      {...props}
    />
  );

  return renderWithProviders(ui);
}

describe('viewWithRows component Test cases', () => {
  runServer();

  test('should pass the intial render no props', async () => {
    const { utils } = await initViewWithRows();

    expect(utils.container).not.toBeEmptyDOMElement();
  });
});
