
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import FlowScheduleButtons from './Buttons';
import { runServer } from '../../test/api/server';

function customSchedule(props) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources.flows = [
      {
        _id: '626bdab2987bb423914b487d',
        lastModified: '2022-06-23T03:40:44.315Z',
        name: 'New flow',
        disabled: false,
        schedule: '? 5 0 ? * 1',
        timezone: 'Asia/Calcutta',
        _integrationId: '626bda66987bb423914b486f',
        skipRetries: false,
        pageProcessors: [
          {
            responseMapping: { fields: [], lists: [] },
            _importId: '626bdab2987bb423914b487b',
            type: 'import',
          },
        ],
        pageGenerators: [
          { _exportId: '626bdab2987bb423914b4879', skipRetries: false },
        ],
        createdAt: '2022-04-29T12:31:46.612Z',
        free: false,
        _sourceId: '626bda35987bb423914b4868',
        autoResolveMatchingTraceKeys: true,
      },
    ];
    draft.data.resources.integrations = [
      {
        _id: '626bda66987bb423914b486f',
        lastModified: '2022-04-29T12:31:49.587Z',
        name: 'development',
        description: 'demo integration',
        install: [],
        mode: 'settings',
        sandbox: false,
        _registeredConnectionIds: [
          '626bda95c087e064dcc7f501',
          '626bdaafc087e064dcc7f505',
        ],
        installSteps: [
          {
            name: 'REST API connection',
            completed: true,
            type: 'connection',
            sourceConnection: {
              type: 'http',
              name: 'REST API connection',
              http: { formType: 'rest' },
            },
          },
          {
            name: 'demo REST',
            completed: true,
            type: 'connection',
            sourceConnection: {
              type: 'http',
              name: 'demo REST',
              http: { formType: 'rest' },
            },
          },
          {
            name: 'Copy resources now from template zip',
            completed: true,
            type: 'template_zip',
            templateZip: true,
            isClone: true,
          },
        ],
        uninstallSteps: [],
        flowGroupings: [],
        createdAt: '2022-04-29T12:30:30.857Z',
        _sourceId: '626bd993987bb423914b484f',
      },
    ];
    draft.session.form = {'flow-schedule': {
      fields: { timeZone: {
        id: 'timeZone',
        name: 'timeZone',
        type: 'select',
        label: 'Time zone',
        helpKey: 'flow.timezone',
        defaultValue: 'Asia/Calcutta',
        options: [
          {
            items: [
              {
                label: '(GMT-12:00) International Date Line West',
                value: 'Etc/GMT+12',
              },
              {
                label: '(GMT-11:00) Midway Island, Samoa',
                value: 'Pacific/Samoa',
              },

            ],
          },
        ],
        visible: true,
        defaultVisible: true,
        value: 'Asia/Calcutta',
        touched: false,
        required: false,
        disabled: false,
        isValid: true,
        isDiscretelyInvalid: false,
        errorMessages: '',
      },
      activeTab: {
        id: 'activeTab',
        name: 'activeTab',
        type: 'radiogroup',
        helpKey: 'flow.type',
        label: 'Type',
        fullWidth: true,
        defaultValue: 'preset',
        options: [
          {
            items: [
              {
                label: 'Use preset',
                value: 'preset',
              },
              {
                label: 'Use cron expression',
                value: 'advanced',
              },
            ],
          },
        ],
        value: 'preset',
        touched: props.touched,
        visible: true,
        required: false,
        disabled: false,
        isValid: true,
        isDiscretelyInvalid: false,
        errorMessages: '',
      }}},
    };
    draft.session.asyncTask['flow-schedule'] = {status: props.loadingStatus};
  });
  const ui = (
    <MemoryRouter>
      <FlowScheduleButtons {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('./util', () => ({
  ...jest.requireActual('./util'),
  getScheduleStartMinute: () => 0,
}));
describe('Flow schedule buttons UI tests', () => {
  runServer();
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
  test('should render the  save and close buttons initially', async () => {
    const mockOnClose = jest.fn();

    customSchedule({
      formKey: 'flow-schedule',
      flow: null,
      onClose: mockOnClose,
      pg: {_exportId: '626bdab2987bb423914b4879'},
      index: null,
      testFlag: true,
      touched: false,
    });
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });
  test('should display the saving... meessage on the button when form asyncStatus is loading', () => {
    const mockOnClose = jest.fn();

    customSchedule({
      formKey: 'flow-schedule',
      flow: null,
      onClose: mockOnClose,
      pg: {_exportId: '626bdab2987bb423914b4879'},
      index: null,
      testFlag: true,
      touched: false,
      loadingStatus: 'loading',
    });
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });
  test('should display the "Save & Close" button when form has been modified', () => {
    const mockOnClose = jest.fn();

    customSchedule({
      formKey: 'flow-schedule',
      flow: null,
      onClose: mockOnClose,
      pg: {_exportId: '626bdab2987bb423914b4879'},
      index: null,
      testFlag: true,
      touched: true,
    });
    expect(screen.getByText('Save & close')).toBeInTheDocument();
  });
  test('should make a dispatch call when clicked on the save button', async () => {
    const mockOnClose = jest.fn();

    customSchedule({
      formKey: 'flow-schedule',
      flow: null,
      onClose: mockOnClose,
      pg: {_exportId: '626bdab2987bb423914b4879'},
      index: null,
      testFlag: true,
      touched: true,
    });
    const saveButton = screen.getByText('Save');

    expect(saveButton).toBeInTheDocument();
    await userEvent.click(saveButton);
    expect(mockDispatchFn).toBeCalledTimes(1);
  });
});
