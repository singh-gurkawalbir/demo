/* eslint-disable jest/expect-expect */

import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';
import CeligoTable from '../../CeligoTable';
import metadata from './metadata';

jest.mock('./cells/MappingCell', () => ({
  __esModule: true,
  ...jest.requireActual('./cells/MappingCell'),
  default: props => (
    <><div>Mocked Mappping cell</div><div> flowId: {props.flowId}</div><div> childId: {props.childId}</div></>
  ),
}));

jest.mock('../../icons/CalendarIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../icons/CalendarIcon'),
  default: () => (
    <><div>Mocked CalendarIcon</div></>
  ),
}));

jest.mock('../../RunFlowButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../RunFlowButton'),
  default: () => (
    <><div>Mocked RunFlowButton</div></>
  ),
}));

jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Switch: () => (
    <><div>Mocked CeligoSwitch</div></>
  ),
}));

jest.mock('../../icons/SettingsIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../icons/SettingsIcon'),
  default: () => (
    <><div>Mocked SettingsIcon</div></>
  ),
}));

function indexOfCell(text, role) {
  const cells = screen.getAllByRole(role);

  return cells.findIndex(each => each.textContent === text);
}
let headerIndex;
let cellIndex;

function expectFunction(header, cell) {
  expect(header).toBeGreaterThan(-1);
  expect(cell).toBeGreaterThan(-1);
  expect(cell).toEqual(header);
}

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.user.profile = {
    timezone: 'Asia/Calcutta',
  };

  draft.user.preferences = {
    defaultAShareId: 'own',
  };
});

const resource = {
  _id: '5d95f7d1795b356dfcb5d6c4',
  lastModified: '2022-05-03T00:54:08.540Z',
  name: 'Name of the flow',
  disabled: true,
  _integrationId: '5d95f77174836b1acdcd2788',
  _connectorId: '58777a2b1008fb325e6c0953',
  createdAt: '2019-10-03T13:29:53.527Z',
  lastExecutedAt: '2022-03-03T15:36:36.851Z',
  autoResolveMatchingTraceKeys: true,
  errors: 1,
  lastExecutedAtSort: '2022-03-03T15:36:36.851Z',
  lastExecutedAtSortType: 'date',
};

const actionProps = {
  childId: 'someChildID',
  flowAttributes: {'5d95f7d1795b356dfcb5d6c4': {
    isDataLoader: false,
    disableRunFlow: true,
    allowSchedule: true,
    type: 'Scheduled',
    supportsSettings: true,
  }},
};

function initflowTable(actionProps = {}, res = resource) {
  const ui = (
    <MemoryRouter>
      <CeligoTable
        actionProps={actionProps}
        {...metadata}
        data={[res]} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('flows metadata UI test case', () => {
  test('should verify the coulmns when resource is not integration app', () => {
    initflowTable(actionProps);
    headerIndex = indexOfCell('Name', 'columnheader');
    cellIndex = indexOfCell('Name of the flow', 'rowheader');
    expectFunction(headerIndex, cellIndex);
    headerIndex = indexOfCell('Last updated', 'columnheader');
    cellIndex = indexOfCell('05/03/2022 12:54:08 am', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
    headerIndex = indexOfCell('Last run', 'columnheader');
    cellIndex = indexOfCell('03/03/2022 3:36:36 pm', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
    headerIndex = indexOfCell('Mapping', 'columnheader');
    cellIndex = indexOfCell('Mocked Mappping cell flowId: 5d95f7d1795b356dfcb5d6c4 childId: someChildID', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
    headerIndex = indexOfCell('Schedule', 'columnheader');
    cellIndex = indexOfCell('Mocked CalendarIcon', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
    headerIndex = indexOfCell('Run', 'columnheader');
    cellIndex = indexOfCell('Mocked RunFlowButton', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
    headerIndex = indexOfCell('Off/On', 'columnheader');
    cellIndex = indexOfCell('Mocked CeligoSwitch', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
  });
  test('should show child with header as App', () => {
    initflowTable({...actionProps, showChild: true}, {...resource, childName: 'ChildName'});
    headerIndex = indexOfCell('App', 'columnheader');
    cellIndex = indexOfCell('ChildName', 'cell');
    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expectFunction(headerIndex - 1, cellIndex);
  });
  test('should show child when header is provided', () => {
    initflowTable({...actionProps, showChild: true, childHeader: 'someChildHeader', integrationChildren: [{value: '5d95f77174836b1acdcd2788', label: 'someLabel'}]});
    headerIndex = indexOfCell('someChildHeader', 'columnheader');
    cellIndex = indexOfCell('someLabel', 'cell');
    expect(screen.getByRole('rowheader')).toBeInTheDocument();
    expectFunction(headerIndex - 1, cellIndex);
  });
  test('should verify the coulmns when resource is integration app', () => {
    initflowTable({...actionProps, isIntegrationApp: true, isUserInErrMgtTwoDotZero: true});
    headerIndex = indexOfCell('Name', 'columnheader');
    cellIndex = indexOfCell('Name of the flow', 'rowheader');
    expectFunction(headerIndex, cellIndex);
    headerIndex = indexOfCell('Last updated', 'columnheader');
    cellIndex = indexOfCell('05/03/2022 12:54:08 am', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
    headerIndex = indexOfCell('Last run', 'columnheader');
    cellIndex = indexOfCell('03/03/2022 3:36:36 pm', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
    headerIndex = indexOfCell('Mapping', 'columnheader');
    cellIndex = indexOfCell('Mocked Mappping cell flowId: 5d95f7d1795b356dfcb5d6c4 childId: someChildID', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
    headerIndex = indexOfCell('Schedule', 'columnheader');
    cellIndex = indexOfCell('Mocked CalendarIcon', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
    headerIndex = indexOfCell('Run', 'columnheader');
    cellIndex = indexOfCell('Mocked RunFlowButton', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
    headerIndex = indexOfCell('Off/On', 'columnheader');
    cellIndex = indexOfCell('Mocked CeligoSwitch', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
    headerIndex = indexOfCell('Settings', 'columnheader');
    cellIndex = indexOfCell('Mocked SettingsIcon', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
    headerIndex = indexOfCell('Errors', 'columnheader');
    cellIndex = indexOfCell('Success', 'cell');
    expectFunction(headerIndex - 1, cellIndex);
  });
  test('should verify action for integration app', async () => {
    initflowTable({...actionProps, isIntegrationApp: true});
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.getByText('Edit flow')).toBeInTheDocument();
    expect(screen.getByText('View audit log')).toBeInTheDocument();
  });
  test('should show detach option when flow does not belongs to standalone', async () => {
    initflowTable({...actionProps, resourceType: 'flows'}, {...resource, _connectorId: null});
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.getByText('Edit flow')).toBeInTheDocument();
    expect(screen.getByText('View audit log')).toBeInTheDocument();
    expect(screen.getByText('Used by')).toBeInTheDocument();
    expect(screen.getByText('Download flow')).toBeInTheDocument();
    expect(screen.getByText('Clone flow')).toBeInTheDocument();
    expect(screen.getByText('Detach flow')).toBeInTheDocument();
    expect(screen.getByText('Delete flow')).toBeInTheDocument();
  });
  test('should show detach option when flow belongs to standalone', async () => {
    initflowTable({...actionProps, resourceType: 'flows'}, {...resource, _connectorId: null, _integrationId: null});
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.getByText('Edit flow')).toBeInTheDocument();
    expect(screen.getByText('View audit log')).toBeInTheDocument();
    expect(screen.getByText('Used by')).toBeInTheDocument();
    expect(screen.getByText('Download flow')).toBeInTheDocument();//
    expect(screen.getByText('Clone flow')).toBeInTheDocument();
    expect(screen.getByText('Delete flow')).toBeInTheDocument();

    expect(screen.queryByText('Detach flow')).not.toBeInTheDocument();
  });
});
