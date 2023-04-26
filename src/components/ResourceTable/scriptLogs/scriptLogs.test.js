
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import CeligoTable from '../../CeligoTable';
import metadata from './metadata';

const mockHistoryPush = jest.fn();
let mockIds;

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useLocation: () => ({
    pathname: 'PATHNAME',
  }),
}));

jest.mock('../../CeligoTable/TableContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTable/TableContext'),
  useGetTableContext: () => mockIds,
}));

jest.mock('../../TextOverflowCell', () => ({
  __esModule: true,
  ...jest.requireActual('../../TextOverflowCell'),
  default: ({message}) => (<span>{message}</span>),
}));

jest.mock('../../ResourceName', () => ({
  __esModule: true,
  ...jest.requireActual('../../ResourceName'),
  default: ({resourceId}) => (<span>{resourceId}</span>),
}));

jest.mock('../../CeligoTimeAgo', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTimeAgo'),
  default: ({date}) => (<span>{date}</span>),
}));

describe('script Logs test suite', () => {
  beforeEach(() => {
    mockIds = {};
  });

  afterEach(() => {
    mockHistoryPush.mockClear();
  });

  test('should render the table accordingly', async () => {
    const data = [{
      time: 'TIME',
      _resourceId: 'RESOURCE_ID',
      functionType: 'FUNCTION_TYPE',
      logLevel: 'LOG_LEVEL',
      message: 'MESSAGE',
    }];

    renderWithProviders(<CeligoTable {...metadata} data={data} />);
    const columnNames = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columnNames).toEqual([
      'Time',
      'Step name',
      'Function type',
      'Log level',
      'Message',
      'Actions',
    ]);

    //  first for table headings and the second as data row
    expect(screen.getAllByRole('row')).toHaveLength(2);

    expect(screen.getByRole('rowheader', { name: data[0].time})).toBeInTheDocument();

    const cells = screen.getAllByRole('cell').map(ele => ele.textContent);

    expect(cells).toEqual([
      data[0]._resourceId,
      data[0].functionType,
      data[0].logLevel,
      data[0].message,
      '',
    ]);

    const actionButton = screen.getByRole('button', {name: /more/i});

    await userEvent.click(actionButton);
    const actionItems = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(actionItems).toEqual(['View log']);
  });

  test('should be able to view log details for a script', async () => {
    mockIds = {
      flowId: 'FLOW_ID',
      scriptId: 'SCRIPT_ID',
    };
    const data = [{
      index: 12,
      time: 'TIME',
      _resourceId: 'RESOURCE_ID',
      functionType: 'FUNCTION_TYPE',
      logLevel: 'LOG_LEVEL',
      message: 'MESSAGE',
    }];

    renderWithProviders(<CeligoTable {...metadata} data={data} />);
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    const viewButton = screen.getByRole('menuitem', {name: 'View log'});

    await userEvent.click(viewButton);
    expect(mockHistoryPush).toHaveBeenCalledWith(buildDrawerUrl({
      path: drawerPaths.LOGS.FLOW_SCRIPT_DETAIL,
      baseUrl: 'PATHNAME',
      params: {
        index: 12,
        ...mockIds,
      },
    }));
  });

  test('should route to a different path if flowId not present', async () => {
    mockIds = {
      scriptId: 'SCRIPT_ID',
    };
    const data = [{
      index: 16,
      time: 'TIME',
      _resourceId: 'RESOURCE_ID',
      functionType: 'FUNCTION_TYPE',
      logLevel: 'LOG_LEVEL',
      message: 'MESSAGE',
    }];

    renderWithProviders(<CeligoTable {...metadata} data={data} />);
    await userEvent.click(screen.getByRole('button', {name: /more/i}));
    const viewButton = screen.getByRole('menuitem', {name: 'View log'});

    await userEvent.click(viewButton);
    expect(mockHistoryPush).toHaveBeenCalledWith(buildDrawerUrl({
      path: drawerPaths.LOGS.SCRIPT_DETAIL,
      baseUrl: 'PATHNAME',
      params: {
        index: 16,
        ...mockIds,
      },
    }));
  });
});
