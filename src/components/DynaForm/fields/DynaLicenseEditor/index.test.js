/* global describe, test, jest */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test/test-utils';
import DynaLicenseEditor from '.';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

jest.mock('../DynaEditor', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaEditor'),
  default: props => (
    <><div>DynaEditor</div><input onClick={() => props.customHandleUpdate} /></>
  ),
}));

function initDynaLicenseEditor(props = {}) {
  initialStore.getState().session.mfa = {
    codes: {
      mobilecode: {
        status: props.status,
      },
    },
  };

  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/scripts/edit/scripts/634664b80eeae84271ab534e'}]} >
      <Route path="/scripts/edit/scripts/634664b80eeae84271ab534e">
        <DynaLicenseEditor {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('DynaLicenseEditor UI tests', () => {
  test('should pass the initial render', () => {
    const props = {
      value: '{"form":"format","version":"2"}',
    };

    initDynaLicenseEditor(props);
    const box = screen.getByRole('textbox');

    userEvent.click(box);

    // userEvent.type(box, 'abc');

    screen.debug();
  });
});
