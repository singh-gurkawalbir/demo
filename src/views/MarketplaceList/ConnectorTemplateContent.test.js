
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ConnectorTemplateContent from './ConnectorTemplateContent';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initConnectorTemplateContent({
  props = {
    resource: {
      name: '',
      applications: [],
    },
    application: '',
  },
} = {}) {
  const ui = (
    <MemoryRouter>
      <ConnectorTemplateContent {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('ConnectorTemplateContent test cases', () => {
  runServer();

  test('should pass the initial render with default value', async () => {
    await initConnectorTemplateContent();

    expect(screen.queryByText(/.../i)).toBeInTheDocument();
  });

  test('should pass the initial render with magento resource', async () => {
    await initConnectorTemplateContent({
      props: {
        resource: {
          name: 'Magento 1',
          applications: ['magento'],
          free: true,
        },
        application: 'magento',
      },
    });

    expect(screen.queryByText(/Magento 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Free/i)).toBeInTheDocument();
  });

  test('should pass the initial render with custom resource', async () => {
    await initConnectorTemplateContent({
      props: {
        resource: {
          name: 'Dummy 1',
          applications: ['magento', 'shopify'],
          free: true,
        },
        application: 'magento',
      },
    });

    expect(screen.queryByText(/Dummy 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Free/i)).toBeInTheDocument();
  });
});
