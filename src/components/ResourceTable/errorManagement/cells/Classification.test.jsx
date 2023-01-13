
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import Classification from './Classification';
import { renderWithProviders } from '../../../../test/test-utils';

jest.mock('../../../icons/AutoRetryIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/AutoRetryIcon'),
  default: () => (
    <div>MockAutoRetryIcon</div>
  ),
}));
describe('uI test cases for classification', () => {
  test('should display next auto retry with time when classification is set to intermittent', async () => {
    const error = {
      classification: 'Intermittent',
      retryAt: '2022-10-28T06:12:37.155Z',
    };

    renderWithProviders(<Classification
      error={error} isResolved={false} />);
    expect(screen.getByText('Intermittent')).toBeInTheDocument();
    const buttonRef = screen.getByText('MockAutoRetryIcon');

    userEvent.hover(buttonRef);

    await waitFor(() => {
      const tooltipRef = screen.getByRole('tooltip');

      expect(tooltipRef).toBeInTheDocument();
    });
    expect(screen.getByText('Next Auto-retry:')).toBeInTheDocument();
  });
  test('should display the classfication text when classification is set to other text other than intermittent', () => {
    const error = {
      classification: 'Connection',
      retryAt: '2022-10-28T06:12:37.155Z',
    };

    renderWithProviders(<Classification
      error={error} isResolved={false} />);
    expect(screen.getByText('Connection')).toBeInTheDocument();
  });
});
