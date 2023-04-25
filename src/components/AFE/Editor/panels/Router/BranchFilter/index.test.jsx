import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BranchFilter from '.';
import { renderWithProviders, mutateStore } from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';
import actions from '../../../../../../actions';

const initialStore = getCreatedStore();
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../../../BranchFilterPanel', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../BranchFilterPanel'),
  default: ({rule, handlePatchEditor}) => (
    <>
      <div onClick={() => handlePatchEditor(rule)}>Branch filter panel</div>
      <div>{JSON.stringify(rule)}</div>
    </>
  ),
}));

const editorId = 'branchFilter123';
const position = 0;

const initBranchFilter = props => {
  const inputProps = {
    editorId,
    position,
    ...props,
  };

  mutateStore(initialStore, draft => {
    draft.session.editors = {
      [editorId]: {
        rule: {
          name: '',
          id: '3c9Ya7',
          branches: [
            {
              name: 'Branch 1.0',
              inputFilter: {
                rules: [
                  'equals',
                  [
                    'string',
                    [
                      'extract',
                      '[Billing Address 1]',
                    ],
                  ],
                  'adfs',
                ],
              },
              id: '0GcXUYxGyAT',
            },
            {
              name: 'Branch 1.3',
              inputFilter: {},
              id: 'gEuIbgAtmpn',
            },
          ],
        },
      },
    };
  });

  return renderWithProviders(
    <BranchFilter {...inputProps} />,
    {initialStore}
  );
};

describe('Branch filter component test cases', () => {
  const rule = ['equals', ['string', ['extract', '[Billing Address 1]']], 'adfs'];

  test('should render branch filter panel with correct rule', () => {
    initBranchFilter();

    expect(screen.getByText('Branch filter panel')).toBeInTheDocument();
    expect(screen.getByText(JSON.stringify(rule))).toBeInTheDocument();
  });

  test('should dispatch correct action for patching the editor', () => {
    initBranchFilter();

    userEvent.click(screen.getByText('Branch filter panel'));

    expect(mockDispatch).toHaveBeenCalledWith(
      actions.editor.patchRule(editorId, rule, {
        rulePath: `branches[${position}].inputFilter.rules`,
      })
    );
  });
});
