/* global describe, expect, test */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import DynaLabelValueElement from './DynaLabelValueElement';

const url = 'https://api.localhost.io:4000/v1/as2';

describe('test suite for DynaLabelValueElement field', () => {
  test('should sanitize value if contains html', () => {
    const props = {
      label: 'AS2 URL',
      isLoggable: false,
      value: `Click <a href="${url}">here</a> to see the list of IP Addresses`,
    };

    renderWithProviders(<DynaLabelValueElement {...props} />);
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', url);
    expect(screen.queryByText(url)).not.toBeInTheDocument();
    expect(screen.getByText(props.label)).toBeInTheDocument();
  });

  test('should render the value as it is if does not contain any html tags', () => {
    const props = {
      label: 'AS2 URL',
      isLoggable: false,
      value: url,
    };

    renderWithProviders(<DynaLabelValueElement {...props} />);
    expect(screen.getByText(url)).toBeInTheDocument();
  });
});
