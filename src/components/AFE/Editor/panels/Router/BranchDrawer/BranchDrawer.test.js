import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../../test/test-utils';
import BranchDrawer from '.';
import actions from '../../../../../../actions';
import actionTypes from '../../../../../../actions/types';
import customCloneDeep from '../../../../../../utils/customCloneDeep';

const mockHistoryPush = jest.fn();
const mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    goBack: mockHistoryGoBack,
    location: {pathname: '/integrations/intId'},
  }),
}));

async function initBranchDrawer(props = {editorId: 'router-abcd'}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.editors['router-abcd'] = {
      editorType: 'router',
      rule: {routeRecordsUsing: 'input_filters', id: 'abcd', branches: [{name: 'R1B1', description: ''}]},
    };
  });
  const ui = (
    <MemoryRouter initialEntries={[{pathname: 'branch/0'}]}>
      <BranchDrawer {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('branchDrawer tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  let initialStore;

  beforeEach(() => {
    initialStore = customCloneDeep(reduxStore);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case actionTypes.EDITOR.PATCH.RULE: break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    mockHistoryPush.mockClear();
    mockHistoryGoBack.mockClear();
  });
  test('should able to test the initial render when description is updated and closed drawer', async () => {
    await initBranchDrawer();
    expect(screen.getByRole('heading', {name: 'Edit branch name/description'})).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    const descInput = screen.getAllByRole('textbox')[1];
    const closeIcon = screen.getAllByRole('button').find(btn => btn.getAttribute('data-test') === 'closeRightDrawer');

    await userEvent.click(closeIcon);
    expect(mockHistoryGoBack).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
    const closeBtn = screen.getAllByRole('button').find(btn => btn.getAttribute('data-test') === 'cancel');

    expect(closeBtn).toBeEnabled();
    await userEvent.type(descInput, 'updated description for branch');
    mockDispatchFn.mockClear();
    await userEvent.click(screen.getByRole('button', {name: 'Save & close'}));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.editor.patchRule('router-abcd', {description: 'updated description for branch', name: 'R1B1'}, {rulePath: 'branches[0]'}));
    expect(mockHistoryGoBack).toHaveBeenCalledTimes(2);
  });
  test('should able to test the initial render when branch name is updated and only saved', async () => {
    await initBranchDrawer();
    const nameInput = screen.getAllByRole('textbox')[0];

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Branch 1');
    mockDispatchFn.mockClear();
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.editor.patchRule('router-abcd', {description: '', name: 'Branch 1'}, {rulePath: 'branches[0]'}));
    expect(mockHistoryGoBack).toHaveBeenCalledTimes(0);
  });
});
