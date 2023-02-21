
import React from 'react';
import {screen} from '@testing-library/react';
import {renderWithProviders} from '../../test/test-utils';
import GridSelect from '.';

const props = {
  items: [{
    name: 'Shopify',
    id: '63d94c4d8ba47f5fa4c00001',
    description: 'Access and manipulate a store\'s data using traditional RESTful methods.',
  },
  {
    name: 'Shopify Graph QL',
    id: '63d94c4d8ba47f5fa4c00002',
    description: 'Access and manipulate a store\'s data using the GraphQL query language.',
  }],
  value: '63d94c4d8ba47f5fa4c00002',
  onClick: jest.fn(),
};

describe('GridSelect UI tests', () => {
  test('should render the Grid items initially', () => {
    renderWithProviders(<GridSelect {...props} />);
    expect(screen.getByText('Shopify')).toBeInTheDocument();
    expect(screen.getByText('Shopify Graph QL')).toBeInTheDocument();

    const radioIcons = screen.getAllByRole('radio');

    expect(radioIcons[1]).toHaveAttribute('checked');
  });
  test('should display none when items is []', () => {
    renderWithProviders(<GridSelect {...props} items={[]} />);
    expect(screen.queryByText('Shopify')).not.toBeInTheDocument();
  });
});
