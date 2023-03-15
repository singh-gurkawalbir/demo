
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import HelpVideoLink from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

function initHelpVideoLink({props = {}} = {}) {
  const ui = (
    <MemoryRouter>
      <HelpVideoLink {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('HelpVideoLink component', () => {
  runServer();

  test('should pass the initial render without any props', async () => {
    const { utils } = await initHelpVideoLink();

    expect(utils.container).toBeEmptyDOMElement();
  });
});
