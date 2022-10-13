/* global describe, test, expect, jest */
import { render, screen } from '@testing-library/react';
import React from 'react';
import HeaderWithHelpText from '.';

jest.mock('../../../../../components/Help', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/Help'),
  default: () => <div>Testing Helptext</div>,
}));
describe('Test suite for HeaderWithHelpText', () => {
  test('should render the title and help text', () => {
    render(
      <HeaderWithHelpText title="Test Title" helpKey="test" >
        test children
      </HeaderWithHelpText>
    );
    expect(screen.getByText(/test children/i)).toBeInTheDocument();
    expect(screen.getByText(/testing helptext/i)).toBeInTheDocument();
  });
});
