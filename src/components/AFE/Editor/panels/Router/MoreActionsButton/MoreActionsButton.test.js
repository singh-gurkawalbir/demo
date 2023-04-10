import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../../test/test-utils';
import MoreActionsButton from '.';
import {ConfirmDialogProvider} from '../../../../../ConfirmDialog';
import actions from '../../../../../../actions';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    location: {pathname: '/integrations/intId'},
  }),
}));
const props = {editorId: 'router-abcd', position: '', pageProcessors: [{_id: '_import1', type: 'HTTP'}, {_id: '_lookup1'}], allowDeleting: true};

async function initMoreActionsButton(props) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.editors['router-abcd'] = {
      editorType: 'router',
      rule: {routeRecordsUsing: 'input_filters', id: 'abcd', branches: [{name: 'R1B1'}, {name: 'R1B2'}]},
    };
  });
  const ui = (
    <ConfirmDialogProvider>
      <MoreActionsButton {...props} />
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('moreActionsButton tests', () => {
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
    mockHistoryPush.mockClear();
  });
  test('should able to test the initial render with MoreActionsButton with only ellipses icon', async () => {
    await initMoreActionsButton(props);
    expect(screen.queryByText('Edit branch name/description')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('should able to test MoreActionsButton with action options provided', async () => {
    await initMoreActionsButton(props);
    // for delete banching
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    const deleteOption = screen.getByRole('menuitem', {name: 'Delete branch'});

    expect(deleteOption).toBeInTheDocument();
    await userEvent.click(deleteOption);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this branch?')).toBeInTheDocument();
    expect(screen.getByText('This will also remove all steps/branchings inside this branch (1 configured steps, 1 unconfigured steps).')).toBeInTheDocument();
    const Delete = screen.getByRole('button', {name: 'Delete'});
    const Cancel = screen.getByRole('button', {name: 'Cancel'});

    expect(Delete).toBeEnabled();
    expect(Cancel).toBeEnabled();
    await userEvent.click(Delete);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.patchRule('router-abcd', [{name: 'R1B2'}], {rulePath: 'branches'}));

    // for edit banching
    await userEvent.click(screen.getByRole('button'));
    const editBranchOption = screen.getByRole('menuitem', {name: 'Edit branch name/description'});

    expect(editBranchOption).toBeInTheDocument();
    await userEvent.click(editBranchOption);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/intId/branch/');
  });
  test('should able to test MoreActionsButton deleteBranch option with last branch', async () => {
    await initMoreActionsButton({...props, allowDeleting: false});
    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByLabelText('no notifications')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menuitem', {name: 'Delete branch'})).toHaveAttribute('aria-disabled', 'true');
  });
});
