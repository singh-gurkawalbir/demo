import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import actions from '../../../../../actions';
import { getCreatedStore } from '../../../../../store';

import MappingAssistantTitle from './MappingAssistantTitle';

const initialStore = getCreatedStore();

function initMappingAssistantTitle(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {
      filecsv: {
        fieldId: 'file.csv',
        formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
        resourceId: '5efd86a81657644d12e8ede3',
        resourceType: 'imports',
        data: 'custom data',
        mappingPreviewType: 'salesforce',
        editorType: 'jsonParser',
      },
      filescsv: {
        mappingPreviewType: 'netsuite',
        resourceId: '5efd86a71657644d12e8edb8',
      },
      file1csv: {
        resourceId: '5efd86a71657644d12e8edb9',
      }};
    draft.session.metadata.application = {'5efd8663a56953365bd28541': {
      'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote': {
        data: {searchLayoutable: true, recordTypeInfos: [{master: true, recordTypeId: 'demoId'}]},
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
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<MappingAssistantTitle {...props} />, {initialStore});
}

describe('mappingAssistantTitle UI tests', () => {
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
  test('should pass the initial render for salesforce assistant', () => {
    initMappingAssistantTitle({editorId: 'filecsv'});
    expect(screen.getByText('Salesforce mapping assistant')).toBeInTheDocument();
    const refreshIcon = screen.getByLabelText('Refresh data');

    expect(refreshIcon).toBeInTheDocument();
  });
  test('should render the title for netsuite assistant when import adaptorType is "netsuite"', () => {
    initMappingAssistantTitle({editorId: 'filescsv'});
    expect(screen.getByText('NetSuite mapping assistant')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(1);               // 1 button indicates the presence of help icon and absence of refresh button for NS assistant //
  });
  test('should make a dispatch call when refresh button is clicked in salesforce assistant', async () => {
    const commMetaPath = 'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote/layouts?recordTypeId=demoId';

    initMappingAssistantTitle({editorId: 'filecsv'});
    const refreshIcon = screen.getByLabelText('Refresh data');

    expect(refreshIcon).toBeInTheDocument();
    await userEvent.click(refreshIcon);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.request('5efd8663a56953365bd28541', commMetaPath, {refreshCache: true})));
  });
});
