
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import DynaCsvGenerate from './index';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: props => (
    props.children
  ),
}));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../../../utils/resource', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../utils/resource'),
  generateNewId: () => 'new-formKey',
}));

function initDynaCsvGenerate(props = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.exports = [{_id: '63515cc28eab567612a83249', name: 'import1', adaptorType: 'HTTPImport'}];
  });

  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/exports/edit/imports/63515cc28eab567612a83249/editor/filecsv'}]}>
      <Route path="/exports/edit/imports/63515cc28eab567612a83249/editor/filecsv">
        <DynaCsvGenerate {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaCsvGenerate_afe UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
      action.onSave;
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  const props = {
    id: 'file.csv',
    onFieldChange: jest.fn(),
    label: 'CSV parser helper',
    value: {
      includeHeader: true,
      columnDelimiter: ',',
      rowDelimiter: '\n',
      replaceNewlineWithSpace: false,
      replaceTabWithSpace: false,
      truncateLastRowDelimiter: false,
      wrapWithQuotes: false,
    },
    resourceId: '63515cc28eab567612a83249',
    resourceType: 'exports',
    disabled: false,
    formKey: 'exports-63515cc28eab567612a83249',
  };

  test('should pass the initial render', () => {
    initDynaCsvGenerate(props);
    expect(screen.getByRole('button', {name: 'Launch'})).toBeInTheDocument();
    expect(screen.getByText('CSV parser helper')).toBeInTheDocument();
  });
  test('should render the helper form when clicked on "Launch" button', async () => {
    initDynaCsvGenerate(props);
    const launchButton = screen.getByRole('button', {name: 'Launch'});

    await userEvent.click(launchButton);
    expect(screen.getByText('Trim spaces')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', {name: 'Trim spaces'}));
    expect(screen.getByText('Number of rows to skip')).toBeInTheDocument();
    expect(screen.getByText('File has header')).toBeInTheDocument();
    expect(screen.getByText('Column delimiter')).toBeInTheDocument();
    expect(screen.getByText('Row delimiter')).toBeInTheDocument();
  });
  test('should make a dipatch call and URL redirection when "Create child license" is clicked', async () => {
    initDynaCsvGenerate(props);
    const launchButton = screen.getByText('Launch');

    await userEvent.click(launchButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalled());
    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/exports/edit/imports/63515cc28eab567612a83249/editor/filecsv/editor/filecsv'));
  });
});
