/* global describe, test, expect, jest */
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchCriteriaDialog from './Dialog';
import { renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';

const initialStore = getCreatedStore();

jest.mock('../../../../icons/FullScreenCloseIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../icons/FullScreenCloseIcon'),
  default: () => (
    <div>FullScreenCloseIcon</div>
  ),
}));

function initSearchCriteriaDialog(props = {}) {
  initialStore.getState().session.metadata = {application: {'5efd8663a56953365bd28541': {
    'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote': {
      data: props.data,
      status: 'success',
      errorMessage: 'Test Error Message',
    },
  },
  }};
  initialStore.getState().data.resources = {
    connections: [{
      _id: '5efd8663a56953365bd28541',
      offline: props.offline,
    }],
  };
  initialStore.getState().session.searchCriteriaReducer = {searchCriteria: {
    'searchCriteria-netsuite.restlet.criteria-635061c6009e486cb5b16e91': {
      searchCriteria: {
        demoId: [{
          field: 'audience',
          key: '0c9Nx2kTQ',
          operator: 'noneof',
          searchValue: '1,2,3',
          searchValue2Enabled: false,
          showFormulaField: false,
          width: '80vw',
          height: '50vh',
        }],
      }}}};

  return renderWithProviders(<SearchCriteriaDialog {...props} />, {initialStore});
}

describe('SearchCriteriaDialog UI tests', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnRefresh = jest.fn();
  const props = {
    id: 'demoID',
    onSave: mockOnSave,
    onClose: mockOnClose,
    onRefresh: mockOnRefresh,
    connectionId: '5efd8663a56953365bd28541',
    commMetaPath: 'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote',
    filterKey: 'salesforce-sObject-layout',
    data: [],
  };

  test('should pass the initial render', () => {
    initSearchCriteriaDialog(props);
    expect(screen.getByText('Operator')).toBeInTheDocument();
    expect(screen.getByText('Search Value')).toBeInTheDocument();
    expect(screen.getByText('Search Value 2')).toBeInTheDocument();
    expect(screen.getByText('Please select')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
    const fields = screen.getAllByRole('textbox');

    expect(fields).toHaveLength(3);
    screen.debug(undefined, Infinity);
  });
  test('should display the dropdownwhen clicked on the operator dropdown', () => {
    initSearchCriteriaDialog(props);
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    expect(screen.getByText('any')).toBeInTheDocument();
    expect(screen.getByText('contains')).toBeInTheDocument();
    expect(screen.getByText('does not contain')).toBeInTheDocument();
    expect(screen.getByText('does not start with')).toBeInTheDocument();
    expect(screen.getByText('equal to')).toBeInTheDocument();
    expect(screen.getByText('has key words')).toBeInTheDocument();
    expect(screen.getByText('is')).toBeInTheDocument();
    expect(screen.getByText('is empty')).toBeInTheDocument();
    screen.debug(undefined, Infinity);
  });
  test('should call the onSave function passed in props when save button is clicked', () => {
    initSearchCriteriaDialog(props);
    const dropdown = screen.getByText('Please select');

    expect(dropdown).toBeInTheDocument();
    userEvent.click(dropdown);
    userEvent.click(screen.getByText('contains'));
    const deleteButton = document.querySelector('[id="delete-0"]');

    expect(deleteButton).toBeInTheDocument();
    userEvent.click(deleteButton);

    userEvent.click(screen.getByText('Save'));
    expect(mockOnSave).toBeCalled();
  });
  test('should change the window size of the form when clicked on fullscreen button', () => {
    initSearchCriteriaDialog(props);
    const toggleScreenButton = document.querySelector('[data-test="toggleEditorSize"]');

    expect(toggleScreenButton).toBeInTheDocument();
    expect(screen.queryByText('FullScreenCloseIcon')).toBeNull();
    userEvent.click(toggleScreenButton);
    expect(screen.getByText('FullScreenCloseIcon')).toBeInTheDocument();
    screen.debug(null, Infinity);
  });
});
