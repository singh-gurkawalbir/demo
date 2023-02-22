
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../../test/test-utils';
// import obj from './metadata';
import metadata from '../openErrors/metadata';
import CeligoTable from '../../../CeligoTable';
import actions from '../../../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

async function renderFuntion(actionProps, data) {
  renderWithProviders(
    <MemoryRouter>
      <CeligoTable
        actionProps={actionProps}
        {...metadata}
        data={[data]} />
    </MemoryRouter>
  );
  await userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('error Management Resolve UI tests', () => {
  test('should make dispatch call for Resolve click', async () => {
    await renderFuntion({
      isFlowDisabled: false,
      isResolved: false,
      flowId: '6938764rh739ddfv3378',
      resourceId: '5ea16c789ab71928a617489',
    }, {errorId: '62678909876546789'});
    const resolve = screen.getByText('Resolve');

    expect(resolve).toBeInTheDocument();
    await userEvent.click(resolve);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.errorManager.flowErrorDetails.resolve(
        {
          flowId: '6938764rh739ddfv3378',
          resourceId: '5ea16c789ab71928a617489',
          errorIds: ['62678909876546789'],
        }
      )
    );
  });
});
