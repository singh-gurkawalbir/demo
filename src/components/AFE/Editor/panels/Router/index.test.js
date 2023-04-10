import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../../actions';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import RouterPanel from '.';

const initRouterPanel = (maxLimit = false, loading = false, props = {editorId: 'router-abcd'}) => {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.editors['router-abcd'] = {
      editorType: 'router',
      flowId: '_flowId',
      fieldId: 'router',
      resourceId: 'abcd',
      resourceType: 'flows',
      router: {},
      routerIndex: 0,
      editorTitle: 'Edit branching',
      branchNamingIndex: 1,
      sampleDataStatus: !loading ? 'received' : 'requested',
      rule: {routeRecordsUsing: 'input_filters', id: 'abcd', branches: [{name: 'R1B1'}, {name: 'R1B2'}]},
      layout: 'jsonFormBuilder',
      data: {filter: '', javascript: ''},
      isInvalid: false,
      originalRule: {},
    };
    if (maxLimit) {
      const newArr = Array.from(Array(30), () => ({}));

      draft.session.editors['router-abcd'].rule.branches = newArr;
    }
  });

  return renderWithProviders(<MemoryRouter><RouterPanel {...props} /></MemoryRouter>, { initialStore });
};

describe('routerPanel tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    cleanup;
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should able to pass initial render with default values having branches = 2 and first matching branch', async () => {
    await initRouterPanel();
    expect(screen.getByRole('heading', {name: 'Branching type'})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Branches'})).toBeInTheDocument();
    expect(screen.getAllByRole('button', {name: 'R1B1'})[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', {name: 'R1B2'})[0]).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', {name: 'Records will flow through:'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'First matching branch'})).toBeInTheDocument();
    const allMatchingBranchesOption = screen.getByRole('radio', {name: 'All matching branches'});

    expect(allMatchingBranchesOption).toBeInTheDocument();
    const branches = [];

    // eslint-disable-next-line jest/no-conditional-in-test
    document.querySelectorAll('svg').forEach(item => item.getAttribute('style') === 'cursor: grab;' ? branches.push(item) : null);
    fireEvent.mouseDown(branches[0]);
    fireEvent.mouseMove(branches[0]);
    fireEvent.mouseUp(branches[0]);
    expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.editor.patchRule('router-abcd', undefined, {actionType: 'reorder', newIndex: 0, oldIndex: 0 }));
    const addBranch = screen.getByRole('button', {name: 'Add branch'});

    expect(addBranch).toBeInTheDocument();
    await userEvent.click(addBranch);
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.editor.patchRule('router-abcd', undefined, {actionType: 'addBranch'}));
    await userEvent.click(allMatchingBranchesOption);
    expect(mockDispatchFn).toHaveBeenNthCalledWith(3, actions.editor.patchRule('router-abcd', 'all_matching_branches', {rulePath: 'routeRecordsTo'}));
  });
  test('should able to pass initial render having branches >= 25', async () => {
    await initRouterPanel(true);
    expect(screen.getByLabelText('You have reached the maximum of 25 branches in a branching')).toBeInTheDocument();
  });
  test('should able to pass initial render with sampleData loading', async () => {
    await initRouterPanel(false, true);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('R1B1')).not.toBeInTheDocument();
  });
});
