
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import actions from '../../../../../actions';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import ReviewRevertChangesDrawer from '.';

const props = {integrationId: '_integrationId'};
const mockHistoryReplace = jest.fn();

async function initReviewRevertChangesDrawer(props = {}, isCreatedRevId = false, creationInProgress = false) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.resource = {
      _revisionId: isCreatedRevId ? '_revisionId' : undefined,
    };
    draft.session.lifeCycleManagement = {
      revision: {
        _integrationId: {
          _revisionId: { status: creationInProgress ? 'creating' : 'created'},
        },
      },
      compare: {
        _integrationId: {
          status: 'received',
          diff: {
            reverted: {
              flow: {_flowId: {name: 'RevertedName'}},
            },
            current: {
              flow: {_flowId: {name: 'CurrentName'}},
            },
          },
        },
      },
    };
  });
  const ui = (
    <MemoryRouter initialEntries={[{pathname: 'revert/_revisionId/review'}]}>
      <ReviewRevertChangesDrawer {...props} />
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
describe('ReviewRevertChangesDrawer tests', () => {
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
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('Should able to test the ReviewRevertChangesDrawer initial render', async () => {
    await initReviewRevertChangesDrawer(props);
    expect(screen.getByRole('heading', {name: 'Review changes'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Expand all'})).toBeInTheDocument();
    const close = screen.getAllByRole('button', {name: 'Close'})[0];
    const next = screen.getByRole('button', {name: 'Next'});

    expect(close).toBeInTheDocument();
    expect(next).toBeEnabled();
    await userEvent.click(close);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/');
    await userEvent.click(next);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.revision.create('_integrationId', '_revisionId'));
  });
  test('Should able to test the ReviewRevertChangesDrawer with isCreatedRevId true', async () => {
    await initReviewRevertChangesDrawer(props, true);
    expect(mockHistoryReplace).toHaveBeenCalledWith('//revert/_revisionId/final');
  });
  test('Should able to test the ReviewRevertChangesDrawer with revisionCreation inProgress', async () => {
    await initReviewRevertChangesDrawer(props, false, true);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getAllByRole('button', {name: 'Close'})[1]).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Next'})).toBeDisabled();
  });
});
