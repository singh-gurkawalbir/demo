import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryHistory} from 'history';
import CeligoPageBar from '.';
import {renderWithProviders} from '../../test/test-utils';

describe('Celigopagebar component', () => {
  test('check for the presense of title and subtitle', () => {
    renderWithProviders(<MemoryRouter><CeligoPageBar title="title" infoText="infotext" subtitle="subtitle" titleTag="titleTag" /></MemoryRouter>);

    const title = screen.getByText('title');
    const subtitle = screen.getByText('subtitle');

    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
  });

  test('Working of info icon buttton', () => {
    renderWithProviders(<MemoryRouter><CeligoPageBar title="title" infoText="infotext" subtitle="subtitle" /></MemoryRouter>);

    const infobutton = screen.getByRole('button', { haspopup: true});

    screen.debug();
    let infotext = screen.queryByText('infotext');

    expect(infotext).not.toBeInTheDocument();

    userEvent.click(infobutton);
    infotext = screen.queryByText('infotext');
    expect(infotext).toBeInTheDocument();
  });

  test(' erfrf', () => {
    const history = createMemoryHistory();

    history.replace = jest.fn();
    renderWithProviders(<Router history={history}><CeligoPageBar title="title" subtitle="subtitle" parentUrl="/" /></Router>);
    const parentbutton = screen.getByRole('button', { hidden: true});

    userEvent.click(parentbutton);
    expect(history.replace).toHaveBeenCalledWith('/');

    screen.debug();
  });

  test(' new', () => {
    const history = createMemoryHistory();

    history.goBack = jest.fn();
    history.length = 3;
    renderWithProviders(<Router history={history}><CeligoPageBar title="title" subtitle="subtitle" parentUrl="/" /></Router>);
    const parentbutton = screen.getByRole('button', { hidden: true});

    userEvent.click(parentbutton);
    expect(history.goBack).toHaveBeenCalledWith();

    screen.debug();
  });
});
