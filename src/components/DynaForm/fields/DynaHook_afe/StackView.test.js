/* global describe, test, expect, jest */
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import StackView from './StackView';
import { renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function initStackView(props = {}) {
  initialStore.getState().data.resources = {stacks: [{
    _id: '63342b57bb74b66e32a93e5d',
    lastModified: '2022-10-09T23:07:36.439Z',
    createdAt: '2022-09-28T11:09:11.773Z',
    name: 'Stack 1',
  },
  {
    _id: '631b5521798cc1729e88a76d',
    lastModified: '2022-10-10T08:08:55.632Z',
    createdAt: '2022-09-09T15:00:49.149Z',
    name: 'Stack 2',
  },
  {
    _id: '634664b80eeae84271ab534e',
    lastModified: '2022-10-12T07:09:20.908Z',
    createdAt: '2022-10-12T06:54:48.727Z',
    name: 'Stack 3',
  },
  ]};
  const ui = (
    <MemoryRouter>
      <StackView {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('StackView UI tests', () => {
  const mockIsValidHookField = jest.fn();
  const mockhandleFieldChange = jest.fn();
  const props = {
    disabled: false,
    required: true,
    stackId: '',
    isValidHookField: mockIsValidHookField,
    handleFieldChange: mockhandleFieldChange,
    isLoggable: true,
  };

  test('should pass the initial render', () => {
    initStackView(props);
    expect(screen.getByText('Stacks')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
    screen.debug();
  });
  test('should render the corresponding stack as selected when stackId is passed in props', () => {
    initStackView({...props, stackId: '634664b80eeae84271ab534e'});
    expect(screen.getByText('Stack 3')).toBeInTheDocument();
  });
  test('should display the dropdown when clicked on the stack field', () => {
    initStackView(props);
    const dropdownButton = screen.getByText('None');

    userEvent.click(dropdownButton);
    expect(screen.getByText('Stack 1')).toBeInTheDocument();
    expect(screen.getByText('Stack 2')).toBeInTheDocument();
    expect(screen.getByText('Stack 3')).toBeInTheDocument();
  });
});
