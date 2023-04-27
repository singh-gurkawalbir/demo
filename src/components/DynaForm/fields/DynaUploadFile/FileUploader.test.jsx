import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUploader from './FileUploader';
import { renderWithProviders } from '../../../../test/test-utils';

function fileUploader(props = {}) {
  const ui = (
    <FileUploader {...props} />
  );

  return renderWithProviders(ui);
}

describe('FileUploader UI test cases', () => {
  test('Should test the file upload and error message to be displayed', async () => {
    const data = {
      mode: 'csv',
      uploadInProgress: false,
      id: 'uploadFile',
      disabled: false,
      isValid: false,
      errorMessages: '',
      name: '/uploadFile',
      required: false,
      handleFileChosen: () => {},
      fileName: '',
      label: 'Sample file (that would be parsed)',
      uploadError: 'Please select valid csv file',
      hideFileName: false,
      isLoggable: false,
    };

    fileUploader(data);
    expect(screen.getByText('Sample file (that would be parsed)')).toBeInTheDocument();
    expect(screen.getByText('Choose file')).toBeInTheDocument();
    expect(screen.getByText('No file chosen')).toBeInTheDocument();
    const errortext = screen.getAllByText('Please select valid csv file');

    expect(errortext[0]).toBeInTheDocument();
    const input = document.querySelector('input[data-test="uploadFile"]');

    expect(input.files).toHaveLength(0);

    const file = new File(['test'], 'sample1.csv', {
      type: 'csv',
    });

    await userEvent.upload(input, file);
    expect(input.files).toHaveLength(1);
    expect(input.files[0].name).toBe('sample1.csv');
  });
  test('Should upload a new file', async () => {
    const data = {
      id: 'uploadFile',
      disabled: false,
      isValid: true,
      errorMessages: 'Please select valid csv file',
      name: '/uploadFile',
      required: false,
      handleFileChosen: () => {},
      fileName: 'fileA.csv',
      label: 'Sample file (that would be generated)',
      hideFileName: false,
      isLoggable: false,
    };

    fileUploader(data);
    expect(screen.getByText('fileA.csv')).toBeInTheDocument();
    const uploadfile = document.querySelector('[data-test="uploadFile"]');

    await userEvent.click(uploadfile);
    const input = document.querySelector('input[data-test="uploadFile"]');
    const file = new File(['sample'], 'sample1.csv', {
      type: 'csv',
    });

    await userEvent.upload(input, file);
    expect(input.files).toHaveLength(1);
    expect(input.files[0].name).toBe('sample1.csv');
  });

  test('Upload of file is in progress', () => {
    const data = {
      uploadInProgress: true,
      id: 'uploadFile',
      disabled: false,
      isValid: true,
      errorMessages: '',
      name: '/uploadFile',
      required: false,
      handleFileChosen: () => {},
      fileName: '',
      label: 'Sample file (that would be parsed)',
      hideFileName: false,
      isLoggable: false,
    };

    fileUploader(data);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
