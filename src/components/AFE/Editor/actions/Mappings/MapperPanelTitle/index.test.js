/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../../../actions';
import {renderWithProviders} from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';

import MapperPanelTitle from './index';

const initialStore = getCreatedStore();

function initMapperPanelTitle(props = {}) {
  initialStore.getState().session.mapping = {
    mapping: {
      version: 2,
      flowId: '5ea16c600e2fab71928a6152',
      importId: '5ea16cd30e2fab71928a6166',
    },
  };

  initialStore.getState().session.flowData = {'5ea16c600e2fab71928a6152': {pageProcessorsMap: {'5ea16cd30e2fab71928a6166': {preMap: {status: 'sreehasa'}}}}};

  return renderWithProviders(<MapperPanelTitle {...props} />, {initialStore});
}
jest.mock('../../../../../icons/SearchIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../icons/SearchIcon'),
  default: props => (
    <button type="button" onClick={() => props.onClick}>SearchIcon</button>

  ),
}));

describe('MapperPanelTitle UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should pass the initial render', () => {
    initMapperPanelTitle({editorId: 'filecsv', helpKey: 'test-key'});
    expect(screen.getByText('Create destination record { } from source record { }')).toBeInTheDocument();
    expect(screen.getByText('Refresh fields')).toBeInTheDocument();
    const collapseRowsButton = document.querySelector('[title="Collapse all rows"]');

    expect(collapseRowsButton).toBeInTheDocument();

    const expandRowsButton = document.querySelector('[title="Expand all rows"]');

    expect(expandRowsButton).toBeInTheDocument();

    const SearchIconButton = document.querySelector('[date-test="showSearch"]');

    expect(SearchIconButton).toBeInTheDocument();
  });
  test('should make a dispatch call when clicked on the collapseRow icon', async () => {
    initMapperPanelTitle({editorId: 'filecsv', helpKey: 'test-key'});
    const collapseRowsButton = document.querySelector('[title="Collapse all rows"]');

    expect(collapseRowsButton).toBeInTheDocument();
    userEvent.click(collapseRowsButton);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.mapping.v2.toggleRows(false)));
  });
  test('should make a dispatch call when clicked on the expandRows icon', async () => {
    initMapperPanelTitle({editorId: 'filecsv', helpKey: 'test-key'});
    const expandRowsButton = document.querySelector('[title="Expand all rows"]');

    expect(expandRowsButton).toBeInTheDocument();
    userEvent.click(expandRowsButton);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.mapping.v2.toggleRows(true)));
  });
  test('should make a dispatch call when clicked on the refresf filters icon', async () => {
    initMapperPanelTitle({editorId: 'filecsv', helpKey: 'test-key'});
    const RefreshFiltersButton = screen.getByRole('button', {name: 'Refresh fields'});

    expect(RefreshFiltersButton).toBeInTheDocument();
    userEvent.click(RefreshFiltersButton);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.flowData.requestSampleData('5ea16c600e2fab71928a6152', '5ea16cd30e2fab71928a6166', 'imports', 'importMappingExtract', true)));
  });
  test('should make a dispatch call when clicked on the search icon', async () => {
    initMapperPanelTitle({editorId: 'filecsv', helpKey: 'test-key'});
    const searchIconButton = screen.getByText('SearchIcon');

    expect(searchIconButton).toBeInTheDocument();
    userEvent.click(searchIconButton);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.mapping.v2.searchTree('')));
  });
});
