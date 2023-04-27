
import { screen } from '@testing-library/react';
import React from 'react';
import HeaderWithHelpText from '.';
import { renderWithProviders } from '../../../../../test/test-utils';

jest.mock('../../../../../components/Help', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/Help'),
  default: () => <div>Testing Helptext</div>,
}));
describe('Test suite for HeaderWithHelpText', () => {
  test('should render the title and help text', () => {
    renderWithProviders(
      <HeaderWithHelpText title="Test Title" helpKey="test" >
        test children
      </HeaderWithHelpText>
    );
    expect(screen.getByText(/test children/i)).toBeInTheDocument();
    expect(screen.getByText(/testing helptext/i)).toBeInTheDocument();
  });
});
