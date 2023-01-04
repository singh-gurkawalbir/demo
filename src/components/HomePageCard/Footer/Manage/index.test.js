
import React from 'react';
import { screen } from '@testing-library/react';
import Manage from '.';
import {renderWithProviders} from '../../../../test/test-utils';

const values = 'test';

describe('footer manage', () => {
  test('should render the same text passed into children prop', async () => {
    renderWithProviders(<Manage>{values}</Manage>);
    const value = screen.getByText(values);

    expect(value).toBeInTheDocument();
  });
});

