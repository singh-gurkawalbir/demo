/* global describe, test, expect, beforeEach, jest, afterEach */
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import HomeView from '.';
import {renderWithProviders} from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';

function initHomeView(format = undefined) {
  const initialStore = getCreatedStore();

  initialStore.getState().user.preferences = {dashboard: {}};
  initialStore.getState().user.preferences.dashboard.view = format;
  initialStore.getState().data.resources.marketPlaceTemplates = [{
    _id: '5d9eb2c7224c6042d7a2fc98',
    name: '135',
    user: {
      name: 'swarna suvarchala 123',
      company: 'celigo',
    },
    lastModified: '2019-10-18T06:59:48.542Z',
  }];
  initialStore.getState().data.resources.connections = [{
    _id: '62beb2c2a0f5f2144816f818',
    createdAt: '2022-07-01T08:39:30.787Z',
    lastModified: '2022-07-04T02:51:17.529Z',
    type: 'rdbms',
    name: 'Snowflake connection',
    offline: true,
    rdbms: {
      type: 'snowflake',
      host: 'demo',
      database: 'demo',
      user: 'user',
      password: '******',
      options: [],
      snowflake: {
        warehouse: 'demo',
        schema: 'demo',
      },
      disableStrictSSL: false,
    },
  }];
  initialStore.getState().data.resources.published = [{
    _id: '602177d98a71e67e830613f8',
    name: ' Sukeerthi Test connector',
    description: 'Diksha Staging twoDotZero IA - 01',
    applications: [
      'netsuite',
    ],
    user: {
      name: 'sukeerthi sriram',
      company: 'Sukee- test debugger',
    },
    lastModified: '2021-02-08T17:49:58.265Z',
    framework: 'twoDotZero',
    twoDotZero: {
      changeEdition: {},
      _integrationId: '602176548a71e67e8306135e',
      editions: [],
    },
  }];

  return renderWithProviders(<MemoryRouter><HomeView /></MemoryRouter>, {initialStore});
}

jest.mock('../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/LoadResources'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));

jest.mock('./ListView', () => ({
  __esModule: true,
  ...jest.requireActual('./ListView'),
  default: () => (
    <>
      <div>ListView</div>
    </>
  ),
}));

jest.mock('./TileView', () => ({
  __esModule: true,
  ...jest.requireActual('./TileView'),
  default: () => (
    <>
      <div>TileView</div>
    </>
  ),
}));

describe('HomeView UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should render the ListView when format is passed as list', () => {
    initHomeView('list');
    expect(mockDispatchFn).toBeCalled();
    screen.debug();
    expect(screen.getByText(/ListView/i)).toBeInTheDocument();             // ListView and LoadResources components have been mocked//
  });
  test('should render the TileView when format is not passed as list', () => {
    initHomeView();
    expect(mockDispatchFn).toBeCalled();
    screen.debug();
    expect(screen.getByText(/TileView/i)).toBeInTheDocument();
  });
});
