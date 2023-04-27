
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
    draft.data.resources.imports = [{_id: '63515cc28eab567612a83249', name: 'import1', adaptorType: 'HTTPImport'}];
  });

  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/imports/edit/imports/63515cc28eab567612a83249/editor/filecsv'}]}>
      <Route path="/imports/edit/imports/63515cc28eab567612a83249/editor/filecsv">
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
    label: 'CSV generator helper',
    value: {
      includeHeader: true,
      columnDelimiter: ',',
      rowDelimiter: '\n',
      replaceNewlineWithSpace: false,
      replaceTabWithSpace: false,
      truncateLastRowDelimiter: false,
      wrapWithQuotes: false,
    },
    flowId: '63515cc28eab567612a83256',
    resourceId: '63515cc28eab567612a83249',
    resourceType: 'imports',
    disabled: false,
    formKey: 'imports-63515cc28eab567612a83249',
  };

  test('should pass the initial render', () => {
    initDynaCsvGenerate(props);
    expect(screen.getByRole('button', {name: 'Launch'})).toBeInTheDocument();
    expect(screen.getByText('CSV generator helper')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', {name: 'Include header'})).toBeInTheDocument();
  });
  test('should render the helper form when clicked on "Launch" button', async () => {
    initDynaCsvGenerate(props);
    const launchButton = screen.getByRole('button', {name: 'Launch'});

    await userEvent.click(launchButton);
    expect(screen.getByText('Truncate last row delimiter')).toBeInTheDocument();
    expect(screen.getByText('Wrap with quotes')).toBeInTheDocument();
    expect(screen.getByText('Replace tab with space')).toBeInTheDocument();
    expect(screen.getByText('Replace new line with space')).toBeInTheDocument();
    expect(screen.getByText('Column delimiter')).toBeInTheDocument();
    expect(screen.getByText('Row delimiter')).toBeInTheDocument();
  });
  test('should make a dipatch call and URL redirection when "Create child license" is clicked', async () => {
    initDynaCsvGenerate(props);
    const launchButton = screen.getByRole('button', {name: 'Launch'});

    await userEvent.click(launchButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalled());
    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/imports/edit/imports/63515cc28eab567612a83249/editor/filecsv/editor/filecsv'));
  });
});
