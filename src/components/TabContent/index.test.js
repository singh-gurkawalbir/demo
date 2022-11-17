/* global describe, test, expect */
import { screen } from '@testing-library/react';
import React from 'react';
import TabContent from '.';
import { renderWithProviders } from '../../test/test-utils';

async function initTabContent({children = ''} = {}) {
  const ui = (
    <TabContent>
      {children}
    </TabContent>
  );

  return renderWithProviders(ui);
}

describe('Testsuite for Tab Content', () => {
  test('should able to render empty children', async () => {
    const { utils } = await initTabContent();

    expect(utils.container.firstChild).toBeEmptyDOMElement();
  });
  test('should able to render children of type number', async () => {
    await initTabContent({children: 123});
    expect(screen.getByText(/123/i)).toBeInTheDocument();
  });
  test('should able to render children of type string', async () => {
    await initTabContent({children: 'Test'});
    expect(screen.getByText(/Test/i)).toBeInTheDocument();
  });
});
