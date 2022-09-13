/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders} from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';
import AddCategoryMappingDrawerRoute from './AddCategory';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../components/LoadResources'),
  default: props => <div>{props.children}</div>,
}));

describe('AddCategoryMappingDrawerRoute UI tests', () => {
  function initStoreAndRender(session, data) {
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
    initialStore.getState().data.resources.flows = [{
      _id: '5ea16c600e2fab71928a6152',
      lastModified: '2021-08-13T08:02:49.712Z',
      name: 'Name of the flow',
      disabled: true,
      _integrationId: '5ff579d745ceef7dcd797c15',
      skipRetries: false,
      pageProcessors: [
        {
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'import',
          _importId: '5ac5e4d706bd2615df9fba44',
        },
      ],
      pageGenerators: [
        {
          _exportId: '5d00b9f0bcd64414811b2396',
        },
      ],
      createdAt: '2020-04-23T10:22:24.290Z',
      lastExecutedAt: '2020-04-23T11:08:41.093Z',
      autoResolveMatchingTraceKeys: true,
    }];

    initialStore.getState().session.integrationApps.settings['5ea16c600e2fab71928a6152-5ff579d745ceef7dcd797c15'] = session;
    initialStore.getState().data.integrationApps['5ea16c600e2fab71928a6152-5ff579d745ceef7dcd797c15'] = data;

    renderWithProviders(
      <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15/5ea16c600e2fab71928a6152/addCategory']}>
        <Route path="/:integrationId/:flowId/">
          <AddCategoryMappingDrawerRoute integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152" />
        </Route>
      </MemoryRouter>, {initialStore});
  }
  test('should test when meta data is not loaded', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/integrationId/flowId/addCategory']}>
        <Route path="/:integrationId/:flowId/">
          <AddCategoryMappingDrawerRoute />
        </Route>
      </MemoryRouter>);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should test when meta data loaded click on addcoategpry no child', () => {
    initStoreAndRender(
      {
        saveStatus: 'saved',
        deleted: [['categoryId']],
        collapseStatus: {collapseStatus: 'expanded'},
        response: [{operation: 'generatesMetaData', data: {categoryRelationshipData: [{name: 'name1', id: 'id1'}]}},
          {operation: 'mappingData', data: []},
        ],
      },
      {
        response: [{operation: 'generatesMetaData',
          data: {categoryRelationshipData: [{
            name: 'name1',
            id: 'id1',
          }]}}],
      }
    );
    userEvent.click(screen.getByText('Please select'));
    userEvent.click(screen.getByText('name1'));
    userEvent.click(screen.getByText('Add category'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/5ff579d745ceef7dcd797c15/5ea16c600e2fab71928a6152');
  });

  test('should test when meta data loaded click on help text', () => {
    initStoreAndRender(
      {
        saveStatus: 'saved',
        deleted: [['categoryId']],
        collapseStatus: {collapseStatus: 'expanded'},
      },
      {
        response: [{operation: 'generatesMetaData',
          data: {categoryRelationshipData: [{
            name: 'name1',
            id: 'id1',
            children: [{name: 'child1', id: 'childid1'}],
          }]}}],
      }
    );
    userEvent.click(screen.getAllByRole('button')[1]);
    expect(screen.getByText('Helptext is useful to give detailed information')).toBeInTheDocument();
  });
  test('should test when meta data loaded click on some child', async () => {
    initStoreAndRender(
      {
        saveStatus: 'saved',
        deleted: [['categoryId']],
        collapseStatus: {collapseStatus: 'expanded'},
        response: [{operation: 'generatesMetaData',
          data: {categoryRelationshipData: [{
            name: 'name1',
            id: 'id1',
            children: [{name: 'child1', id: 'childid1'}],
          }]}},
        {operation: 'mappingData', data: []},
        ],
      },
      {
        response: [{operation: 'generatesMetaData',
          data: {categoryRelationshipData: [{
            name: 'name1',
            id: 'id1',
            children: [{name: 'child', id: 'childId', children: [{name: 'grandchild', id: 'grandchildId'}]}],
          },
          {
            name: 'name2',
            id: 'id2',
          },
          {
            name: 'name3',
            id: 'category',
            value: 'somevalue',
          },
          ]}}],
      }
    );

    userEvent.click(screen.getByText('Please select'));
    userEvent.click(screen.getByText('name1'));
    userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    userEvent.click(screen.getByText('child'));

    expect(screen.getByText('Choose nested-category')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    userEvent.click(screen.getByText('grandchild'));
    userEvent.click(screen.getByText('Add category'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/5ff579d745ceef7dcd797c15/5ea16c600e2fab71928a6152');
  });

  test('should test when meta data loaded click on cancel', () => {
    initStoreAndRender(
      {
        saveStatus: 'saved',
        deleted: [['categoryId']],
        collapseStatus: {collapseStatus: 'expanded'},
        response: [{operation: 'generatesMetaData', data: {categoryRelationshipData: [{name: 'name1', id: 'id1'}]}},
          {operation: 'mappingData', data: []},
        ],
      },
      {
        response: [{operation: 'generatesMetaData', data: {categoryRelationshipData: [{name: 'name1', id: 'id1'}]}}],
      }
    );

    userEvent.click(screen.getByText('Cancel'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/5ff579d745ceef7dcd797c15/5ea16c600e2fab71928a6152');
  });
});
