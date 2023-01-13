
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import IntegrationTag from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';

async function initIntegrationTag({
  props = {},
} = {}) {
  const ui = (
    <MemoryRouter>
      <IntegrationTag {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('integrationTag test cases', () => {
  runServer();
  test('should pass the initial render with default values', async () => {
    await initIntegrationTag({
      props: {
        label: 'mock label',
        className: 'mock_class_name',
      },
    });
    const mockEle = screen.queryByText('mock label');

    expect(mockEle).toBeInTheDocument();
  });
});
