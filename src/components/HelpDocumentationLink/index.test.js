
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import HelpDocumentationLink from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

function initHelpDocumentationLink({props = {}} = {}) {
  const ui = (
    <MemoryRouter>
      <HelpDocumentationLink {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('HelpDocumentationLink component', () => {
  runServer();

  test('should pass the initial render without any props', async () => {
    const { utils } = await initHelpDocumentationLink();

    expect(utils.container).toBeEmptyDOMElement();
  });
});
