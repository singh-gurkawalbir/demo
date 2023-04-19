
import React from 'react';
import {
  screen, fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaNetSuiteDefaultValue from './DynaNetSuiteDefaultValue';
import { renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';
import actions from '../../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('./DynaRefreshableSelect', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaRefreshableSelect'),
  default: () => (
    <div>Mocked DynaRefreshableSelect</div>
  ),
}));

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.metadata = {application: {someconnectionId: {somePath: {
    data: [{name: 'someName1', scriptId: 'once', doesNotSupportCreate: true},
      {name: 'someName12', scriptId: 'somevalue12', doesNotSupportCreate: true},
    ],
    status: 'someStatus',
  }}}};
});

const genralProps = {
  value: 'once',
  selectOptions: [],
  defaultValue: 'someDefaultValue',
  id: 'someID',
  connectionId: 'someconnectionId',
  options: {commMetaPath: 'somePath', recordType: 'once'},
  commMetaPath: 'somePath',
  filterKey: 'suitescript-recordTypes',
};

async function initDynaNetSuiteDefaultValue(props = {}, initialStore) {
  const ui = (
    <DynaNetSuiteDefaultValue
      {...props}
    />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaNetSuiteDefaultValue UI test cases', () => {
  const mockOnFieldChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show spinner when data are not loaded', () => {
    renderWithProviders(<DynaNetSuiteDefaultValue />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should show a spinner when status is requested', () => {
    mutateStore(initialStore, draft => {
      draft.session.metadata = {application: {someconnectionId: {somePath: {
        data: [{name: 'someName', scriptId: 'once', doesNotSupportCreate: true}], status: 'requested',
      }}}};
    });

    const props = { onFieldChange: {mockOnFieldChange}};

    initDynaNetSuiteDefaultValue({...genralProps, ...props}, initialStore);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should show a spinner when status is refreshed', () => {
    mutateStore(initialStore, draft => {
      draft.session.metadata = {application: {someconnectionId: {somePath: {
        data: [{name: 'someName', scriptId: 'once'}], status: 'refreshed',
      }}}};
    });
    const props = { onFieldChange: {mockOnFieldChange}, label: 'PropsLabel'};

    initDynaNetSuiteDefaultValue({...genralProps, ...props}, initialStore);
    expect(screen.getByText('PropsLabel')).toBeInTheDocument();
    expect(screen.getByText('someName')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should show call the onField change when field is changed', async () => {
    mutateStore(initialStore, draft => {
      draft.session.metadata = {application: {someconnectionId: {somePath: {
        data: [{name: 'someName1', scriptId: 'once', doesNotSupportCreate: true},
          {name: 'someName12', scriptId: 'somevalue12', doesNotSupportCreate: true},
        ],
        status: 'someStatus',
      }}}};
    });
    const props = { onFieldChange: mockOnFieldChange, label: 'PropsLabel'};

    initDynaNetSuiteDefaultValue({...genralProps, ...props}, initialStore);
    fireEvent.focusIn(screen.getByRole('textbox'));
    await userEvent.click(screen.getByText('someName12'));
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', 'somevalue12');
  });
  test('should click on refresh button', async () => {
    mutateStore(initialStore, draft => {
      draft.session.metadata = {application: {someconnectionId: {somePath: {
        data: [{name: 'someName1', scriptId: 'once', doesNotSupportCreate: true},
          {name: 'someName12', scriptId: 'somevalue12', doesNotSupportCreate: true},
        ],
        status: 'someStatus',
      }}}};
    });
    const props = { onFieldChange: mockOnFieldChange, label: 'PropsLabel'};

    initDynaNetSuiteDefaultValue({...genralProps, ...props}, initialStore);
    await userEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.metadata.refresh(
        'someconnectionId',
        'somePath',
        {
          refreshCache: true,
        }
      )
    );
  });
  test('should show the multi select textbox', () => {
    mutateStore(initialStore, draft => {
      draft.session.metadata = {application: {someconnectionId: {somePath: {
        data: [{name: 'someName1', scriptId: 'once', doesNotSupportCreate: true},
          {name: 'someName12', scriptId: 'somevalue12', doesNotSupportCreate: true},
        ],
        status: 'someStatus',
      }}}};
    });
    const props = { onFieldChange: mockOnFieldChange, label: 'PropsLabel', multiselect: true };

    initDynaNetSuiteDefaultValue({...genralProps, ...props}, initialStore);
    expect(screen.getByText('Mocked DynaRefreshableSelect')).toBeInTheDocument();
  });
});
