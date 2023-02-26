
import React from 'react';
import { screen } from '@testing-library/react';
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

async function initRunHistoryTable(data = {}, initialStore = null) {
  const ui = (
    <CeligoTable {...metadata} data={[data]} />
  );

  renderWithProviders(ui, {initialStore});
  await userEvent.click(screen.queryByRole('button', {name: /more/i}));
}

describe("run history's Download Files test cases", () => {
  test('should click Download files button when only one files is there to download', async () => {
    await initRunHistoryTable({files: [1], _id: '_id'});

    await userEvent.click(screen.getByText('Download files'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.job.downloadFiles({ jobId: '_id' }));
  });

  test('should open modal when more than one file is there to downlaod', async () => {
    await initRunHistoryTable({files: [{id: 1}, {id: 2}], _id: '_id'});

    await userEvent.click(screen.getByText('Download files'));
    expect(screen.getByText('Download')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('closeModalDialog'));
    expect(screen.queryByTestId('closeModalDialog')).not.toBeInTheDocument();
  });
});
