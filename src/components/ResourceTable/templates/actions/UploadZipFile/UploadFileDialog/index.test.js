
import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import UploadFileDialog from '.';
import { ConfirmDialogProvider } from '../../../../../ConfirmDialog';
import { renderWithProviders} from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';
import actions from '../../../../../../actions';
import { TEMPLATE_ZIP_UPLOAD_ASYNC_KEY } from '../../../../../../constants';

let initialStore;
const mockOnClose = jest.fn();
const someValues = [{ name: 'teresa teng' }];

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

async function initUploadFileDialog(props) {
  const ui = (
    <ConfirmDialogProvider>
      <UploadFileDialog {...props} />
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('testsuite for Upload File Dialog', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'UPLOAD':
          break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    mockOnClose.mockClear();
  });
  test('should test the upload file dialog box close button', async () => {
    const props = {
      resourceType: 'exports',
      fileType: 'csv',
      onClose: mockOnClose,
      type: 'test',
      resourceId: '1234',
    };

    await initUploadFileDialog(props);
    expect(screen.getByText(/upload export test file/i)).toBeInTheDocument();
    const uploadCloseButtonNode = document.querySelector('svg[data-testid="closeModalDialog"]');

    expect(uploadCloseButtonNode).toBeInTheDocument();
    await userEvent.click(uploadCloseButtonNode);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  test('should test the upload file dialog box upload button by uploading a file', async () => {
    const props = {
      resourceType: 'exports',
      fileType: 'application/JSON',
      onClose: mockOnClose,
      type: 'Test',
      resourceId: '1234',
    };

    await initUploadFileDialog(props);
    expect(screen.getByText(/upload export test file/i)).toBeInTheDocument();
    expect(screen.getByText(/select export test file/i)).toBeInTheDocument();
    const uploadButtonNode = screen.getByRole('button', {
      name: /select export test file/i,
    });

    expect(uploadButtonNode).toBeInTheDocument();
    await userEvent.click(uploadButtonNode);
    const str = JSON.stringify(someValues);
    const blob = new Blob([str]);
    const file = new File([blob], 'values.json', {
      type: 'application/JSON',
    });

    File.prototype.text = jest.fn().mockResolvedValueOnce(str);
    const input = document.querySelector('input[data-test="uploadFile"]');

    // await userEvent.upload(input, file);
    await fireEvent.change(input, {
      target: { files: { item: () => file, length: 1, 0: file } },
    });
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.file.upload({resourceType: 'exports', resourceId: '1234', fileType: 'application/JSON', file, asyncKey: TEMPLATE_ZIP_UPLOAD_ASYNC_KEY})));
  });
  test('should test the upload file dialog box by uploading a wrong format file which is not equal to the file type that sent in prop', async () => {
    const props = {
      resourceType: 'exports',
      fileType: 'application/CSV',
      onClose: mockOnClose,
      type: 'Test',
      resourceId: '1234',
    };

    await initUploadFileDialog(props);
    expect(screen.getByText(/upload export test file/i)).toBeInTheDocument();
    expect(screen.getByText(/select export test file/i)).toBeInTheDocument();
    const uploadButtonNode = screen.getByRole('button', {
      name: /select export test file/i,
    });

    expect(uploadButtonNode).toBeInTheDocument();
    await userEvent.click(uploadButtonNode);
    const str = JSON.stringify(someValues);
    const blob = new Blob([str]);

    const file = new File([blob], 'values.json', {
      type: 'application/JSON',
    });

    File.prototype.text = jest.fn().mockResolvedValueOnce(str);
    const input = document.querySelector('input[data-test="uploadFile"]');

    // await userEvent.upload(input, file);
    await fireEvent.change(input, {
      target: { files: { item: () => file, length: 1, 0: file } },
    });
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.file.upload({resourceType: props.resourceType, resourceId: props.resourceId, fileType: props.fileType, file, asyncKey: TEMPLATE_ZIP_UPLOAD_ASYNC_KEY})));
  });
});

