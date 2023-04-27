import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryHistory} from 'history';
import CeligoPageBar from '.';
import {renderWithProviders} from '../../test/test-utils';

describe('celigopagebar UI tests', () => {
  function renderFunction(history) {
    if (!history) {
      renderWithProviders(
        <MemoryRouter>
          <CeligoPageBar title="title" infoText="infotext" subtitle="subtitle" titleTag="titleTag" />
        </MemoryRouter>);
    } else {
      renderWithProviders(<Router history={history}><CeligoPageBar title="title" subtitle="subtitle" parentUrl="/" /></Router>);
    }
  }
  test('should check for the presense of title and subtitle', () => {
    renderFunction();

    const title = screen.getByText('title');
    const subtitle = screen.getByText('subtitle');

    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
  });

  test('should test working of info icon buttton', async () => {
    renderFunction();

    const infobutton = screen.getByRole('button');

    await userEvent.click(infobutton);
    const infotext = screen.queryByText('infotext');

    expect(infotext).toBeInTheDocument();
  });

  test('should test the go back to parent button', async () => {
    const history = createMemoryHistory();

    jest.spyOn(history, 'replace').mockImplementation();
    renderFunction(history);
    const parentbutton = screen.getByRole('button');

    await userEvent.click(parentbutton);
    expect(history.replace).toHaveBeenCalledWith('/');
  });

  test('should test the back button when history.length > 2', async () => {
    const history = createMemoryHistory();

    jest.spyOn(history, 'goBack').mockImplementation();
    history.length = 3;
    renderFunction(history);
    const parentbutton = screen.getByRole('button');

    await userEvent.click(parentbutton);
    expect(history.goBack).toHaveBeenCalledWith();
  });
});
