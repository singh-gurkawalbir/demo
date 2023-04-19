
import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import actions from '../../../../actions';
import DynaUploadFile from './index';
import { mutateStore, reduxStore, renderWithProviders } from '../../../../test/test-utils';

const MockOnFieldChange = jest.fn();
const initialStore = reduxStore;

function initDynaUploadFile(props = {}) {
  const ui = (
    <DynaUploadFile {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('dynaupload file UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should make dispatch calls for uploading a file', () => {
    mutateStore(initialStore, draft => {
      draft.session.fileUpload = {
        '5ff7c471f08d35214ed1a7a7-uploadFile': { status: 'received',
          file: {
            fileName: 'fileA.csv',
            type: 'csv',
          },
          name: 'fileA' },
      };
      draft.session.integrationApps.utility = {
        '5df0b6c26dc1ab40a677cf45': {
          runKey: 'somerunkey',
          status: 'received',
        },
      };
    });
    const data = {
      id: 'uploadFile',
      maxSize: '574 bytes',
      resourceId: '5ff7c471f08d35214ed1a7a7',
      resourceType: 'exports',
      onFieldChange: MockOnFieldChange,
      sendS3Key: undefined,
      formKey: 'exports-5ff7c471f08d35214ed1a7a7',
      isIAField: undefined,
      placeholder: 'Sample file (that would be parsed)',
      _integrationId: '5df0b6c26dc1ab40a677cf45',
      childId: 'somechildId',
    };

    initDynaUploadFile(data);
    expect(MockOnFieldChange).toHaveBeenCalledWith('uploadFile', 'somerunkey');
    expect(mockDispatch).toHaveBeenCalledWith(actions.integrationApp.utility.clearRunKey('5df0b6c26dc1ab40a677cf45'));
    expect(MockOnFieldChange).toHaveBeenCalledWith('uploadFile', {fileName: 'fileA.csv', type: 'csv'});
    expect(mockDispatch).toHaveBeenCalledWith(actions.resourceFormSampleData.request('exports-5ff7c471f08d35214ed1a7a7'));
    expect(screen.getByText('Sample file (that would be parsed)')).toBeInTheDocument();
    expect(screen.getByText('Choose file')).toBeInTheDocument();
    expect(screen.getByText('fileA')).toBeInTheDocument();
    const input = document.querySelector('input[data-test="uploadFile"]');

    expect(input.files).toHaveLength(0);
    const file = new File(['test'], 'sample1.csv', {
      type: 'csv',
    });

    // userEvent.upload(input, file);
    fireEvent.change(input, { target: { files: { item: () => file, length: 1, 0: file } } });
    expect(input.files).toHaveLength(1);
    expect(input.files[0].name).toBe('sample1.csv');
    expect(mockDispatch).toHaveBeenCalledWith(actions.file.processFile(
      { file,
        fileId: '5ff7c471f08d35214ed1a7a7-uploadFile',
        fileProps: {
          maxSize: '574 bytes',
        },
        fileType: ''}
    ));
  });
  test('should test uploading of file with row delimiter', () => {
    mutateStore(initialStore, draft => {
      draft.session.fileUpload = {
        '5ff7c471f08d35214ed1a7a7-uploadFile': { status: 'received',
          file: "{name:file2.csv,size:'50bytes',type:'csv'}\r",
          rawFile: {
            name: 'file2.csv',
            size: '50 bytes',
            type: 'csv',
          },
          name: 'fileA' },
      };
      draft.session.integrationApps.utility = {
        '5df0b6c26dc1ab40a677cf45': {
          runKey: 'somerunkey',
          status: 'received',
        },
      };
    });
    const data = {
      id: 'uploadFile',
      maxSize: '574 bytes',
      resourceId: '5ff7c471f08d35214ed1a7a7',
      resourceType: 'exports',
      onFieldChange: MockOnFieldChange,
      sendS3Key: undefined,
      formKey: 'exports-5ff7c471f08d35214ed1a7a7',
      isIAField: true,
      placeholder: 'Sample file (that would be parsed)',
      _integrationId: '5df0b6c26dc1ab40a677cf45',
      childId: 'somechildId',
      options: 'csv',
      mode: 'csv',
    };

    initDynaUploadFile(data);
    expect(MockOnFieldChange).toHaveBeenCalledWith('uploadFile', 'somerunkey');
    expect(mockDispatch).toHaveBeenCalledWith(actions.integrationApp.utility.clearRunKey('5df0b6c26dc1ab40a677cf45'));
    expect(MockOnFieldChange).toHaveBeenCalledWith('uploadFile', {
      file: "{name:file2.csv,size:'50bytes',type:'csv'}\r",
      type: 'file',
      rawFile: { name: 'file2.csv', size: '50 bytes', type: 'csv' },
      rowDelimiter: '\r',
      fileProps: {
        name: 'file2.csv',
        size: '50 bytes',
        type: 'csv',
      },
    });
    expect(mockDispatch).toHaveBeenCalledWith(actions.resourceFormSampleData.request('exports-5ff7c471f08d35214ed1a7a7'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.resourceFormSampleData.clear('5ff7c471f08d35214ed1a7a7'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.file.reset('5ff7c471f08d35214ed1a7a7-uploadFile'));
    expect(MockOnFieldChange).toHaveBeenCalledWith('uploadFile', '', true);

    expect(screen.getByText('Sample file (that would be parsed)')).toBeInTheDocument();
    expect(screen.getByText('Choose file')).toBeInTheDocument();
    expect(screen.getByText('No file chosen')).toBeInTheDocument();
    const input = document.querySelector('input[data-test="uploadFile"]');

    expect(input.files).toHaveLength(0);
    const file = new File(['test'], 'sample1.csv', {
      type: 'csv',
    });

    // userEvent.upload(input, file);
    fireEvent.change(input, { target: { files: { item: () => file, length: 1, 0: file } } });
    expect(input.files).toHaveLength(1);
    expect(input.files[0].name).toBe('sample1.csv');
    expect(mockDispatch).toHaveBeenCalledWith(actions.file.processFile(
      { file,
        fileId: '5ff7c471f08d35214ed1a7a7-uploadFile',
        fileProps: {
          maxSize: '574 bytes',
        },
        fileType: 'csv'}
    ));
  });
  test('should test uploading of file with row delimiter  with s3 send key', () => {
    mutateStore(initialStore, draft => {
      draft.session.fileUpload = {
        '5ff7c471f08d35214ed1a7a7-uploadFile': { status: 'received',
          file: "{name:file2.csv,size:'50bytes',type:'csv'}\r\n",
          rawFile: {
            name: 'file2.csv',
            size: '50 bytes',
            type: 'csv',
          },
          name: 'fileA' },
      };
      draft.session.integrationApps.utility = {
        '5df0b6c26dc1ab40a677cf45': {
          runKey: 'somerunkey',
          status: 'received',
        },
      };
    });
    const data = {
      id: 'uploadFile',
      maxSize: '574 bytes',
      resourceId: '5ff7c471f08d35214ed1a7a7',
      resourceType: 'exports',
      onFieldChange: MockOnFieldChange,
      sendS3Key: true,
      formKey: 'exports-5ff7c471f08d35214ed1a7a7',
      isIAField: true,
      placeholder: 'Sample file (that would be parsed)',
      _integrationId: '5df0b6c26dc1ab40a677cf45',
      childId: 'somechildId',
      options: 'csv',
      mode: 'csv',
    };

    initDynaUploadFile(data);
    expect(MockOnFieldChange).toHaveBeenCalledWith('uploadFile', 'somerunkey');
    expect(mockDispatch).toHaveBeenCalledWith(actions.integrationApp.utility.clearRunKey('5df0b6c26dc1ab40a677cf45'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.integrationApp.utility.requestS3Key(
      {
        integrationId: '5df0b6c26dc1ab40a677cf45',
        childId: 'somechildId',
        file: "{name:file2.csv,size:'50bytes',type:'csv'}\r\n",
        fileName: 'file2.csv',
        fileType: 'csv',
      }
    ));
    expect(mockDispatch).toHaveBeenCalledWith(actions.resourceFormSampleData.request('exports-5ff7c471f08d35214ed1a7a7'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.resourceFormSampleData.clear('5ff7c471f08d35214ed1a7a7'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.file.reset('5ff7c471f08d35214ed1a7a7-uploadFile'));
    expect(MockOnFieldChange).toHaveBeenCalledWith('uploadFile', '', true);

    expect(screen.getByText('Sample file (that would be parsed)')).toBeInTheDocument();
    expect(screen.getByText('Choose file')).toBeInTheDocument();
    expect(screen.getByText('No file chosen')).toBeInTheDocument();
    const input = document.querySelector('input[data-test="uploadFile"]');

    expect(input.files).toHaveLength(0);
    const file = new File(['test'], 'sample1.csv', {
      type: 'csv',
    });

    // userEvent.upload(input, file);
    fireEvent.change(input, { target: { files: { item: () => file, length: 1, 0: file } } });
    expect(input.files).toHaveLength(1);
    expect(input.files[0].name).toBe('sample1.csv');
    expect(mockDispatch).toHaveBeenCalledWith(actions.file.processFile(
      { file,
        fileId: '5ff7c471f08d35214ed1a7a7-uploadFile',
        fileProps: {
          maxSize: '574 bytes',
        },
        fileType: 'csv'}
    ));
  });
  test('should test uploading of file with row delimiter  for other applications other than s3', () => {
    mutateStore(initialStore, draft => {
      draft.session.fileUpload = {
        '5ff7c471f08d35214ed1a7a7-uploadFile': { status: 'received',
          file: "{name:file2.csv,size:'50bytes',type:'csv'}\r\n",
          rawFile: {
            name: 'file2.csv',
            size: '50 bytes',
            type: 'csv',
          },
          name: 'fileA' },
      };
      draft.session.integrationApps.utility = {
        '5df0b6c26dc1ab40a677cf45': {
          runKey: 'somerunkey',
          status: 'requested',
        },
      };
    });
    const data = {
      id: 'uploadFile',
      maxSize: '574 bytes',
      resourceId: '5ff7c471f08d35214ed1a7a7',
      resourceType: 'exports',
      onFieldChange: MockOnFieldChange,
      sendS3Key: undefined,
      formKey: 'exports-5ff7c471f08d35214ed1a7a7',
      isIAField: true,
      placeholder: 'Sample file (that would be parsed)',
      _integrationId: '5df0b6c26dc1ab40a677cf45',
      childId: 'somechildId',
      options: 'csv',
      mode: 'csv',
    };

    initDynaUploadFile(data);
    expect(MockOnFieldChange).toHaveBeenCalledWith('uploadFile', 'somerunkey');
    expect(mockDispatch).toHaveBeenCalledWith(actions.integrationApp.utility.clearRunKey('5df0b6c26dc1ab40a677cf45'));
    expect(MockOnFieldChange).toHaveBeenCalledWith('uploadFile', {
      file: "{name:file2.csv,size:'50bytes',type:'csv'}\r\n",
      type: 'file',
      rawFile: { name: 'file2.csv', size: '50 bytes', type: 'csv' },
      rowDelimiter: '\r\n',
      fileProps: {
        name: 'file2.csv',
        size: '50 bytes',
        type: 'csv',
      },
    });
    expect(mockDispatch).toHaveBeenCalledWith(actions.resourceFormSampleData.request('exports-5ff7c471f08d35214ed1a7a7'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.resourceFormSampleData.clear('5ff7c471f08d35214ed1a7a7'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.file.reset('5ff7c471f08d35214ed1a7a7-uploadFile'));
    expect(MockOnFieldChange).toHaveBeenCalledWith('uploadFile', '', true);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should test uploading of file is in progress', () => {
    mutateStore(initialStore, draft => {
      draft.session.fileUpload = {
        '5ff7c471f08d35214ed1a7a7-uploadFile': { status: 'received',
          file: "{name:file2.csv,size:'50bytes',type:'csv'}\n",
          rawFile: {
            name: 'file2.csv',
            size: '50 bytes',
            type: 'csv',
          },
          name: 'fileA' },
      };
      draft.session.integrationApps.utility = {
        '5df0b6c26dc1ab40a677cf45': {
          runKey: 'somerunkey',
          status: 'requested',
        },
      };
    });
    const data = {
      id: 'uploadFile',
      maxSize: '574 bytes',
      resourceId: '5ff7c471f08d35214ed1a7a7',
      resourceType: 'exports',
      onFieldChange: MockOnFieldChange,
      sendS3Key: undefined,
      formKey: 'exports-5ff7c471f08d35214ed1a7a7',
      isIAField: true,
      _integrationId: '5df0b6c26dc1ab40a677cf45',
      childId: 'somechildId',
      options: 'csv',
      mode: 'csv',
    };

    initDynaUploadFile(data);
    expect(MockOnFieldChange).toHaveBeenCalledWith('uploadFile', 'somerunkey');
    expect(mockDispatch).toHaveBeenCalledWith(actions.integrationApp.utility.clearRunKey('5df0b6c26dc1ab40a677cf45'));
    expect(MockOnFieldChange).toHaveBeenCalledWith('uploadFile', {
      file: "{name:file2.csv,size:'50bytes',type:'csv'}\n",
      type: 'file',
      rawFile: { name: 'file2.csv', size: '50 bytes', type: 'csv' },
      rowDelimiter: '\n',
      fileProps: {
        name: 'file2.csv',
        size: '50 bytes',
        type: 'csv',
      },
    });
    expect(mockDispatch).toHaveBeenCalledWith(actions.resourceFormSampleData.request('exports-5ff7c471f08d35214ed1a7a7'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.resourceFormSampleData.clear('5ff7c471f08d35214ed1a7a7'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.file.reset('5ff7c471f08d35214ed1a7a7-uploadFile'));
    expect(MockOnFieldChange).toHaveBeenCalledWith('uploadFile', '', true);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
