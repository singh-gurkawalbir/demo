
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import UploadFile from './UploadFile';
import actions from '../../../../actions';

const mockHistoryPush = jest.fn();

async function initUploadFile(isInstallIntegration = false, isFailed = false) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.templates = {
      _templateId:
          { isInstallIntegration,
            preview: {
              status: isFailed ? 'failure' : 'success',
              components: {
                objects: [],
                stackRequired: false,
              },
            },
            runKey: '_templateId',
          },
    };
  });
  const ui = (
    <MemoryRouter>
      <UploadFile />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
describe('UploadFile tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('Should able to test the initial render with UploadFile and uploading action', async () => {
    await initUploadFile();
    expect(screen.getByText('Your installation will begin after choosing a zip file.')).toBeInTheDocument();
    expect(screen.getByText('Browse to Zip file')).toBeInTheDocument();
    expect(screen.getByText('No file chosen')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Choose file'})).toBeInTheDocument();
    const input = screen.getByLabelText(/Choose file/i);
    const file = new File([new ArrayBuffer(1)], 'mockUpload.zip', {type: 'application/zip'});

    fireEvent.change(input, { target: { files: { item: () => file, length: 1, 0: file } } });
    await waitFor(() => expect(input.files).toHaveLength(1));
    await waitFor(() => expect(input.files[0]).toEqual(file));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.file.previewZip(file)));
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('Should able to test the initial render when file uploaded successfully for preview', async () => {
    await initUploadFile(true);
    expect(mockHistoryPush).toHaveBeenCalledWith('//preview/_templateId');
  });
  test('Should able to test the render when file preview failed', async () => {
    await initUploadFile(true, true);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.template.clearUploaded('_templateId'));
  });
});
