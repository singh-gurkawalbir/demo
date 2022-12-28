
import React from 'react';
import { screen } from '@testing-library/react';
import {renderWithProviders} from '../../test/test-utils';
import Spinner from '.';

describe('spinner UI tests', () => {
  test('should render without childern', () => {
    renderWithProviders(<Spinner />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should render with childern', () => {
    renderWithProviders(<Spinner>child</Spinner>);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
