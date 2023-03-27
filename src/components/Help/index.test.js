
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import Help from '.';

describe('help wrapper UI tests', () => {
  test('should display the HelpContent arrowpopper when clicked on help icon', async () => {
    const props = {
      helpText: 'Sample help text',
      helpKey: 'connections',
    };

    renderWithProviders(<Help {...props} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Sample help text/i)).toBeInTheDocument();
  });
  test('should display the help text when helpKey is passed as prop', async () => {
    const props = {
      helpKey: 'afe.mappings.settings',
    };

    renderWithProviders(<Help {...props} />);
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() =>
      expect(screen.queryByText(/Define mappings for the destination field/i)).toBeInTheDocument()
    );
  });
});
