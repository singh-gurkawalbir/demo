
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import metadata from './metadata';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import CeligoTable from '../../../CeligoTable';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.resources.integrations = [{
    _id: '5ff579d745ceef7dcd797c15',
    _connectorId: 'connectorId',
    name: " AFE 2.0 refactoring for DB's",
    settings: {supportsMultiStore: false,
      sections: [
        {
          id: '1111111',
          label: '11',
          title: 'title1',
          flows: [{_id: 'flow_id1'}] },
      ]},
  }];
  draft.data.resources.flows = [
    {
      _id: 'flow_id1',
      name: 'demo flow',
      disabled: false,
      _integrationId: '5ff579d745ceef7dcd797c15',
      pageProcessors: [{
        type: 'import',
        _importId: 'resource_id',
      }],
      _flowGroupingId: 'grouping1Id',
    },
  ];
  draft.user.profile = {
    timezone: 'Asia/Calcutta',
  };
});

function renderFunction(data = {}) {
  renderWithProviders(
    <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15/childID/flowId']}>
      <Route path="/:integrationId/:childId/:flowId">
        <CeligoTable
          {...metadata}
          data={[{...data, key: 'someKey'}]}
    />
      </Route>
    </MemoryRouter>, {initialStore}
  );
}

function indexOfCell(text, role) {
  const cells = screen.getAllByRole(role);

  return cells.findIndex(each => each.textContent === text);
}

describe('running flows metadata column UI Tests', () => {
  test('should verify FlowSearchFilter coulmn', async () => {
    renderFunction();
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByText('All flows')).toBeInTheDocument();
    expect(screen.getByText('demo flow')).toBeInTheDocument();
  });
  test('should verify Status coulmn', async () => {
    renderFunction();
    expect(screen.getByText('Status')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button')[1]);
    expect(screen.getByText('All statuses')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.getByText('Canceling')).toBeInTheDocument();
    expect(screen.getByText('Waiting in queue')).toBeInTheDocument();
  });
  test('should verify Started coulmn', () => {
    renderFunction({startedAt: '2022-05-18T18:16:31.989Z'});

    const headerIndex = indexOfCell('Started', 'columnheader');
    const cellIndex = indexOfCell('05/18/2022 11:46:31 pm', 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);
  });
  test('should verify Success coulmn', () => {
    const numSuccess = '1';

    renderFunction({numSuccess});
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText(numSuccess)).toBeInTheDocument();

    const headerIndex = indexOfCell('Success', 'columnheader');
    const cellIndex = indexOfCell(numSuccess, 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);
  });

  test('should verify Ignore coulmn', () => {
    const numIgnore = '2';

    renderFunction({numIgnore});

    const headerIndex = indexOfCell('Ignored', 'columnheader');
    const cellIndex = indexOfCell(numIgnore, 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);
  });
  test('should verify Errors coulmn', () => {
    const numError = '3';

    renderFunction({numError});

    const headerIndex = indexOfCell('Errors', 'columnheader');
    const cellIndex = indexOfCell(numError, 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);
  });
  test('should verify Resolved coulmn', () => {
    const numResolved = '4';

    renderFunction({numResolved});

    const headerIndex = indexOfCell('Auto-resolved', 'columnheader');
    const cellIndex = indexOfCell(numResolved, 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);
  });
  test('should verify Pages coulmn', () => {
    const numPagesGenerated = '5';

    renderFunction({type: 'flow', numPagesGenerated});

    const headerIndex = indexOfCell('Pages', 'columnheader');
    const cellIndex = indexOfCell(numPagesGenerated, 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);
  });

  test('should verify Integration options coulmn', async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/flowId']}>
        <Route path="/:flowId">
          <CeligoTable
            {...metadata}
            data={[{type: 'flow', numPagesGenerated: 5, key: 'someKey'}]}
      />
        </Route>
      </MemoryRouter>, {initialStore}
    );

    expect(screen.getByText('Integration')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button')[0]);
    await userEvent.click(screen.getAllByRole('checkbox')[1]);
    await userEvent.click(screen.getByText('Apply'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'PATCH_FILTER',
        name: 'runningFlows',
        filter: { flowIds: ['all'] },
      }
    );
  });
  test('should verify Actions coulmn', async () => {
    renderFunction();
    const actionButton = screen.getByRole('button', {name: /more/i});

    expect(actionButton).toBeInTheDocument();
    await userEvent.click(actionButton);
    waitFor(() => expect(screen.getByText('Cancel run')).toBeInTheDocument());
  });
});
