
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../../../test/test-utils';
import CeligoTable from '../../../../CeligoTable';
import metadata from '../../metadata';
import actions from '../../../../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../../JobDashboard/JobFilesDownloadDialog', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../JobDashboard/JobFilesDownloadDialog'),
  default: props => (
    <>
      <div>JobFilesDownloadDialog</div>
      <button type="button" onClick={props.onCloseClick}>Close</button>
    </>
  ),
}));

async function initRunHistoryTable(data, initialStore = null) {
  const ui = (
    <CeligoTable {...metadata} data={[data]} />
  );

  await renderWithProviders(ui, {initialStore});
  await userEvent.click(screen.queryByRole('button', {name: /more/i}));
}
describe("runHistory's Downlaod diagnostics Action UI test case", () => {
  test('should click on Download diagnostics button', async () => {
    await initRunHistoryTable({ _id: '_id'});
    await waitFor(async () => {
      await userEvent.click(screen.getByText('Download diagnostics'));
      expect(mockDispatch).toHaveBeenCalledWith(actions.job.downloadFiles({ jobId: '_id', fileType: 'diagnostics' }));
    });
  });
});
