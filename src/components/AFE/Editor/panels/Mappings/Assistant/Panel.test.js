import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../../../actions';
import PreviewPanelWrapper from './Panel';
import { getCreatedStore } from '../../../../../../store';
import { mutateStore, renderWithProviders } from '../../../../../../test/test-utils';

const initialStore = getCreatedStore();

jest.mock('react-frame-component', () => ({
  __esModule: true,
  ...jest.requireActual('react-frame-component'),
  default: props => (
    <>
      {props.children}
    </>

  ),
}));

jest.mock('../../../../../SalesforceMappingAssistant', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../SalesforceMappingAssistant'),
  default: props => (
    <>
      <button type="button" onClick={() => props.onFieldClick({id: 'demoId'})}>Salesforce Assistant</button>
    </>

  ),
}));
jest.mock('../../../../../NetSuiteMappingAssistant', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../NetSuiteMappingAssistant'),
  default: props => (
    <>
      <button type="button" onClick={() => props.onFieldClick({id: 'demoId', sublistName: 'demoName'})}>Netsuite Assistant</button>
    </>

  ),
}));
function initPanelWrapper(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.editors = {
      filecsv: {
        fieldId: 'file.csv',
        formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
        resourceId: '5efd86a81657644d12e8ede3',
        resourceType: 'imports',
        data: 'custom data',
        editorType: 'jsonParser',
      },
      filescsv: {
        resourceId: '5efd86a71657644d12e8edb8',
      },
      file1csv: {
        resourceId: '5efd86a71657644d12e8edb9',
      }};
    draft.session.form = {'imports-5efd86a81657644d12e8ede3': { fields: {
      'file.csv': {
        disabled: props.disabled,
      },
    },
    }};
    draft.session.mapping = {mapping: {preview: {
      status: 'received',
      data: [
        {
          allOrNone: true,
          compositeRequest: [
            {
              body: {
                allOrNone: true,
                records: [
                  {
                    attributes: {
                      type: 'Product2',
                    },
                    Name: 'displayname',
                    ProductCode: 'displayname',
                    IsActive: 'true',
                  },
                ],
              },
              method: 'POST',
              referenceId: 'refProduct2',
              url: '/services/data/v54.0/composite/sobjects',
            },
          ],
        },
      ],
    },
    status: props.status }};
    draft.session.metadata.application = {'5efd8663a56953365bd28541': {
      'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote': {
        data: {searchLayoutable: true},
      },
    },
    };
    draft.data.resources = {
      imports: [
        {
          _id: '5efd86a81657644d12e8ede3',
          name: 'Import Salesforce quotes',
          _connectionId: '5efd8663a56953365bd28541',
          salesforce: {
            operation: 'update',
            sObjectType: 'Quote',
            api: 'soap',
            idLookup: {
              whereClause: '(Id = {{{id Id}}})',
            },
            removeNonSubmittableFields: false,
          },
          adaptorType: 'SalesforceImport',
        },
        {
          _id: '5efd86a71657644d12e8edb8',
          name: 'Import NetSuite attachments into quotes',
          _connectionId: '5efd8648a56953365bd28538',
          netsuite: {
            operation: 'attach',
            recordType: 'estimate',
          },
          adaptorType: 'NetSuiteImport',
        },
        {
          _id: '5efd86a71657644d12e8edb9',
        }],
    };
  });

  return renderWithProviders(<PreviewPanelWrapper {...props} />, {initialStore});
}

describe('previewPanelWrapper UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should render the salesforce assistant when import is of adaptorType Salesforce', async () => {
    initPanelWrapper({editorId: 'filecsv', disabled: false, status: 'received'});
    expect(screen.getByText('Salesforce Assistant')).toBeInTheDocument();  // Mocked Component is rendered
  });
  test('should render the netsuite assistant when import is of adaptorType Salesforce', () => {
    initPanelWrapper({editorId: 'filescsv', disabled: false, status: 'received'});
    expect(screen.getByText('Netsuite Assistant')).toBeInTheDocument();    // Mocked Component is rendered
  });
  test('should render an empty DOM when mappingPreviewType is not defined', () => {
    const {utils} = initPanelWrapper({editorId: 'file1csv', disabled: false, status: 'received'});

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should make the respective dispatch call when a salesforceMappingAssistant field is clicked', async () => {
    initPanelWrapper({editorId: 'filecsv', disabled: false, status: 'received'});
    await userEvent.click(screen.getByText('Salesforce Assistant'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.patchGenerateThroughAssistant('demoId'));
  });
  test('should make the respective dispatch call when a NetsuiteMappingAssistant field is clicked', async () => {
    initPanelWrapper({editorId: 'filescsv', disabled: false, status: 'received'});
    await userEvent.click(screen.getByText('Netsuite Assistant'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.patchGenerateThroughAssistant('demoName[*].demoId'));
  });
  test('should display the error message when mappingStatus is error', () => {
    initPanelWrapper({editorId: 'filescsv', disabled: false, status: 'error'});
    expect(screen.getByText('Failed to load mapping.')).toBeInTheDocument();
  });
});
