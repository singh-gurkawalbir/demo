import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import actions from '../../../../actions';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import RefreshableIntegrationAppSetting from './RefreshableIntegrationAppSetting';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

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

function initRefreshableIntegrationAppSetting(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.metadata = {application: {'5efd8663a56953365bd28541': {
      'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote': {
        data: props.data,
        status: 'success',
        errorMessage: 'Test Error Message',
      },
    },
    }};
    draft.session.connectors = {
      '6ced8663a56953365bd28541': {
        'demo fieldname': {
          data: {
            value: 'value1',
            options: [['value1', 'label1'], ['value2', 'label2'], ['value3', 'label3']],
          },
          isLoading: false,
        },
      },
    };
    draft.data.resources = {
      connections: [{
        _id: '5efd8663a56953365bd28541',
        offline: props.offline,
      }],
    };
  });

  return renderWithProviders(<RefreshableIntegrationAppSetting {...props} />, {initialStore});
}

describe('refreshableIntegrationAppSetting UI tests', () => {
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

  const mockonFieldChange = jest.fn();
  const props = {
    id: 'demo fieldname',
    _integrationId: '6ced8663a56953365bd28541',
    options: [{
      items: [{
        value: 'value1',
        label: 'label1',
      }],
    }],
    value: 'value1',
    properties: {yieldValueAndLabel: true},
    autoPostBack: false,
    ignoreValueUnset: true,
    fieldData: [],
    onFieldChange: mockonFieldChange,
    disabled: false,
  };

  test('should pass the initial render', () => {
    initRefreshableIntegrationAppSetting(props);
    const selectDropdown = screen.getByText('Please select');

    expect(selectDropdown).toBeInTheDocument();
    const refreshButton = document.querySelector('button[data-test="refreshResource"]');

    expect(refreshButton).toBeInTheDocument();
  });
  test('should open the dropdown when clicked on dropdown', async () => {
    initRefreshableIntegrationAppSetting(props);
    const dropDownValue = screen.getByText('Please select');

    expect(dropDownValue).toBeInTheDocument();
    await userEvent.click(dropDownValue);
    expect(screen.getByText('label1')).toBeInTheDocument();
    expect(screen.getByText('label2')).toBeInTheDocument();
    expect(screen.getByText('label3')).toBeInTheDocument();
  });
  test('should call the onFieldChange function when an option is selected from the dropdown', async () => {
    initRefreshableIntegrationAppSetting(props);
    const dropDownValue = screen.getByText('Please select');

    expect(dropDownValue).toBeInTheDocument();
    await userEvent.click(dropDownValue);
    const option = screen.getByText('label2');

    expect(option).toBeInTheDocument();
    await userEvent.click(option);
    expect(mockonFieldChange).toHaveBeenCalled();
  });
  test('should make a dispatch call when clicked on refresh button in the select', async () => {
    initRefreshableIntegrationAppSetting(props);
    const refreshButton = document.querySelector('[data-test="refreshResource"]');

    expect(refreshButton).toBeInTheDocument();
    await userEvent.click(refreshButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.connectors.refreshMetadata(null, 'demo fieldname', '6ced8663a56953365bd28541')));
  });
  test('should make a dispatch call when autoPostBack prop is true', async () => {
    initRefreshableIntegrationAppSetting({...props, autoPostBack: true});
    const dropDownValue = screen.getByText('Please select');

    expect(dropDownValue).toBeInTheDocument();
    await userEvent.click(dropDownValue);
    const option = screen.getByText('label2');

    expect(option).toBeInTheDocument();
    await userEvent.click(option);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.connectors.refreshMetadata('value2', 'demo fieldname', '6ced8663a56953365bd28541', {key: 'fieldValue', autoPostBack: true})));
    expect(mockonFieldChange).toHaveBeenCalled();
  });
});
