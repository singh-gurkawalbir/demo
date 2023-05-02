import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HelpDocumentationLink from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

function initHelpDocumentationLink({ props = {}} = {}) {
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

  test('should pass the initial render with contentId and helpContent feature is enable', async () => {
    await initHelpDocumentationLink({ props: { contentId: 'profile'}});

    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  test('should pass the initial render with contentId and helpContent feature is disable', async () => {
    global.ENABLE_HELP_CONTENT = 'false';
    const { utils } = await initHelpDocumentationLink({ props: { contentId: 'profile'}});

    expect(utils.container).toBeEmptyDOMElement();
  });
});
