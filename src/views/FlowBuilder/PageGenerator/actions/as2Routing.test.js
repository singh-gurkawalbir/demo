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
  sampleData: "ISA*02*SW810 *00* *01*84EXAMPLE *12*84SENDERID *070820*2220*U*00200*051762203*0*P*>~\nGS*IN*84EXAMPLE*84SENDERID*20070820*2220*82062178*X*004010~\nST*810*621782659~\nBIG*20070820*70873910101*20070816*6P31195* * * ~\nREF*CO*821210~\nN1*ST*84 LUMBER COMANY*92*0420~\nN3*US~\nN4*UAE*LA*92* *0420*6785~\nITD* * *1*20070830* *20070831* *10679* * * *1% 10/N11 ADI~\nDTM*011*20070820~\nIT1*1*7.56*TM*387*UM*IN*20610-01*PD*2 X 6 - 10', SPRUCE/PINE/FIR, #2 & BTR, KD-HT, S*VN*26.10~\nIT3*756*PC~\nIT1*2*2.268*TM*387*UM*IN*20612-01*PD*2 X 6 - 12', SPRUCE/PINE/FIR, #2 & BTR, KD-HT, S*VN*26.12~\nIT3*189*PC~\nIT1*3*2.646*TM*387*UM*IN*20614-01*PD*2 X 6 - 14', SPRUCE/PINE/FIR, #2 & BTR, KD-HT, S*VN*26.14~\nIT3*189*PC~\nIT1*4*15.12*TM*387*UM*IN*20616-01*PD*2 X 6 - 16', SPRUCE/PINE/FIR, #2 & BTR, KD-HT, S*VN*26.16~\nIT3*945*PC~\nPID*Polo* * * *V-shape~\nTDS*1067888~\nSAC*C****-31400* * * * * * * * * *PALLET CREDIT~\nCTT*4*27.594~\nSE*18*621782659~\nGE*1*82062178~\nIEA*1*051762203~",
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
