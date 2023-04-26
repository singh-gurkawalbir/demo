import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mutateStore, reduxStore } from '../../../test/test-utils';
import PreviewInfo from './PreviewInfo';

let mockRecordValidity;

async function initPreviewInfo(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <PreviewInfo {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../SelectPreviewRecordsSize', () => ({
  __esModule: true,
  ...jest.requireActual('../SelectPreviewRecordsSize'),
  default: props => (
    <div>
      Number of records: <span>10</span>
      <button type="button" onClick={() => props.setIsValidRecordSize(mockRecordValidity)}>
        changeRecordValidity
      </button>
    </div>
  ),
}));

describe('preview Info Component', () => {
  test('should pass initial rendering', async () => {
    const formKey = 'export-123';
    const fetchExportPreviewData = jest.fn();
    const resourceSampleData = {};

    await initPreviewInfo({fetchExportPreviewData, resourceSampleData, formKey});
    const previewBtn = screen.getByRole('button', {name: 'Preview'});

    expect(previewBtn).toBeEnabled();
    expect(screen.getByText('Number of records:')).toBeInTheDocument();
    userEvent.click(previewBtn);
    expect(fetchExportPreviewData).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if preview attempted for invalid record size', async () => {
    const formKey = 'export-123';
    const fetchExportPreviewData = jest.fn();
    const resourceSampleData = {};

    mockRecordValidity = false;

    await initPreviewInfo({fetchExportPreviewData, resourceSampleData, formKey});
    const previewBtn = screen.getByRole('button', {name: 'Preview'});
    const changeRecordValidityBtn = screen.getByRole('button', {name: /changeRecordValidity/i});

    userEvent.click(changeRecordValidityBtn);
    userEvent.click(previewBtn);
    expect(screen.getByText('Enter a valid record size')).toBeInTheDocument();
  });

  test('should pass when click on the preview button fetchExportPreviewData to be called', async () => {
    const initialStore = reduxStore;
    const mustateState = draft => {
      draft.data = {
        resources: {
          exports: [
            {
              _id: 'export-123',
              type: 'delta',
            },
          ],
        },
      };
    };

    mutateStore(initialStore, mustateState);
    const formKey = 'export-123';
    const fetchExportPreviewData = jest.fn();
    const resourceSampleData = {};

    mockRecordValidity = false;

    await initPreviewInfo({fetchExportPreviewData, resourceSampleData, formKey});
    const previewBtn = screen.getByRole('button', {name: 'Preview'});

    userEvent.click(previewBtn);
    expect(fetchExportPreviewData).toBeCalled();
  });
});
