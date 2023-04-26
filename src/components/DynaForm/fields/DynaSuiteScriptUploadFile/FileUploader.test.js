import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUploader from './FileUploader';
import { renderWithProviders } from '../../../../test/test-utils';

async function fileUploader(props = {}) {
  const ui = (
    <FileUploader {...props} />
  );

  return renderWithProviders(ui);
}

describe('FileUploader UI test cases', () => {
  test('Should test the file uploading and error message to be displayed', async () => {
    const data = {
      id: 'uploadFile',
      disabled: false,
      isValid: false,
      errorMessages: 'Please select valid json file',
      name: '/uploadFile',
      required: false,
      handleFileChosen: () => {},
      fileName: '',
      uploadError: 'Please select valid json file',
      label: 'Sample file (that would be generated)',
      hideFileName: false,
      isLoggable: false,
    };

    await fileUploader(data);
    expect(screen.getByText('Sample file (that would be generated)')).toBeInTheDocument();
    expect(screen.getByText('Choose file')).toBeInTheDocument();
    expect(screen.getByText('No file chosen')).toBeInTheDocument();
    const errortext = screen.getAllByText('Please select valid json file');

    expect(errortext[0]).toBeInTheDocument();
    const input = document.querySelector('input[data-test="uploadFile"]');

    expect(input.files).toHaveLength(0);
    const someValues = [{ name: 'teresa teng' }];
    const str = JSON.stringify(someValues);
    const blob = new Blob([str]);
    const file = new File([blob], 'sample1.json', {
      type: 'application/json',
    });

    await userEvent.upload(input, file);
    expect(input.files).toHaveLength(1);
    expect(input.files[0].name).toBe('sample1.json');
  });
  test('Should upload a new file', async () => {
    const data = {
      id: 'uploadFile',
      disabled: false,
      isValid: true,
      errorMessages: 'Please select valid json file',
      name: '/uploadFile',
      required: false,
      handleFileChosen: () => {},
      fileName: 'fileA.json',
      label: 'Sample file (that would be generated)',
      hideFileName: false,
      isLoggable: false,
    };

    await fileUploader(data);
    expect(screen.getByText('fileA.json')).toBeInTheDocument();
    const uploadfile = document.querySelector('[data-test="uploadFile"]');

    await userEvent.click(uploadfile);
    const input = document.querySelector('input[data-test="uploadFile"]');
    const someValues = [{ name: 'teresa teng' }];
    const str = JSON.stringify(someValues);
    const blob = new Blob([str]);
    const file = new File([blob], 'sample1.json', {
      type: 'application/json',
    });

    await userEvent.upload(input, file);
    expect(input.files).toHaveLength(1);
    expect(input.files[0].name).toBe('sample1.json');
  });
});
