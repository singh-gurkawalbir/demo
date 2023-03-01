
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen, waitFor} from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import DynaSuiteScriptUploadFile from './index';
import actions from '../../../../actions';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

const initialStore = reduxStore;
const mockDispatch = jest.fn();
const mockOnField = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

function initDynaSuiteScriptUploadFile(props = {}) {
  const ui = (
    <DynaSuiteScriptUploadFile {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaSuiteScriptUploadFile UI test cases', () => {
  test('should make dispatch calls when status is set to received and persistData is set to false and reset with no files and uploaded a file', async () => {
    mutateStore(initialStore, draft => {
      draft.session.fileUpload = {
        '6386915c8dab534c4614b941-uploadFile': { status: 'received',
          file: {
            fileName: 'fileA.csv',
            type: 'csv',
          },
          name: 'fileA' },
      };
    });
    const data = {
      id: 'uploadFile',
      maxSize: '4 KB',
      resourceId: '6386915c8dab534c4614b941',
      resourceType: 'exports',
      onFieldChange: mockOnField,
      placeholder: 'Sample file (that would be parsed)',
      formKey: 'exports-6386915c8dab534c4614b941',
    };

    initDynaSuiteScriptUploadFile(data);
    expect(mockOnField).toHaveBeenCalledWith('uploadFile', {fileName: 'fileA.csv', type: 'csv'});
    expect(mockDispatch).toHaveBeenCalledWith(actions.resourceFormSampleData.request('exports-6386915c8dab534c4614b941'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.resourceFormSampleData.clear('6386915c8dab534c4614b941'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.file.reset('6386915c8dab534c4614b941-uploadFile'));
    expect(mockOnField).toHaveBeenCalledWith('uploadFile', '', true);
    expect(screen.getByText('No file chosen')).toBeInTheDocument();
    const input = document.querySelector('input[data-test="uploadFile"]');

    expect(input.files).toHaveLength(0);
    const someValues = [{ name: 'teresa teng' }];
    const str = JSON.stringify(someValues);
    const blob = new Blob([str]);
    const file = new File([blob], 'somegeneratedID.csv', {
      type: 'application/csv',
    });

    File.prototype.text = jest.fn().mockResolvedValueOnce(str);
    const uploadfile = document.querySelector('[data-test="uploadFile"]');

    await userEvent.click(uploadfile);
    const inputupload = document.querySelector('input[data-test="uploadFile"]');

    await waitFor(() => userEvent.upload(inputupload, file));
    expect(inputupload.files).toHaveLength(1);
    expect(input.files[0].name).toBe('somegeneratedID.csv');
    expect(mockDispatch).toHaveBeenCalledWith(actions.file.processFile({fileId: '6386915c8dab534c4614b941-uploadFile', fileType: 'csv', fileProps: {maxSize: '4 KB'}, file}));
  });
  test('should make dispatch calls when status is set to received and upload the file', async () => {
    mutateStore(initialStore, draft => {
      draft.session.fileUpload = {
        '6386915c8dab534c4614b941-uploadFile': {
          status: 'received',
          file: 'User,Id ,2 ,3 ,4 ,5 ',
          name: 'fileA.csv',
          size: 20,
          fileType: 'csv',
          rawFile: {},
        },
      };
    });
    const data = {
      id: 'uploadFile',
      maxSize: '4 KB',
      disabled: false,
      persistData: true,
      resourceId: '6386915c8dab534c4614b941',
      resourceType: 'exports',
      required: true,
      name: 'fileA.csv',
      uploadError: 'no',
      onFieldChange: mockOnField,
      placeholder: 'Sample file (that would be parsed)',
      formKey: 'exports-6386915c8dab534c4614b941',
      isLoggable: true,
    };

    initDynaSuiteScriptUploadFile(data);
    expect(mockOnField).toHaveBeenCalledWith('uploadFile', 'User,Id ,2 ,3 ,4 ,5 ');
    expect(mockDispatch).toHaveBeenCalledWith(actions.resourceFormSampleData.request('exports-6386915c8dab534c4614b941'));
    expect(screen.getByText('Sample file (that would be parsed)')).toBeInTheDocument();
    expect(screen.getByText('Choose file')).toBeInTheDocument();
    expect(screen.getByText('fileA.csv')).toBeInTheDocument();
    const someValues = [{ name: 'teresa teng' }];
    const str = JSON.stringify(someValues);
    const blob = new Blob([str]);
    const file = new File([blob], 'somegeneratedID.csv', {
      type: 'application/csv',
    });

    File.prototype.text = jest.fn().mockResolvedValueOnce(str);
    const uploadfile = document.querySelector('[data-test="uploadFile"]');

    await userEvent.click(uploadfile);
    const input = document.querySelector('input[data-test="uploadFile"]');

    await waitFor(() => userEvent.upload(input, file));

    expect(input.files).toHaveLength(1);
    expect(input.files[0].name).toBe('somegeneratedID.csv');
    expect(mockDispatch).toHaveBeenCalledWith(actions.file.processFile({fileId: '6386915c8dab534c4614b941-uploadFile', fileType: 'csv', fileProps: {maxSize: '4 KB'}, file}));
  });
  test('should make dispatch calls when uploaded file is empty and reset files and uploaded no file', async () => {
    mutateStore(initialStore, draft => {
      draft.session.fileUpload = {};
    });
    const data = {
      id: 'uploadFile',
      maxSize: '4 KB',
      resourceId: '6386915c8dab534c4614b941',
      resourceType: 'exports',
      onFieldChange: mockOnField,

      formKey: 'exports-6386915c8dab534c4614b941',
    };

    initDynaSuiteScriptUploadFile(data);
    expect(screen.getByText('Browse to zip file:')).toBeInTheDocument();
    // expect(mockDispatch).toBeCalledWith(actions.resourceFormSampleData.request('exports-6386915c8dab534c4614b941'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.resourceFormSampleData.clear('6386915c8dab534c4614b941'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.file.reset('6386915c8dab534c4614b941-uploadFile'));
    expect(mockOnField).toHaveBeenCalledWith('uploadFile', '', true);
    expect(screen.getByText('No file chosen')).toBeInTheDocument();
    const input = document.querySelector('input[data-test="uploadFile"]');

    expect(input.files).toHaveLength(0);
    const uploadfile = document.querySelector('[data-test="uploadFile"]');

    await userEvent.click(uploadfile);
    const inputupload = document.querySelector('input[data-test="uploadFile"]');

    await waitFor(() => userEvent.upload(inputupload, undefined));
    expect(input.files[0]).toBe();
  });
});
