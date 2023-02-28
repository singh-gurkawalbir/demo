
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen} from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import DynaSalesforceSelectOptionsGenerator from './DynaSalesforceRefreshableSelect';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import actions from '../../../actions';

const initialStore = reduxStore;
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

const mockOnFieldChange = jest.fn();

function initDynaSalesforceRefreshableSelect(props = {}) {
  const ui = (
    <DynaSalesforceSelectOptionsGenerator
      {...props}
  />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaRefreshable UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('dispatch call should happen when clicked on refresh button and when entity name is provided', async () => {
    const data = {
      connectionId: '62f10f423dde9221e47c7a8b',
      filterKey: 'salesforce-sObjects',
      fieldName: 'somefieldname',
      formKey: 'someformkey',
      onFieldChange: mockOnFieldChange,
      multiselect: false,
      ignoreValueUnset: false,
      disableOptionsLoad: true,
    };
    const commMetaPath = 'salesforce/metadata/connections/62f10f423dde9221e47c7a8b/sObjectTypes/someentityname';

    mutateStore(initialStore, draft => {
      draft.session.form.someformkey = {
        fields: {
          _connectionId: { touched: false, value: '123'},
        },
        value: {
          '/salesforce/soql': {
            entityName: 'someentityname',
          },
        },
      };
      draft.session.metadata.application['62f10f423dde9221e47c7a8b'] = {};
      draft.session.metadata.application['62f10f423dde9221e47c7a8b'][commMetaPath] = {
        status: 'refreshed',
        data: [{
          label: 'Once Export',
          custom: false,
          triggerable: false,
          name: 'Once Export',
        }],
        filterKey: 'salesforce-recordType',
      };
    });
    initDynaSalesforceRefreshableSelect(data);
    const selectButton = screen.getByText('Please select');

    await userEvent.click(selectButton);
    await userEvent.click(screen.getByText('Once Export'));
    const refreshButton = screen.getAllByRole('button').find(eachOption => eachOption.getAttribute('data-test') === 'refreshResource');

    expect(refreshButton).toBeInTheDocument();
    await userEvent.click(refreshButton);

    expect(mockDispatch).toHaveBeenCalledWith(actions.metadata.refresh('62f10f423dde9221e47c7a8b', 'salesforce/metadata/connections/62f10f423dde9221e47c7a8b/sObjectTypes/someentityname', {
      refreshCache: true,
    }));
  });
  test('error message should be displayed', async () => {
    const data = {connectionId: '62f10f423dde9221e47c7a8b',
      filterKey: 'salesforce-sObjects',
      fieldName: 'somefieldname',
      formKey: 'someformkey',
      onFieldChange: mockOnFieldChange,
      multiselect: false,
      ignoreValueUnset: false,
      disableOptionsLoad: true};
    const commMetaPath = 'salesforce/metadata/connections/62f10f423dde9221e47c7a8b/sObjectTypes/someentityname';

    mutateStore(initialStore, draft => {
      draft.session.form.someformkey = {
        fields: {
          _connectionId: { touched: false, value: '123'},
        },
        value: {
          '/salesforce/soql': {
            entityName: 'someentityname',
          },
        },
      };
      draft.session.metadata.application['62f10f423dde9221e47c7a8b'] = {};
      draft.session.metadata.application['62f10f423dde9221e47c7a8b'][commMetaPath] = {
        status: 'refreshed',
        data: [],
        errorMessage: 'A value must be provided',
        filterKey: 'salesforce-recordType',

      };
    });
    initDynaSalesforceRefreshableSelect(data);

    const selectButton = screen.getByText('Please select');

    await userEvent.click(selectButton);
    expect(screen.getByText('A value must be provided')).toBeInTheDocument();
  });
  test('dispatch call should be made when clicked on refresh button for no entity provided', async () => {
    const data = {connectionId: '62f10f423dde9221e47c7a8b',
      filterKey: 'salesforce-sObjects',
      fieldName: 'somefieldname',
      formKey: 'someformkey',
      onFieldChange: mockOnFieldChange,
      multiselect: false,
      ignoreValueUnset: false,
      disableOptionsLoad: true};
    const commMetaPath = 'salesforce/metadata/connections/62f10f423dde9221e47c7a8b/sObjectTypes';

    mutateStore(initialStore, draft => {
      draft.session.form.someformkey = {
        fields: {
          _connectionId: { touched: false, value: '123'},
        },
        value: {
          '/salesforce/soql': {
          },
        },
      };
      draft.session.metadata.application['62f10f423dde9221e47c7a8b'] = {};
      draft.session.metadata.application['62f10f423dde9221e47c7a8b'][commMetaPath] = {
        status: 'refreshed',
        data: [{
          label: 'Once Export',
          custom: false,
          triggerable: false,
          name: 'Once Export',
        }],
        filterKey: 'salesforce-recordType',
      };
    });
    initDynaSalesforceRefreshableSelect(data);
    const selectButton = screen.getByText('Please select');

    await userEvent.click(selectButton);
    const userButton = document.querySelector('[data-test="refreshResource"]');

    await userEvent.click(userButton);

    expect(mockDispatch).toHaveBeenCalledWith(actions.metadata.refresh('62f10f423dde9221e47c7a8b', 'salesforce/metadata/connections/62f10f423dde9221e47c7a8b/sObjectTypes/', {
      refreshCache: true,
    }));
  });
});
