import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HelpVideoLink from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

function initHelpVideoLink({initialStore, props = {}} = {}) {
  const ui = (
    <MemoryRouter>
      <HelpVideoLink {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('HelpVideoLink component', () => {
  runServer();
  test('should pass the initial render without any props', async () => {
    const { utils } = await initHelpVideoLink();

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with contentId and helpContent feature is enable', async () => {
    await initHelpVideoLink({ props: { contentId: 'profile'}});

    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  test('should pass the initial render with contentId and helpContent feature is disable', async () => {
    global.ENABLE_HELP_CONTENT = 'false';
    const { utils } = await initHelpVideoLink({ props: { contentId: 'profile'}});

    expect(utils.container).toBeEmptyDOMElement();
  });
});
