import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HelpContentLinks from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

function initHelpContentLinks({ props = {} } = {}) {
  const ui = (
    <MemoryRouter>
      <HelpContentLinks {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('HelpContentLinks component', () => {
  runServer();
  test('should pass the initial render without any props', async () => {
    const { utils } = await initHelpContentLinks();

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with contentId and helpContent feature is enable', async () => {
    await initHelpContentLinks({ props: { contentId: 'profile'}});

    const documentLink = screen.getAllByRole('link').find(eachLink => eachLink.getAttribute('data-test') === 'helpVideoLink');

    expect(documentLink).toBeInTheDocument();
  });

  test('should pass the initial render with contentId and helpContent feature is disable', async () => {
    global.ENABLE_HELP_CONTENT = 'false';
    const { utils } = await initHelpContentLinks({ props: { contentId: 'profile'}});

    expect(utils.container).toBeEmptyDOMElement();
  });
});
