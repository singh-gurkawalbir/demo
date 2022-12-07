/* global describe, test, expect, jest, afterEach */
import React from 'react';
import {screen} from '@testing-library/react';
import {renderWithProviders, reduxStore} from '../../../../../../test/test-utils';
import ResponseMapping from './index';
import actions from '../../../../../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

function getInitialStore() {
  const initialStore = reduxStore;

  initialStore.getState().session.responseMapping = { mapping: {
    mappings: [
      {
        extract: 'id',
        generate: 'responseID',
        key: '54eajgANHf',
      },
    ],
    flowId: '62f0bdfaf8b63672312bbe36',
    resourceId: '62e6897976ce554057c0f28f',
    resourceType: 'imports',
    status: 'received',
  }};

  initialStore.getState().data.resources.flows = [
    {
      _id: '62f0bdfaf8b63672312bbe36',
      lastModified: '2022-12-05T06:24:06.995Z',
      name: 'Any NAME',
      disabled: true,
      schedule: '? 5 2 ? * 4',
      _integrationId: '629f0dcfccb94d35de6f436b',
      skipRetries: false,
      pageProcessors: [
        {
          responseMapping: {
            fields: [
              {
                extract: 'id',
                generate: 'responseID',
              },
            ],
            lists: [],
          },
          type: 'import',
          _importId: '62e6897976ce554057c0f28f',
        },
      ],
    },
  ];
  initialStore.getState().data.resources.imports = [
    {
      _id: '62e6897976ce554057c0f28f',
    },
  ];

  return initialStore;
}

describe('Response mappings test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show the spinner when status of response mapping is requested', () => {
    const initialStore = getInitialStore();

    initialStore.getState().session.responseMapping = { mapping: { status: 'requested' }};
    renderWithProviders(<ResponseMapping />, {initialStore});

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should show the error message as Failed to load result mapping when status of response mapping is error and resouce type import', () => {
    const initialStore = getInitialStore();

    initialStore.getState().session.responseMapping = { mapping: { status: 'error' }};
    const {utils} = renderWithProviders(<ResponseMapping />, {initialStore});

    expect(utils.container.textContent).toEqual('Failed to load response mapping.');
  });
  test('should show the error message as Failed to load result mapping when status of response mapping is error and resouce type exports', () => {
    const initialStore = getInitialStore();

    initialStore.getState().session.responseMapping = { mapping: { status: 'error' }};
    initialStore.getState().session.editors = { someeditorId: { resourceType: 'exports' }};

    const {utils} = renderWithProviders(<ResponseMapping editorId="someeditorId" />, {initialStore});

    expect(utils.container.textContent).toEqual('Failed to load results mapping.');
  });
  test('should show the Import response mapping fields', () => {
    const initialStore = getInitialStore();

    initialStore.getState().session.editors = { someeditorId: { resourceType: 'exports', flowId: '62f0bdfaf8b63672312bbe36', resourceId: '62e6897976ce554057c0f28f' }};

    renderWithProviders(<ResponseMapping editorId="someeditorId" />, {initialStore});

    expect(mockDispatch).toHaveBeenCalledWith(actions.responseMapping.init({
      flowId: '62f0bdfaf8b63672312bbe36',
      resourceId: '62e6897976ce554057c0f28f',
      resourceType: 'exports',
    }));

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'EDITOR_SAMPLEDATA_RECEIVED',
        id: 'responseMappings-62e6897976ce554057c0f28f',
        sampleData: '{\n' +
              '  "errors": [\n' +
              '    {\n' +
              '      "code": "error_code",\n' +
              '      "message": "error message",\n' +
              '      "source": "application"\n' +
              '    }\n' +
              '  ],\n' +
              '  "ignored": false,\n' +
              '  "statusCode": 200,\n' +
              '  "dataURI": ""\n' +
              '}',
        templateVersion: undefined,
      }
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.editor.patchFeatures('someeditorId', {undefined})
    );

    expect(screen.getByText('Source record field')).toBeInTheDocument();
    expect(screen.getByText('Import response', {exact: false})).toBeInTheDocument();
    const textboxes = screen.getAllByRole('textbox');
    const textContent = textboxes.map(each => each.textContent);

    expect(textContent).toEqual(['id', 'responseID', '', '']);
  });
  test('should show the Lookup response fields', () => {
    const initialStore = getInitialStore();

    initialStore.getState().session.responseMapping.mapping.resourceType = 'lookup';
    initialStore.getState().session.editors = { someeditorId: { resourceType: 'exports' }};

    renderWithProviders(<ResponseMapping editorId="someeditorId" />, {initialStore});

    expect(screen.getByText('Source record field')).toBeInTheDocument();
    expect(screen.getByText('Lookup response', {exact: false})).toBeInTheDocument();
    const textboxes = screen.getAllByRole('textbox');
    const textContent = textboxes.map(each => each.textContent);

    expect(textContent).toEqual(['id', 'responseID', '', '']);
  });
});
