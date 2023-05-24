
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import OpenRevertDrawer from '.';
import customCloneDeep from '../../../../../utils/customCloneDeep';

const props = {integrationId: '_integrationId'};
const mockHistoryReplace = jest.fn();

async function initOpenRevertDrawer(props = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.lifeCycleManagement = {
      cloneFamily: {
        _integrationId: {
          status: 'completed',
        },
      },
    };
  });
  const ui = (
    <MemoryRouter initialEntries={[{pathname: 'revert/_tempRevId/open/:revertTo/revision/_revisionId'}]}>
      <OpenRevertDrawer {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

jest.mock('../../../../DynaForm/DynaSubmit', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../DynaForm/DynaSubmit'),
  default: props => <button type="button" onClick={() => props.onClick({})}>Next</button>,

}));

describe('OpenRevertDrawer tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  let initialStore;

  beforeEach(() => {
    initialStore = customCloneDeep(reduxStore);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('Should able to test the OpenRevertDrawer initial render', async () => {
    await initOpenRevertDrawer(props);
    expect(screen.getByText('Create revert')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Revert to revision description')).toBeInTheDocument();
    expect(screen.getByText('Revert to revision created date')).toBeInTheDocument();
    expect(screen.getByText('Revert to revision ID')).toBeInTheDocument();
    expect(screen.getAllByText('*')).toHaveLength(1);

    const close = screen.getAllByRole('button', {name: 'Close'})[0];
    const next = screen.getByRole('button', {name: 'Next'});

    expect(close).toBeInTheDocument();
    await userEvent.click(close);
    expect(mockHistoryReplace).toHaveBeenNthCalledWith(1, '/');
    await userEvent.click(next);
    expect(mockHistoryReplace).toHaveBeenNthCalledWith(4, '//revert/_tempRevId/review');
  });
});
