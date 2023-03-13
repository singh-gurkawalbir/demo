import React from 'react';
import {screen } from '@testing-library/react';
import { reduxStore, renderWithProviders } from '../../test/test-utils';
import BranchFilterPanel from './index';

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

function initBranchFilterPanel(props = {}) {
  const inputProps = {
    editorId,
    rule,
    handlePatchEditor,
    type,
    ...props,
  };

  renderWithProviders(
    <BranchFilterPanel {...inputProps} />,
    {initialStore}
  );
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
});
