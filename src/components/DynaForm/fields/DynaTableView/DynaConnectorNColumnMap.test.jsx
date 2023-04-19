
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen} from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import DynaConnectorNColumnMap from './DynaConnectorNColumnMap';
import actions from '../../../../actions';
import { mutateStore, reduxStore, renderWithProviders } from '../../../../test/test-utils';

const mockDispatchFn = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));
const initialStore = reduxStore;

function initDynaConnectorNColumnMap(props = {}) {
  const ui = (
    <DynaConnectorNColumnMap
      {...props}
    />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaConnectorNColumnMap UI test cases', () => {
  test('should verify table content and click on refresh button', async () => {
    const genralProps = {
      value: [{connectorexport: 'connector1', connectorimport: 'connector Test1'}, {connectorexport: 'connector2', connectorimport: 'connector Test2'}],
      optionsMap: [{id: 'connectorexport', label: 'connector export field value', options: undefined, readOnly: false, supportsRefresh: true, required: true, type: 'input', multiline: false}, {id: 'connectorimport', label: 'connector import field value', options: undefined, readOnly: false, required: true, supportsRefresh: true, type: 'input', multiline: false}],
      id: 'someid',
      _integrationId: 'someintegrationId',
      fieldType: 'somefieldtype',
      formKey: 'form_key',
    };

    mutateStore(initialStore, draft => {
      draft.session.connectors = {
        someintegrationId: {
          someid: {
            isLoading: false,
            shouldReset: false,
            data: {optionsMap: [{id: 'connectorexport', label: 'Connector Export field value', options: undefined, readOnly: false, required: true, type: 'input', multiline: false, supportsRefresh: true}, {id: 'connectorimport', label: 'Connector Import field value', options: undefined, readOnly: false, required: true, type: 'input', multiline: false, supportsRefresh: true}],
            },
            fieldType: 'somefieldtype',
          },
        },
      };
      draft.session.form[genralProps.formKey] = {
        showValidationBeforeTouched: true,
      };
    });

    initDynaConnectorNColumnMap(genralProps);
    expect(screen.getByText('Connector Export field value')).toBeInTheDocument();
    expect(screen.getByText('Connector Import field value')).toBeInTheDocument();
    expect(screen.getByDisplayValue('connector1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('connector Test1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('connector2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('connector Test2')).toBeInTheDocument();
    await userEvent.click(document.querySelector('svg'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.connectors.refreshMetadata('connectorexport', 'someid', 'someintegrationId'));
  });
});
