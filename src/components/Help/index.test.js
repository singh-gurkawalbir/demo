
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import Help from '.';

describe('help UI tests', () => {
  test('should render the help icon', () => {
    const props = {
      helpText: 'Sample help text',
      helpKey: 'connections',
    };

    renderWithProviders(<Help {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('should display the HelpContent arrowpopper when clicked on help icon', async () => {
    const props = {
      helpText: 'Sample help text',
      helpKey: 'connections',
    };

    renderWithProviders(<Help {...props} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Sample help text/i)).toBeInTheDocument();
  });
  test('should close the arrowpopper when clicked outside the arrowpopper', async () => {
    const props = {
      helpText: 'Sample help text',
      helpKey: 'connections',
    };

    renderWithProviders(<div>exterior<Help {...props} /></div>);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Sample help text/i)).toBeInTheDocument();
    await userEvent.click(screen.getByText('exterior'));
    expect(screen.queryByText(/Sample help text/i)).toBeNull();
  });
  test('should not close arrowpopper when clicked on "NO" or User feedback field', async () => {
    const props = {
      helpText: 'Sample help text',
      helpKey: 'connections',
    };

    renderWithProviders(<Help {...props} />);
    await userEvent.click(screen.getByRole('button'));
    const thumbsdown = document.querySelector('[data-test="noContentHelpful"]');

    expect(thumbsdown).toBeInTheDocument();
    await userEvent.click(thumbsdown);
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument());
    const field = screen.getByPlaceholderText('How can we make this information more helpful?');

    await userEvent.click(field);
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });
  test('should point to the same link passed as href in the props', async () => {
    const props = {
      helpText: "Check out our <a href='https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/360002670492'>Connector solutions articles</a>",
      helpKey: 'connections',
      escapeUnsecuredDomains: false,
    };

    renderWithProviders(<Help {...props} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Connector solutions articles/i)).toHaveAttribute('href', 'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/360002670492');
  });
});
