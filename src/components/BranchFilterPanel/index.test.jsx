import React from 'react';
import {cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, reduxStore, renderWithProviders } from '../../test/test-utils';
import BranchFilterPanel from '.';
import actions from '../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
const initialStore = reduxStore;

const editorId = 'editor123';
const rule = {};
const handlePatchEditor = jest.fn();
const type = 'ioFilter';

function initBranchFilterPanel(props = {}, ops = {}) {
  mutateStore(initialStore, draft => {
    draft.session.editors = {
      [editorId]: {
        skipEmptyRuleCleanup: true,
      },
    };
  });
  const inputProps = {
    editorId,
    rule,
    handlePatchEditor,
    type,
    ...props,
  };

  const { utils: renderUtil } = renderWithProviders(
    <BranchFilterPanel {...inputProps} />,
    {initialStore, renderFun: ops.render}
  );

  return renderUtil;
}

describe('Branch filter panel test cases', () => {
  test('should not throw exception for invalid rules', () => {
    initBranchFilterPanel();
    expect(screen.getByText('record.sampleField')).toBeInTheDocument();
  });
  test('should render valid expression', () => {
    const rule = [
      'equals',
      [
        'string',
        [
          'extract',
          'budget',
        ],
      ],
      [
        'string',
        [
          'extract',
          'myField',
        ],
      ],
    ];

    initBranchFilterPanel({rule});
    expect(screen.getByText('record.budget')).toBeInTheDocument();
    expect(screen.getByText('record.myField')).toBeInTheDocument();
  });
  test('should not throw exception for invalid RHS expression', () => {
    const rule = [
      'equals',
      [
        'string',
        [
          'extract',
          'budget',
        ],
      ],
      [
        'string',
        [
          'string',
          [
            'extract',
            'myField',
          ],
        ],
      ],
    ];

    initBranchFilterPanel({rule});
    expect(screen.getByText('record.budget')).toBeInTheDocument();
  });
  test('should not throw exception for invalid LHS expression', () => {
    const rule = [
      'equals',
      [
        'string',
        [
          'string',
          [
            'extract',
            'myField',
          ],
        ],
      ],
      'asdf',
    ];

    initBranchFilterPanel({rule});
    expect(screen.getByText('record.sampleField')).toBeInTheDocument();
  });
  test('should not call skipEmptyRuleCleanup for ioFilter', async () => {
    initBranchFilterPanel();
    const addRuleButton = screen.getByRole('button', {name: 'Add rule'});

    expect(addRuleButton).toBeInTheDocument();
    await userEvent.click(addRuleButton);

    expect(mockDispatch).not.toHaveBeenCalledWith(
      actions.editor.patchFeatures(editorId, {skipEmptyRuleCleanup: true})
    );
  });
  test('should dispatch actions with correct params on rerender', async () => {
    const position = 0;
    const inputProps = {
      rule: undefined,
      type: 'branchFilter',
      position,
    };
    const renderUtil = initBranchFilterPanel(inputProps);
    const addRuleButton = screen.getByRole('button', {name: 'Add condition'});

    await userEvent.click(addRuleButton);

    expect(mockDispatch).toHaveBeenCalledWith(actions.editor.patchRule(editorId, true, {
      actionType: 'setSkipEmptyRuleCleanup',
      position,
    }));
    const updatedProps = {...inputProps, position: 1};

    initBranchFilterPanel(updatedProps, {render: renderUtil.rerender});

    await userEvent.click(addRuleButton);
    expect(mockDispatch).toHaveBeenCalledWith(actions.editor.patchRule(editorId, true, {
      actionType: 'setSkipEmptyRuleCleanup',
      position,
    }));
  });
  describe('should dispatch actions with correct params on unmount', () => {
    test('for branch filter', () => {
      const position = 0;
      const inputProps = {
        rule: undefined,
        position,
        type: 'branchFilter',
      };

      initBranchFilterPanel(inputProps);

      cleanup();

      expect(mockDispatch).toHaveBeenCalledWith(actions.editor.patchFeatures(editorId, {
        isInvalid: false,
        error: undefined,
        disablePreview: false,
      }));
    });
    test('for ioFilter', () => {
      initBranchFilterPanel();

      cleanup();

      expect(mockDispatch).toHaveBeenCalledWith(actions.editor.patchFeatures(editorId, {
        isInvalid: false,
        error: undefined,
        disablePreview: false,
      }));
    });
  });
});
