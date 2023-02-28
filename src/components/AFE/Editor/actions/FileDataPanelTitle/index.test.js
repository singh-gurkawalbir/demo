import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';

import FileDataPanelTitle from '.';

const initialStore = getCreatedStore();

async function initFileDataPanelTitle(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {
      filecsv: {
        fieldId: 'file.csv',
        formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
        resourceId: '5b3c75dd5d3c125c88b5dd20',
        resourceType: 'imports',
        isSuiteScriptData: true,
      },
      filescsv: {
        resourceId: '5b3c75dd5d3c125c88b5dd21',
        resourceType: 'exports',
        isSuiteScriptData: false,
      },
    };

    draft.data.resources = {imports: [
      {_id: '5b3c75dd5d3c125c88b5dd20',
        name: 'import1',
        adaptorType: 'FTPImport',
      },
    ],
    exports: [
      {_id: '5b3c75dd5d3c125c88b5dd21',
        name: 'export1',
        adaptorType: 'HTTPImport',
      },
    ],
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<FileDataPanelTitle {...props} />, {initialStore});
}

describe('fileDataPanelTitle UI tests', () => {
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
  test('should pass the initial render', async () => {
    await initFileDataPanelTitle({editorId: 'filecsv', fileType: 'csv'});
    expect(screen.getByText('Sample CSV file (that would be parsed)')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Choose file'})).toBeInTheDocument();
  });
  test('should make a dispatch call when clicked on the fileupload button', async () => {
    await initFileDataPanelTitle({editorId: 'filecsv', fileType: 'csv'});
    const file = new File(['test'], 'test.csv', {type: 'csv'});
    const uploadButton = document.querySelector('[type="file"]');

    expect(uploadButton).toBeInTheDocument();
    await userEvent.upload(uploadButton, file);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith({file, fileId: '5b3c75dd5d3c125c88b5dd20-uploadFile', fileProps: {maxSize: undefined}, fileType: 'csv', type: 'FILE_PROCESS'}));
  });
  test('should not render the uploadFile option for adaptorTypes other than ftp,s3 and simple', async () => {
    await initFileDataPanelTitle({editorId: 'filescsv', fileType: 'csv'});
    expect(screen.getByText('Sample CSV file')).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Choose file'})).toBeNull();
  });
});

