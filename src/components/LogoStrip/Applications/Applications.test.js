
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../test/test-utils';
import Applications from '.';

describe('apllications UI tests', () => {
  test('should test when other appears in tooltip', async () => {
    renderWithProviders(<Applications applications={['shopify', 'docusign', 'salesforce', 'magento']} columns={1} />);
    const newimages = screen.getByAltText('docusign');

    userEvent.hover(newimages);
    await waitFor(() => expect(screen.queryByText('other')).toBeInTheDocument());
  });
  test('should test when name of app appears in tooltip', async () => {
    renderWithProviders(<Applications applications={['shopify', 'docusign', 'magento']} columns={1} />);
    const newimages = screen.getByAltText('shopify');

    userEvent.hover(newimages);
    await waitFor(() => expect(screen.queryByText('Shopify')).toBeInTheDocument());
  });
});
