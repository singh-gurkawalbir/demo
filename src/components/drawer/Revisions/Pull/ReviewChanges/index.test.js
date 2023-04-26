
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import ReviewChangesDrawer from '.';
import actions from '../../../../../actions';

const props = {integrationId: '_integrationId'};
const mockHistoryReplace = jest.fn();

async function initReviewChangesDrawer(props = {}, isCreatedRevId = false, creationInProgress = false) {
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
        _integrationId: { status: 'received',
        },
      },
    };
  });
  const ui = (
    <MemoryRouter initialEntries={[{pathname: 'pull/_revisionId/review'}]}>
      <ReviewChangesDrawer {...props} />
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
describe('ReviewChangesDrawer tests', () => {
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

  test('Should able to test the ReviewChangesDrawer initial render', async () => {
    await initReviewChangesDrawer(props);
    expect(screen.getByRole('heading', {name: 'Review changes'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Expand all'})).toBeInTheDocument();
    const close = screen.getAllByRole('button', {name: 'Close'})[0];
    const next = screen.getByRole('button', {name: 'Next'});

    expect(next).toBeEnabled();
    expect(close).toBeEnabled();
    await userEvent.click(close);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/');
    await userEvent.click(next);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.revision.create('_integrationId', '_revisionId'));
  });

  test('Should able to test the ReviewChangesDrawer with isCreatedRevId true', async () => {
    await initReviewChangesDrawer(props, true);
    expect(mockHistoryReplace).toHaveBeenCalledWith('//pull/_revisionId/merge');
  });
  test('Should able to test the ReviewChangesDrawer with revisionCreation inProgress', async () => {
    await initReviewChangesDrawer(props, false, true);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getAllByRole('button', {name: 'Close'})[1]).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Next'})).toBeDisabled();
  });
});
