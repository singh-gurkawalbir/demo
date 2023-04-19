
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';
import actions from '../../../actions';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.user.preferences = {defaultAShareId: 'own'};
});

const resource = {
  _id: '5e7068331c056a75e6df19b2',
  createdAt: '2020-03-17T06:03:31.798Z',
  lastModified: '2020-03-19T23:47:55.181Z',
  type: 'rest',
  name: 'ResourceName',
  offline: true,
  sandbox: false,
  isHTTP: true,
  server: {hostURI: 'serverhostURI'},
  lambda: {
    functionName: 'SomeFunction',
    accessKeyId: 'someaccessKeyId',
  },
  shared: true,
};

function renderFunction(data = {}) {
  const {store} = renderWithProviders(
    <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15/childID/flowId']}>
      <Route path="/:integrationId/:childId/:flowId">
        <CeligoTable
          {...metadata}
          data={[data]}
    />
      </Route>
    </MemoryRouter>, {initialStore}
  );
  const profile = {timezone: 'Asia/Kolkata'};

  store.dispatch(actions.user.profile.update(profile));
}

function indexOfCell(text, role) {
  const cells = screen.getAllByRole(role);

  return cells.findIndex(each => each.textContent === text);
}

describe('metadata of stacks UI Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should verify the name', () => {
    renderFunction(resource);

    const headerI = indexOfCell('Name', 'columnheader');
    const cellI = indexOfCell('ResourceNameShared', 'rowheader');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);
    expect(cellI).toEqual(headerI);
  });
  test('should verify the Type', () => {
    renderFunction(resource);

    const headerI = indexOfCell('Type', 'columnheader');
    const cellI = indexOfCell('rest', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellI).toEqual(headerI - 1);
  });
  test('should verify the Host', () => {
    renderFunction(resource);

    const headerI = indexOfCell('Host', 'columnheader');
    const cellI = indexOfCell('serverhostURI', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellI).toEqual(headerI - 1);
  });
  test('should verify the Host dupliccate', () => {
    renderFunction(resource);

    const headerI = indexOfCell('Function name', 'columnheader');
    const cellI = indexOfCell('SomeFunction', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellI).toEqual(headerI - 1);
  });
  test('should verify the Access key ID', () => {
    renderFunction(resource);

    const headerI = indexOfCell('Access key ID', 'columnheader');
    const cellI = indexOfCell('someaccessKeyId', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellI).toEqual(headerI - 1);
  });
  test('should verify the Last updated', () => {
    renderFunction(resource);

    const headerI = indexOfCell('Last updated', 'columnheader');
    const cellI = indexOfCell('03/20/2020 5:17:55 am', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellI).toEqual(headerI - 1);
  });
  test('should verify the System token with N/A message', () => {
    renderFunction({_id: 'someID'});

    const headerI = indexOfCell('System token', 'columnheader');
    const cellI = indexOfCell('N/A', 'cell');

    expect(headerI).toBeGreaterThan(-1);
    expect(cellI).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellI).toEqual(headerI - 1);
  });
  test('should verify the row actions', async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/flowId']}>
        <Route path="/:flowId">
          <CeligoTable
            actionProps={{resourceType: 'stacks'}}
            {...metadata}
            data={[{_id: 'someId'}]}
      />
        </Route>
      </MemoryRouter>, {initialStore}
    );
    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);
    expect(screen.getByText('Edit stack')).toBeInTheDocument();

    expect(screen.getByText('View audit log')).toBeInTheDocument();

    expect(screen.getByText('Used by')).toBeInTheDocument();

    expect(screen.getByText('Generate new token')).toBeInTheDocument();

    expect(screen.getByText('Share stack')).toBeInTheDocument();
  });
});
