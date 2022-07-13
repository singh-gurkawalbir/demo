/* global describe, test, expect, */
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import Help from '.';

describe('Help UI tests', () => {
  test('should render the help icon', () => {
    const props = {
      helpText: 'Sample help text',
      helpKey: 'connections',
    };

    renderWithProviders(<Help {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('should display the HelpContent arrowpopper when clicked on help icon', () => {
    const props = {
      helpText: 'Sample help text',
      helpKey: 'connections',
    };

    renderWithProviders(<Help {...props} />);
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Sample help text/i)).toBeInTheDocument();
  });
  test('should close the arrowpopper when clicked outside the arrowpopper', () => {
    const props = {
      helpText: 'Sample help text',
      helpKey: 'connections',
    };

    renderWithProviders(<div>exterior<Help {...props} /></div>);
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Sample help text/i)).toBeInTheDocument();
    userEvent.click(screen.getByText('exterior'));
    expect(screen.queryByText(/Sample help text/i)).toBeNull();
  });
  test('should not close arrowpopper when clicked on "NO" or User feedback field', () => {
    const props = {
      helpText: 'Sample help text',
      helpKey: 'connections',
    };

    renderWithProviders(<Help {...props} />);
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Sample help text/i)).toBeInTheDocument();
    userEvent.click(screen.getByText(/No/i));
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    const field = screen.getByPlaceholderText('Please let us know how we can improve the text area.');

    userEvent.click(field);
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });
  test('should point to the same link passed as href in the props', () => {
    const props = {
      helpText: "Check out our <a href='https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/360002670492'>Connector solutions articles</a>",
      helpKey: 'connections',
      escapeUnsecuredDomains: false,
    };

    renderWithProviders(<Help {...props} />);
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Connector solutions articles/i)).toHaveAttribute('href', 'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/360002670492');
  });
});
