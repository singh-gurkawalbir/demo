/* global describe, test, expect, jest, beforeEach */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import AnalyticsPanel from '.';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/LoadResources'),
  default: props => <div>{props.children}</div>,
}));
jest.mock('../../../../../components/LineGraph/Dashboard', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/LineGraph/Dashboard'),
  default: props => {
    const content = `Chart Drawer , intgerationId = ${props.integrationId}`;

    return <div>{content}</div>;
  },
}));

describe('AnalyticsPanel UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  function initStoreAndRender(filters) {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = [{
      _id: '5ff579d745ceef7dcd797c15',
      lastModified: '2021-01-19T06:34:17.222Z',
      name: " AFE 2.0 refactoring for DB's",
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '5ff57a8345ceef7dcd797c21',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
    }];
    initialStore.getState().session.filters = filters;
    renderWithProviders(
      <MemoryRouter>
        <AnalyticsPanel integrationId="5ff579d745ceef7dcd797c15" childId="childId" />
      </MemoryRouter>, {initialStore});
  }
  test('should test dispatch call when filterChildId is not equal to given childId', () => {
    initStoreAndRender();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Chart Drawer , intgerationId = 5ff579d745ceef7dcd797c15')).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'PATCH_FILTER',
        name: 'jobs',
        filter: { childId: 'childId', flowId: '', currentPage: 0 },
      }
    );
  });
  test('should test dispatch call when filterChildId is equal to given childId ', () => {
    initStoreAndRender(
      {
        jobs: {childId: 'childId'},
      }
    );
    expect(mockDispatch).not.toHaveBeenCalledWith(
      {
        type: 'PATCH_FILTER',
        name: 'jobs',
        filter: { childId: 'childId', flowId: '', currentPage: 0 },
      }
    );
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Chart Drawer , intgerationId = 5ff579d745ceef7dcd797c15')).toBeInTheDocument();
  });
});
