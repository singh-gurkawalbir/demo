
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DownloadErrors from '.';
import { drawerPaths, buildDrawerUrl } from '../../../../../utils/rightDrawer';
import { runServer } from '../../../../../test/api/server';
import { renderWithProviders } from '../../../../../test/test-utils';

async function initDownloadErrors() {
  const MockComponent = ({ actions }) => {
    const mockDownloadErrorsWithRowData = actions.useOnClick({
      isResolved: true,
    });
    const mockdownloadErrorsWithOutRowData = actions.useOnClick();

    return (
      <>
        <button type="button" onClick={mockdownloadErrorsWithOutRowData}>mock DownloadErrors without rowData</button>
        <button type="button" onClick={mockDownloadErrorsWithRowData}>mock DownloadErrors with rowData</button>
        <span>{actions.key}</span>
      </>
    );
  };
  const ui = (
    <MemoryRouter>
      <MockComponent actions={DownloadErrors} />
    </MemoryRouter>
  );
  const { utils, store } = renderWithProviders(ui);

  return { utils, store };
}
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('actionMenu component Test cases', () => {
  runServer();
  afterEach(() => {
    mockHistoryPush.mockClear();
  });
  test('should pass the intial render with no actions', async () => {
    await initDownloadErrors();
    const downloadErrorsWithOutRowData = screen.getByRole('button', { name: 'mock DownloadErrors without rowData'});
    const downloadErrorsWithRowData = screen.getByRole('button', { name: 'mock DownloadErrors with rowData'});

    expect(screen.queryByText('downloadErrors')).toBeInTheDocument();
    expect(DownloadErrors.useLabel()).toBe('Download errors');
    expect(downloadErrorsWithOutRowData).toBeInTheDocument();
    expect(downloadErrorsWithRowData).toBeInTheDocument();

    await userEvent.click(downloadErrorsWithOutRowData);
    expect(mockHistoryPush).toHaveBeenCalledWith(buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V2.DOWNLOAD_ERRORS,
      baseUrl: '/',
      params: { type: 'open' },
    }));

    await userEvent.click(downloadErrorsWithRowData);
    expect(mockHistoryPush).toHaveBeenCalledWith(buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V2.DOWNLOAD_ERRORS,
      baseUrl: '/',
      params: { type: 'resolved' },
    }));
  });
});
