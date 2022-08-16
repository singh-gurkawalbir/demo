/* global describe, test, expect, jest */
import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
// import userEvent from '@testing-library/user-event';
import Permissions from '.';
import { renderWithProviders } from '../../test/test-utils';
// import actions from '../../actions';

let mockJSONValue;

jest.mock('../../components/JsonContent', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/JsonContent'),
  default: ({json}) => {
    mockJSONValue = json;

    return <div>jsonContent</div>;
  },
}
));

async function initPermissions() {
  const ui = (
    <MemoryRouter>
      <Route>
        <Permissions />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('Permissions', () => {
  test('Should able to test the permission explorer', async () => {
    await initPermissions();
    const headingNode = screen.getByRole('heading', {name: 'Permission explorer'});

    expect(headingNode).toBeInTheDocument();
    expect(screen.getByText('jsonContent')).toBeInTheDocument();
    expect(Object.keys(mockJSONValue)).toEqual([
      'accesstokens',
      'agents',
      'audits',
      'connections',
      'connectors',
      'integrations',
      'recyclebin',
      'scripts',
      'stacks',
      'subscriptions',
      'templates',
      'transfers',
      'users',
      'exports',
      'imports',
      'apis',
      'eventreports',
    ]);
  });
});
