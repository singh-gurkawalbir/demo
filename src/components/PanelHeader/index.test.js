/* global describe, test, expect, */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import PanelHeader from '.';

describe('Panel header UI tests', () => {
  test('should pass the initial render', async () => {
    const props = {
      title: 'Panel Header',
      infoText: 'Information about the header',
    };

    renderWithProviders(<PanelHeader {...props} />);
    expect(screen.queryByText(/Panel Header/i)).not.toBeNull();
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    userEvent.click(button);
    await (() => expect(screen.queryByText(/Information about the header/i, {exact: false})).not.toBeNull());
  });
  test('should render empty DOM for null props', () => {
    const {utils} = renderWithProviders(<PanelHeader />);

    expect(utils.container).toContainHTML('');
  });
});
