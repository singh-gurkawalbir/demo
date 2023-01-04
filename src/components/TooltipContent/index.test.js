
import React from 'react';
import {screen} from '@testing-library/react';
import {renderWithProviders} from '../../test/test-utils';
import ToolTipContent from '.';

describe('tooltipContent UI tests', () => {
  test('should display the content displayed in the props', () => {
    const props = {children: 'Sample tooltip content'};

    renderWithProviders(<ToolTipContent {...props} />);
    expect(screen.getByText(/Sample tooltip content/i)).toBeInTheDocument();
  });
  test('should point to the correct href attribute provided in the props', () => {
    const props = {children: "Check out our <a href='https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/360002670492'>Connector solutions articles</a>", escapeUnsecuredDomains: false};

    renderWithProviders(<ToolTipContent {...props} />);
    expect(screen.getByText(/Connector solutions articles/i)).toHaveAttribute('href', 'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/360002670492');
  });
});
