/* global describe, test,expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore} from '../../../test/test-utils';
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

jest.mock('../../CeligoSwitch', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoSwitch'),
  default: () => (
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

function existanceOfCellInDom(text, role) {
  const cells = screen.getAllByRole(role);

  return cells.findIndex(each => each.textContent === text);
}
let headerI;
let cellI;

function expectFunction(header, cell) {
  expect(header).toBeGreaterThan(-1);
  expect(cell).toBeGreaterThan(-1);
  expect(cell).toEqual(header);
}

const initialStore = reduxStore;

initialStore.getState().user.preferences = {
  defaultAShareId: 'own',
};

const resourcE = {
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
  id: '5d95f7d1795b356dfcb5d6c4',
  childId: '14663',
  childName: 'AMZ-US-1',
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

async function initflowTable(actionProps = {}, resource = resourcE) {
  const ui = (
    <MemoryRouter>
      <CeligoTable
        actionProps={actionProps}
        {...metadata}
        data={[resource]} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('flows matadata UI test case', () => {
  test('should verify the coulmns when resource is not integration app', () => {
    initflowTable(actionProps);
    headerI = existanceOfCellInDom('Name', 'columnheader');
    cellI = existanceOfCellInDom('Name of the flow', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Last updated', 'columnheader');
    cellI = existanceOfCellInDom('05/03/2022 6:24:08 am', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Last run', 'columnheader');
    cellI = existanceOfCellInDom('03/03/2022 9:06:36 pm', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Mapping', 'columnheader');
    cellI = existanceOfCellInDom('Mocked Mappping cell flowId: 5d95f7d1795b356dfcb5d6c4 childId: someChildID', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Schedule', 'columnheader');
    cellI = existanceOfCellInDom('Mocked CalendarIcon', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Run', 'columnheader');
    cellI = existanceOfCellInDom('Mocked RunFlowButton', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Off/On', 'columnheader');
    cellI = existanceOfCellInDom('Mocked CeligoSwitch', 'cell');
    expectFunction(headerI, cellI);
  });
  test('should verify the coulmns when resource is integration app', () => {
    initflowTable({...actionProps, isIntegrationApp: true, isUserInErrMgtTwoDotZero: true});
    headerI = existanceOfCellInDom('Name', 'columnheader');
    cellI = existanceOfCellInDom('Name of the flow', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Last updated', 'columnheader');
    cellI = existanceOfCellInDom('05/03/2022 6:24:08 am', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Last run', 'columnheader');
    cellI = existanceOfCellInDom('03/03/2022 9:06:36 pm', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Mapping', 'columnheader');
    cellI = existanceOfCellInDom('Mocked Mappping cell flowId: 5d95f7d1795b356dfcb5d6c4 childId: someChildID', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Schedule', 'columnheader');
    cellI = existanceOfCellInDom('Mocked CalendarIcon', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Run', 'columnheader');
    cellI = existanceOfCellInDom('Mocked RunFlowButton', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Off/On', 'columnheader');
    cellI = existanceOfCellInDom('Mocked CeligoSwitch', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Settings', 'columnheader');
    cellI = existanceOfCellInDom('Mocked SettingsIcon', 'cell');
    expectFunction(headerI, cellI);
    headerI = existanceOfCellInDom('Errors', 'columnheader');
    cellI = existanceOfCellInDom('Success', 'cell');
    expectFunction(headerI, cellI);
  });
  test('should verify action for inetgartion app', () => {
    initflowTable({...actionProps, isIntegrationApp: true});
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.getByText('Edit flow')).toBeInTheDocument();
    expect(screen.getByText('View audit log')).toBeInTheDocument();
  });
  test('should show detach option when flow does not belongs to standalone', () => {
    initflowTable({...actionProps, resourceType: 'flows'}, {...resourcE, _connectorId: null});
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.getByText('Edit flow')).toBeInTheDocument();
    expect(screen.getByText('View audit log')).toBeInTheDocument();
    expect(screen.getByText('Used by')).toBeInTheDocument();
    expect(screen.getByText('Download flow')).toBeInTheDocument();//
    expect(screen.getByText('Clone flow')).toBeInTheDocument();
    expect(screen.getByText('Detach flow')).toBeInTheDocument();
    expect(screen.getByText('Delete flow')).toBeInTheDocument();
  });
  test('should show detach option when flow belongs to standalone', () => {
    initflowTable({resourceType: 'flows'}, {...resourcE, _connectorId: null, _integrationId: null});
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    expect(screen.getByText('Edit flow')).toBeInTheDocument();
    expect(screen.getByText('View audit log')).toBeInTheDocument();
    expect(screen.getByText('Used by')).toBeInTheDocument();
    expect(screen.getByText('Download flow')).toBeInTheDocument();//
    expect(screen.getByText('Clone flow')).toBeInTheDocument();
    expect(screen.getByText('Delete flow')).toBeInTheDocument();

    expect(screen.queryByText('Detach flow')).not.toBeInTheDocument();
  });
});
