/* global describe, test, expect, jest */
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route} from 'react-router-dom';
import DynaEditor from '.';
import { renderWithProviders} from '../../../../test/test-utils';

jest.mock('../DynaEditor', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaEditor'),
  default: props => (
    <><div>Code Editor</div><input onClick={() => props.customHandleUpdate} /></>
  ),
}));

jest.mock('../../../IconButtonWithTooltip', () => ({
  __esModule: true,
  ...jest.requireActual('../../../IconButtonWithTooltip'),
  default: () => (
    <div>button</div>
  ),
}));

describe('DynaEditor UI tests', () => {
  const mockcustomHandleUpdate = jest.fn();
  const props = {
    expandmode: false,
    mode: 'json',
    customHandleUpdate: mockcustomHandleUpdate,
    options: {file: 'json'},
    skipJsonParse: true,
    isValid: true,
    value: {},
    label: 'form Label',
    saveMode: 'json',
  };

  test('should pass the initial render', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={[{pathname: '/scripts/edit/scripts/634664b80eeae84271ab534e/expand/scripts-634664b80eeae84271ab534e/content'}]} >
        <Route path="/scripts/edit/scripts/:scriptId/expand/scripts-634664b80eeae84271ab534e/content">
          <DynaEditor {...props} />
        </Route>
      </MemoryRouter>);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    screen.debug();
    // expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

