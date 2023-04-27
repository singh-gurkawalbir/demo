
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen} from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import DynaMultiSubsidiaryMapping from './DynaMultiSubsidiaryMapping';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import actions from '../../../../actions';

const mockDispatchFn = jest.fn();
const initialStore = reduxStore;

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

function initDynaMultiSubsidiaryMapping(props = {}) {
  const ui = (
    <DynaMultiSubsidiaryMapping {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}
const genralProps = {
  label: '',
  value: [{export: 's1', subsidiary: 'Honeycomb Inc1'}, {export: 's2', subsidiary: 'Honeycomb Inc2'}, {export: 's3', subsidiary: 'Honeycomb Inc3'}, {export: 's4', subsidiary: 'Honeycomb Inc4'}],
  className: 'someclassName',
  optionsMap: [{
    id: 'export',
    label: 'Export field value',
    options: undefined,
    readOnly: false,
    required: false,
    supportsRefresh: false,
    type: 'input',
  }, {
    id: 'subsidiary',
    label: 'Import field value',
    options: undefined,
    readOnly: false,
    required: false,
    supportsRefresh: false,
    type: 'input',
  }],
  id: 'someid',
  disableDeleteRows: false,
  handleCleanupHandler: () => {},
  _integrationId: 'someintegrationId',
  formKey: 'form_key',
};

mutateStore(initialStore, draft => {
  draft.session.connectors = {
    someintegrationId: {
      someid: {
        isLoading: false,
        shouldReset: false,
        data: {optionsMap: [{id: 'export', label: 'Export field value', options: undefined, readOnly: false, required: true, type: 'input', multiline: false}, {id: 'subsidiary', label: 'Import field value', options: undefined, readOnly: false, required: true, type: 'input', multiline: false}],
        },
        fieldType: 'somefieldtype',
      },
    },
  };
  draft.session.form[genralProps.formKey] = {
    showValidationBeforeTouched: true,
  };
});
describe('dynaMultiSubsidiaryMapping UI test cases', () => {
  test('should populate the saved values and refreshing the fields of exports', async () => {
    initDynaMultiSubsidiaryMapping(genralProps);
    expect(screen.getByText('Export field value')).toBeInTheDocument();
    expect(screen.getByText('Import field value')).toBeInTheDocument();
    expect(screen.getByDisplayValue('s1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Honeycomb Inc1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('s2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Honeycomb Inc2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('s3')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Honeycomb Inc3')).toBeInTheDocument();
    expect(screen.getByDisplayValue('s4')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Honeycomb Inc4')).toBeInTheDocument();
    await userEvent.click(document.querySelector('.makeStyles-refreshIcon-11'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.connectors.refreshMetadata('subsidiary', 'someid', 'someintegrationId', {
      key: 'columnName',
    }));
  });
  test('should call the cleanup function when the component is unmount', () => {
    const { utils: { unmount } } = initDynaMultiSubsidiaryMapping(genralProps);

    unmount();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.connectors.clearMetadata('someid', 'someintegrationId'));
  });
  test('should populate the saved values when the data in the store is set to empty', () => {
    const genralProps = {
      label: '',
      value: [{export: 's1', subsidiary: 'Honeycomb Inc1'}, {export: 's2', subsidiary: 'Honeycomb Inc2'}, {export: 's3', subsidiary: 'Honeycomb Inc3'}, {export: 's4', subsidiary: 'Honeycomb Inc4'}],
      className: 'someclassName',
      optionsMap: [{
        id: 'export',
        label: 'Export field value',
        options: undefined,
        readOnly: false,
        required: false,
        type: 'input',
      }, {
        id: 'import',
        label: 'Import field value',
        options: undefined,
        readOnly: false,
        required: false,
        supportsRefresh: true,
        type: 'input',
      }],
      id: 'someid',
      disableDeleteRows: false,
      handleCleanupHandler: () => {},
      _integrationId: 'someintegrationId',
      formKey: 'formKey',
    };

    mutateStore(initialStore, draft => {
      draft.session.connectors = {
        someintegrationId: {
          someid: {
            isLoading: false,
            shouldReset: false,
            data: {},
          },
          fieldType: 'somefieldtype',
        },
      };
      draft.session.form[genralProps.formKey] = {
        showValidationBeforeTouched: true,
      };
    });
    initDynaMultiSubsidiaryMapping(genralProps);
    expect(screen.getByText('Export field value')).toBeInTheDocument();
    expect(screen.getByText('Import field value')).toBeInTheDocument();
    expect(screen.getByDisplayValue('s1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('s2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('s3')).toBeInTheDocument();
    expect(screen.getByDisplayValue('s4')).toBeInTheDocument();
  });
});
