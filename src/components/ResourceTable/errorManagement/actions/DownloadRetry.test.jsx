
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import metadata from '../openErrors/metadata';
import CeligoTable from '../../../CeligoTable';
import actions from '../../../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.resources.exports = [{
    _id: '6439276e7uybwe78292878',
    adaptorType: 'NetSuiteExport',
  }];
});

async function renderFuntion(actionProps, data) {
  renderWithProviders(
    <MemoryRouter>
      <CeligoTable
        actionProps={actionProps}
        {...metadata}
        data={[data]} />
    </MemoryRouter>,
    {initialStore}
  );
  await userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('error Management Retry UI tests', () => {
  const resourceId = '6439276e7uybwe78292878';
  const flowId = '6938764rh739d3378';
  const source = 'ftp_bridge';
  const retryDataKey = 'somereqAndResKey';
  const errorId = 'someerrorId';
  const isFlowDisabled = true;

  test('should make a dispatch call clicking on download retry action', async () => {
    await renderFuntion({resourceId, flowId}, {source, retryDataKey, errorId});
    const downloadRetry = screen.getByText('Download retry data');

    expect(downloadRetry).toBeInTheDocument();
    await userEvent.click(downloadRetry);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.errorManager.retryData.download({flowId: '6938764rh739d3378', resourceId: '6439276e7uybwe78292878', retryDataKey: 'somereqAndResKey'})
    );
  });
  test('should have enabled title when flow is disabled', async () => {
    await renderFuntion({resourceId, isFlowDisabled}, {source, retryDataKey, errorId});
    const enableFlowText = screen.getByLabelText('Enable the flow to download retry data');

    expect(enableFlowText).toBeInTheDocument();
    expect(enableFlowText.textContent).toBe('Download retry data');
  });
});
