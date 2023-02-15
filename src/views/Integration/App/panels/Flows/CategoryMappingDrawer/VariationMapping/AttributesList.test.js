
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders} from '../../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../../store';
import VariationAttributesList from './AttributesList';

describe('VariationAttributesList UI tests', () => {
  test('should test when some attribute is given', () => {
    const initialStore = getCreatedStore();

    initialStore.getState().session.integrationApps.settings['5ea16c600e2fab71928a6152-5ff579d745ceef7dcd797c15'] = {
      generatesMetadata: [{
        id: 'categoryId',
        variation_themes: [{id: 'variation_theme', variation_attributes: ['attribute']}],
      }]};
    renderWithProviders(
      <MemoryRouter>
        <VariationAttributesList
          integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152"
          categoryId="categoryId"
         />
      </MemoryRouter>,
      {initialStore});
    const attribute = screen.getByText('attribute');

    expect(attribute).toBeInTheDocument();

    expect(attribute).toHaveAttribute('href', '/attribute');
  });
  test('should test when no attribute is provided in store', () => {
    const {utils} = renderWithProviders(
      <MemoryRouter>
        <VariationAttributesList
          integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152"
          categoryId="categoryId"
         />
      </MemoryRouter>);

    expect(utils.container.textContent).toBe('');
  });
});
