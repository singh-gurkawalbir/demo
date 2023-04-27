
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

const flowId = 'flowID';
const id = 'someId';

describe('running flows metadata column UI Tests', () => {
  test('should show FlowSearchFilter', async () => {
    renderFunction({_id: id});
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByText('All flows')).toBeInTheDocument();
    const selecFlow = screen.getByText('demo flow');

    expect(selecFlow).toBeInTheDocument();
  });
  test('should verify Open errors', () => {
    const numOpenError = '10';

    renderFunction({_id: id, _flowId: flowId, numOpenError});

    const headerIndex = indexOfCell('Open errors', 'columnheader');
    const cellIndex = indexOfCell(numOpenError, 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);
    expect(cellIndex).toEqual(headerIndex - 1);
  });
  test('should verify 0 Open errors', () => {
    const numOpenError = '0';

    renderFunction({_id: id, _flowId: flowId, numOpenError});
    const headerIndex = indexOfCell('Open errors', 'columnheader');
    const cellIndex = indexOfCell(numOpenError, 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);
    expect(cellIndex).toEqual(headerIndex - 1);
    const error = screen.getByText(numOpenError);

    expect(error).toHaveAttribute('href', '/5ff579d745ceef7dcd797c15/childID/flowId/flowID/errorsList');
  });
  test('should verify Last open error', () => {
    renderFunction({_id: id, _flowId: flowId, lastErrorAt: '2021-05-18T18:16:31.989Z'});
    const headerIndex = indexOfCell('Last open error', 'columnheader');
    const cellIndex = indexOfCell('05/18/2021 6:16:31 pm', 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader', {name: flowId})).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);
  });
  test('should verify Last run', () => {
    renderFunction({_id: id, _flowId: 'flowID', lastExecutedAt: '2022-05-18T18:16:31.989Z'});
    const headerIndex = indexOfCell('Last run', 'columnheader');
    const cellIndex = indexOfCell('05/18/2022 6:16:31 pm', 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader', {name: flowId})).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);
  });
  test('should verify Average wed', () => {
    const numRuns = '6';

    renderFunction({_id: id, _flowId: flowId, numRuns});
    const headerIndex = indexOfCell('Runs', 'columnheader');
    const cellIndex = indexOfCell(numRuns, 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader', {name: flowId})).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);

    const numsRun = screen.getByText(numRuns);

    expect(numsRun).toHaveAttribute('href', '/5ff579d745ceef7dcd797c15/childID/flowId/flowID/runHistory');
    expect(screen.getByText('Runs')).toBeInTheDocument();
  });
  test('should verify Average run time', () => {
    renderFunction({_id: id });

    const headerIndex = indexOfCell('Average run time', 'columnheader');
    const cellIndex = indexOfCell('00:00:00', 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);
  });
  test('should verify Ignore', () => {
    const numIgnore = '2';

    renderFunction({_id: id, numIgnore});
    const headerIndex = indexOfCell('Ignored', 'columnheader');
    const cellIndex = indexOfCell(numIgnore, 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);
  });
  test('should verify Errors', () => {
    const numError = '3';

    renderFunction({_id: id, numError});
    const headerIndex = indexOfCell('Errors', 'columnheader');
    const cellIndex = indexOfCell(numError, 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);
  });
  test('should verify Auto Resolved', () => {
    const numResolvedByAuto = '5';

    renderFunction({_id: id, numResolvedByAuto});
    const headerIndex = indexOfCell('Auto-resolved', 'columnheader');
    const cellIndex = indexOfCell(numResolvedByAuto, 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);
  });
  test('should verify User Resolved', () => {
    const numResolvedByUser = '4';

    renderFunction({_id: id, numResolvedByUser});
    const headerIndex = indexOfCell('User-resolved', 'columnheader');
    const cellIndex = indexOfCell(numResolvedByUser, 'cell');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(cellIndex).toBeGreaterThan(-1);

    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expect(cellIndex).toEqual(headerIndex - 1);
  });
  test('should verify Pages', () => {
    renderFunction({_id: id, type: 'flow', numPages: 5});

    expect(screen.getByText('Pages')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('should verify Integration options', async () => {
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
    await userEvent.click(await waitFor(() => screen.getAllByRole('button')[0]));
    await userEvent.click(await waitFor(() => screen.getAllByRole('checkbox')[1]));
    await userEvent.click(await waitFor(() => screen.getByText(/Apply/i)));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'PATCH_FILTER',
        name: 'completedFlows',
        filter: { flowIds: ['all'] },
      }
    );
  });

  test('should verify Actions', async () => {
    renderFunction();
    const actionButton = screen.getByRole('button', {name: /more/i});

    expect(actionButton).toBeInTheDocument();
    await userEvent.click(actionButton);
    expect(screen.getByText('Run flow')).toBeInTheDocument();
    expect(screen.getByText('Edit flow')).toBeInTheDocument();
  });
});
