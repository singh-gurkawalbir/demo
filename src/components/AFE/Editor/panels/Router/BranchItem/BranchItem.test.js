import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../../test/test-utils';
import BranchItem from '.';
import actions from '../../../../../../actions';

const props = {
  expandable: true,
  position: 0,
  isViewMode: false,
  editorId: 'router-abcd',
  allowDeleting: true,
  allowSorting: true };

async function initBranchItem(props = {}, rules = []) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.editors['router-abcd'] = {
      editorType: 'router',
      rule: {
        routeRecordsTo: 'first_matching_branch',
        routeRecordsUsing: 'input_filters',
        id: 'abcd',
        branches: [
          {
            name: 'R1B1',
            description: 'For branch',
            inputFilter: {rules},
          },
          {
            name: 'R1B2',
            inputFilter: {rules},
          },
        ]},
    };
  });
  const ui = (
    <BranchItem {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
    location: {pathname: '/'},
  }),
}));
describe('branchItem tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    mockDispatchFn.mockClear();
  });
  test('should able to test the initial render of branches list item in router afe without branch rule set', async () => {
    await initBranchItem(props);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('R1B1')).toBeInTheDocument();
    expect(screen.getByText('Record flow conditions:')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'openPageInfo'));
    expect(screen.getByText('For branch')).toBeInTheDocument();
    expect(screen.getByText('Add condition')).toBeInTheDocument();
    expect(screen.getByText('Add conditions group')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'NOT'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'AND'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'OR'})).toBeInTheDocument();
    expect(screen.getByText('No conditions defined. All records will flow through this branch.')).toBeInTheDocument();
    mockDispatchFn.mockClear();
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.editor.patchRule('router-abcd', true, {rulePath: `branches[${0}].collapsed`}));
    await userEvent.click(screen.getAllByText('R1B1')[0]);
    await userEvent.keyboard('Branch 1 edited inline');
    await userEvent.tab();
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.editor.patchRule('router-abcd', 'R1B1Branch 1 edited inline', {rulePath: `branches[${0}].name`}));
  });

  test('should able to test branches list item in router afe without branch rule set for position 1', async () => {
    await initBranchItem({...props, position: 1});
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('R1B2')).toBeInTheDocument();
    expect(screen.getByText('No conditions defined.')).toBeInTheDocument();
    const dragHandle = document.querySelector('svg');

    expect(dragHandle).toHaveAttribute('style', 'cursor: grab;');
    expect(dragHandle).toBeInTheDocument();
  });
  test('should able to test branches item with rule set and without allowing sorting', async () => {
    await initBranchItem({...props, allowSorting: false}, ['equals', ['string', ['extract', 'id']], '5214ss']);
    expect(screen.queryByText('No conditions defined.')).not.toBeInTheDocument();
    const isDragHandle = document.querySelector('svg');

    expect(isDragHandle).not.toHaveAttribute('style', 'cursor: grab;');
  });
});
