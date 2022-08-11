/* global describe, test, expect, jest, beforeEach */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import as2Routing from './as2Routing';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm'),
  default: props => {
    function onRemount() { props.remountAfterSaveFn(); }

    return (
      <>
        <button type="button" onClick={props.onSave}>Save</button>
        <button type="button" onClick={props.onClose}>Close</button>
        <button type="button" onClick={onRemount}>RemountAfterSaveButton</button>
      </>
    );
  },
}));

jest.mock('../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/LoadResources'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));

jest.mock('../../../../components/DynaForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/DynaForm'),
  default: props => (
    <div>
      {props.formKey}
    </div>
  ),
}));

const as2resource = {
  _id: '62f366470260bf5b28b555ea',
  createdAt: '2022-08-10T08:03:19.917Z',
  lastModified: '2022-08-10T08:03:20.057Z',
  name: 'second',
  _connectionId: '62f24d45f8b63672312cd561',
  apiIdentifier: 'ef31ec02af',
  asynchronous: true,
  type: 'webhook',
  oneToMany: false,
  sandbox: false,
  parsers: [],
  file: {
    type: 'filedefinition',
    fileDefinition: {
      _fileDefinitionId: '62f36646726a104cda6a6a89',
    },
  },
  adaptorType: 'AS2Export',
};

const resource = {_connectionId: '5e7068331c056a75e6df19b2'};

const as2connections = [
  {
    _id: '62f24d45f8b63672312cd561',
    createdAt: '2022-08-09T12:04:21.456Z',
    lastModified: '2022-08-09T12:04:21.551Z',
    type: 'as2',
    name: 'weev',
    sandbox: false,
    as2: {
      as2Id: 'awrvrv',
      contentBasedFlowRouter: {_scriptId: 'some_scriptId'},
      partnerId: 'wqefwef',
      unencrypted: {
        partnerCertificate: 'qd3d',
        userPublicKey: 'q3FDWF',
      },
      preventCanonicalization: false,
      partnerStationInfo: {
        as2URI: 'https://www.qwrvre.com',
        mdn: {
          mdnSigning: 'NONE',
        },
        signing: 'MD5',
        encryptionType: 'AES128',
        encoding: 'base64',
        signatureEncoding: 'base64',
        auth: {
          type: 'basic',
          basic: {
            username: 'qed3w',
            password: '******',
          },
        },
      },
      userStationInfo: {
        mdn: {
          mdnSigning: 'MD5',
          mdnEncoding: 'base64',
        },
        signing: 'MD5',
        encryptionType: '3DES',
        encoding: 'base64',
      },
    },
  },
];

describe('ExportHooks UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should test name, position and helpKey', () => {
    const {helpKey, name, position} = as2Routing;

    expect(name).toBe('as2Routing');
    expect(position).toBe('left');
    expect(helpKey).toBe('fb.pg.exports.as2routing');
  });
  test('should test as2Routing component Close button', () => {
    const {Component} = as2Routing;
    const onClose = jest.fn();

    renderWithProviders(
      <Component
        resource={resource}
        open
        isViewMode={false}
        onClose={onClose}
    />);

    expect(screen.getByText('AS2 connection routing rules')).toBeInTheDocument();
    userEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
  test('should click on submit button', () => {
    const {Component} = as2Routing;
    const onClose = jest.fn();

    const initialStore = getCreatedStore();

    initialStore.getState().session.form.as2Routing = {value: {contentBasedFlowRouter: {_scriptId: 'someScriptId', function: 'someFunction'}}};

    renderWithProviders(
      <Component
        resource={as2resource}
        open
        isViewMode={false}
        onClose={onClose}
    />, {initialStore});

    expect(screen.getByText('AS2 connection routing rules')).toBeInTheDocument();
    userEvent.click(screen.getByText('Save'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_PATCH',
        resourceType: 'connections',
        id: '62f24d45f8b63672312cd561',
        patchSet: [
          {
            op: 'replace',
            path: '/as2/contentBasedFlowRouter/_scriptId',
            value: 'someScriptId',
          },
          {
            op: 'replace',
            path: '/as2/contentBasedFlowRouter/function',
            value: 'someFunction',
          },
        ],
        asyncKey: 'as2Routing',
      }
    );
  });
  test('should text onRemount button', () => {
    const {Component} = as2Routing;
    const onClose = jest.fn();

    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = as2connections;

    renderWithProviders(
      <Component
        resource={as2resource}
        open
        isViewMode={false}
        onClose={onClose}
    />, {initialStore});

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'FORM_INIT',
        formKey: 'as2Routing',
        formSpecificProps: {conditionalUpdate: undefined,
          disabled: false,
          fieldMeta: {fieldMap: {'as2.contentBasedFlowRouter':
           {defaultValue: {
             _scriptId: 'some_scriptId',
           },
           editorResultMode: 'text',
           hookStage: 'contentBasedFlowRouter',
           hookType: 'script',
           id: 'as2.contentBasedFlowRouter',
           label: 'Choose a script and function name to use for determining AS2 message routing',
           name: 'contentBasedFlowRouter',
           preHookData: {httpHeaders:
              {'as2-from': 'OpenAS2_appA', 'as2-to': 'OpenAS2_appB'},
           mimeHeaders: {'content-disposition': 'Attachment; filename=rfc1767.dat', 'content-type': 'application/edi-x12'},
           rawMessageBody: 'sample message'},
           type: 'hook'}},
          layout: {fields: ['as2.contentBasedFlowRouter']}},
          optionsHandler: undefined,
          parentContext: {},
          showValidationBeforeTouched: undefined,
          validationHandler: undefined},
        remountKey: 0}
    );
    userEvent.click(screen.getByText('RemountAfterSaveButton'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'FORM_INIT',
        formKey: 'as2Routing',
        formSpecificProps: {conditionalUpdate: undefined,
          disabled: false,
          fieldMeta: {fieldMap: {'as2.contentBasedFlowRouter':
           {defaultValue: {
             _scriptId: 'some_scriptId',
           },
           editorResultMode: 'text',
           hookStage: 'contentBasedFlowRouter',
           hookType: 'script',
           id: 'as2.contentBasedFlowRouter',
           label: 'Choose a script and function name to use for determining AS2 message routing',
           name: 'contentBasedFlowRouter',
           preHookData: {httpHeaders:
              {'as2-from': 'OpenAS2_appA', 'as2-to': 'OpenAS2_appB'},
           mimeHeaders: {'content-disposition': 'Attachment; filename=rfc1767.dat', 'content-type': 'application/edi-x12'},
           rawMessageBody: 'sample message'},
           type: 'hook'}},
          layout: {fields: ['as2.contentBasedFlowRouter']}},
          optionsHandler: undefined,
          parentContext: {},
          showValidationBeforeTouched: undefined,
          validationHandler: undefined},
        remountKey: 1}
    );
  });
});
