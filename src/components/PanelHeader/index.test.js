/* global describe, test, expect, */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import PanelHeader from '.';

describe('Panel header UI tests', () => {
  test('initial render', async () => {
    const props = {
      title: 'Panel Header',
      infoText: 'Information about the header',
    };

    renderWithProviders(<MemoryRouter><PanelHeader {...props} /></MemoryRouter>);
    expect(screen.queryByText(/Panel Header/i)).not.toBeNull();
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    userEvent.click(button);
    await (() => expect(screen.queryByText(/Information about the header/i, {exact: false})).not.toBeNull());
    screen.debug();
  });
  test('initial render', async () => {
    const props = {
      title: 'Panel Header',
    };

    renderWithProviders(<MemoryRouter><PanelHeader {...props} /></MemoryRouter>);
    expect(screen.queryByText(/Panel Header/i)).not.toBeNull();
    expect(screen.queryByText(/Information about the header/i)).toBeNull();

    expect(screen.queryByRole('button')).toBeNull();
  });
  test('Nothing should be rendered for null props', () => {
    const {utils} = renderWithProviders(<MemoryRouter><PanelHeader /></MemoryRouter>);

    screen.debug();
    expect(utils.container).toContainHTML('');
  });
});
