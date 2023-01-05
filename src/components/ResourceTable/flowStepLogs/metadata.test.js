
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../../CeligoTable';
import actions from '../../../actions';
import { ConfirmDialogProvider } from '../../ConfirmDialog';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

initialStore.getState().user.profile = {
  timezone: 'Asia/Calcutta',
};

function renderFuntion(data, actionProps) {
  renderWithProviders(
    <ConfirmDialogProvider>
      <MemoryRouter initialEntries={['/']}>
        <CeligoTable
          actionProps={actionProps}
          {...metadata}
          data={[data]}
        />
      </MemoryRouter>
    </ConfirmDialogProvider>, {initialStore}
  );
}

describe('flowStepLogs meta data UI tests', () => {
  test('should verify the time column', () => {
    renderFuntion({key: 'someKey', utcDateTime: '2022-05-18T18:16:31.989Z'}, {resourceId: 'someresourceId', flowId: 'someflowId'});
    expect(screen.getByText('05/18/2022 11:46:31 pm')).toBeInTheDocument();
    userEvent.click(screen.getByText('Time'));
    userEvent.click(screen.getAllByRole('button')[0]);
    userEvent.click(screen.getByText('Last 4 hours'));
    userEvent.click(screen.getByText('Apply'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.logs.flowStep.request(
        {resourceId: 'someresourceId', flowId: 'someflowId'}
      )
    );
  });
  test('should verify the method coulmn', () => {
    renderFuntion({key: 'someKey', method: 'someMethod'}, {resourceId: 'someresourceId', flowId: 'someflowId'});
    expect(screen.getByText('Method')).toBeInTheDocument();
    expect(screen.getByText('someMethod')).toBeInTheDocument();
    userEvent.click(screen.getAllByRole('button')[1]);
    userEvent.click(screen.getByText('POST'));

    userEvent.click(screen.getByText('Apply'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.logs.flowStep.request(
        {resourceId: 'someresourceId', flowId: 'someflowId'}
      )
    );
  });
  test('should verify the Stage column', () => {
    renderFuntion({key: 'someKey', stage: 'somestage'}, {resourceId: 'someresourceId', flowId: 'someflowId', isImport: true});

    userEvent.click(screen.getByText('Stage'));
    expect(screen.getByText('somestage')).toBeInTheDocument();
    userEvent.click(screen.getAllByRole('button')[2]);
    userEvent.click(screen.getAllByRole('checkbox')[0]);
    userEvent.click(screen.getByText('Apply'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.logs.flowStep.request(
        {resourceId: 'someresourceId', flowId: 'someflowId'}
      )
    );
  });
  test('should verify the Response code column', () => {
    renderFuntion({key: 'someKey', statusCode: 'somestatusCode'}, {resourceId: 'someresourceId', flowId: 'someflowId'});
    expect(screen.getByText('Response code')).toBeInTheDocument();
    expect(screen.getByText('somestatusCode')).toBeInTheDocument();
    userEvent.click(screen.getAllByRole('button')[2]);
    userEvent.click(screen.getAllByRole('checkbox')[0]);
    userEvent.click(screen.getByText('Apply'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.logs.flowStep.request(
        {resourceId: 'someresourceId', flowId: 'someflowId'}
      )
    );
  });
  test('should click the actions button', () => {
    renderFuntion({key: 'someKey'}, {resourceId: 'someresourceId', flowId: 'someflowId'});
    userEvent.click(screen.getByRole('button', {name: /more/i}));
    userEvent.click(screen.getByText('Delete log'));
    expect(screen.getByText('Confirm delete')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    userEvent.click(screen.getByText('Delete'));

    expect(mockDispatch).toHaveBeenCalledWith(
      actions.logs.flowStep.removeLog(
        'someflowId',
        'someresourceId',
        ['someKey']
      )
    );
  });
});
