
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import InstallIntegrationDialog from '.';

jest.mock('./UploadFile', () => ({
  __esModule: true,
  ...jest.requireActual('./UploadFile'),
  default: () =>
    (
      <div>UploadFile</div>
    )
  ,
}));

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
describe('InstallIntegrationDialog UI tests', () => {
  test('should display the upload dialog along with the uploadFile component', () => {
    const props = {onClose: jest.fn()};

    renderWithProviders(<InstallIntegrationDialog {...props} />);
    expect(screen.getByText('UploadFile')).toBeInTheDocument();
    expect(screen.getByText('Upload integration zip file')).toBeInTheDocument();
  });
  test('should run the onClose function passed in props when dialogbox is closed', async () => {
    const mockOnClose = jest.fn();
    const props = {onClose: mockOnClose};

    renderWithProviders(<InstallIntegrationDialog {...props} />);
    const cancelButton = document.querySelector('[tabindex="0"]');

    await userEvent.click(cancelButton);
    waitFor(() => expect(mockOnClose).toBeCalled());
  });
});
