/* global describe, test, expect ,jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryHistory} from 'history';
import CeligoPageBar from '.';
import {renderWithProviders} from '../../test/test-utils';

describe('Celigopagebar UI tests', () => {
  function renderFunction() {
    renderWithProviders(
      <MemoryRouter>
        <CeligoPageBar title="title" infoText="infotext" subtitle="subtitle" titleTag="titleTag" />
      </MemoryRouter>);
  }
  test('should check for the presense of title and subtitle', () => {
    renderFunction();

    const title = screen.getByText('title');
    const subtitle = screen.getByText('subtitle');

    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
  });

  test('should test working of info icon buttton', () => {
    renderFunction();

    const infobutton = screen.getByRole('button', { haspopup: true});

    let infotext = screen.queryByText('infotext');

    expect(infotext).not.toBeInTheDocument();

    userEvent.click(infobutton);
    infotext = screen.queryByText('infotext');
    expect(infotext).toBeInTheDocument();
  });

  test('should test the go back to parent button', () => {
    const history = createMemoryHistory();

    history.replace = jest.fn();
    renderWithProviders(<Router history={history}><CeligoPageBar title="title" subtitle="subtitle" parentUrl="/" /></Router>);
    const parentbutton = screen.getByRole('button', { hidden: true});

    userEvent.click(parentbutton);
    expect(history.replace).toHaveBeenCalledWith('/');
  });

  test('should test the back button when history.length > 2', () => {
    const history = createMemoryHistory();

    history.goBack = jest.fn();
    history.length = 3;
    renderWithProviders(<Router history={history}><CeligoPageBar title="title" subtitle="subtitle" parentUrl="/" /></Router>);
    const parentbutton = screen.getByRole('button', { hidden: true});

    userEvent.click(parentbutton);
    expect(history.goBack).toHaveBeenCalledWith();
  });
});
