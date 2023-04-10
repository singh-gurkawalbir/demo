
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../../../actions';
import {mutateStore, renderWithProviders} from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';

import MapperPanelTitle from './index';

const initialStore = getCreatedStore();

function initMapperPanelTitle(props = {}) {
  const mustateState = draft => {
    draft.session.mapping = {
      mapping: {
        version: 2,
        flowId: '5ea16c600e2fab71928a6152',
        importId: '5ea16cd30e2fab71928a6166',
      },
    };

    draft.session.flowData = {'5ea16c600e2fab71928a6152': {pageProcessorsMap: {'5ea16cd30e2fab71928a6166': {preMap: {status: 'sreehasa'}}}}};
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<MapperPanelTitle {...props} />, {initialStore});
}
jest.mock('../../../../../icons/SearchIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../icons/SearchIcon'),
  default: props => (
    <button type="button" onClick={() => props.onClick}>SearchIcon</button>

  ),
}));

describe('mapperPanelTitle UI tests', () => {
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
    const collapseRowsButton = screen.getByLabelText('Collapse all rows');

    expect(collapseRowsButton).toBeInTheDocument();

    const expandRowsButton = screen.getByLabelText('Expand all rows');

    expect(expandRowsButton).toBeInTheDocument();

    const SearchIconButton = document.querySelector('[date-test="showSearch"]');

    expect(SearchIconButton).toBeInTheDocument();
  });
  test('should make a dispatch call when clicked on the collapseRow icon', async () => {
    initMapperPanelTitle({editorId: 'filecsv', helpKey: 'test-key'});
    const collapseRowsButton = screen.getByLabelText('Collapse all rows');

    expect(collapseRowsButton).toBeInTheDocument();
    await userEvent.click(collapseRowsButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.v2.toggleRows(false)));
  });
  test('should make a dispatch call when clicked on the expandRows icon', async () => {
    initMapperPanelTitle({editorId: 'filecsv', helpKey: 'test-key'});
    const expandRowsButton = screen.getByLabelText('Expand all rows');

    expect(expandRowsButton).toBeInTheDocument();
    await userEvent.click(expandRowsButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.v2.toggleRows(true)));
  });
  test('should make a dispatch call when clicked on the refresf filters icon', async () => {
    initMapperPanelTitle({editorId: 'filecsv', helpKey: 'test-key'});
    const RefreshFiltersButton = screen.getByRole('button', {name: 'Refresh fields'});

    expect(RefreshFiltersButton).toBeInTheDocument();
    await userEvent.click(RefreshFiltersButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.flowData.requestSampleData('5ea16c600e2fab71928a6152', '5ea16cd30e2fab71928a6166', 'imports', 'importMappingExtract', true)));
  });
  test('should make a dispatch call when clicked on the search icon', async () => {
    initMapperPanelTitle({editorId: 'filecsv', helpKey: 'test-key'});
    const searchIconButton = screen.getByText('SearchIcon');

    expect(searchIconButton).toBeInTheDocument();
    await userEvent.click(searchIconButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.v2.searchTree('')));
  });
});
