
import React from 'react';
import {
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import DynaNSSearchCriteria from './index';
import { renderWithProviders} from '../../../../test/test-utils';

jest.mock('../../../icons/RefreshIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/RefreshIcon'),
  default: () => <div>Refresh button</div>,
}));

describe('dynaNSSearchCriteria UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  const mockonFieldChange = jest.fn();
  const props = {
    id: 'test id',
    onFieldChange: mockonFieldChange,
    resourceId: '5b3c75dd5d3c125c88b5dd20',
    connectionId: '6a3c75dd5d3c125c88b5dd20',
    filterKey: 'test filterKey',
  };

  test('should pass the initial render', () => {
    renderWithProviders(<DynaNSSearchCriteria {...props} />);
    expect(screen.getByText('Additional search criteria')).toBeInTheDocument();
    expect(screen.getByText('Launch')).toBeInTheDocument();
  });
  test('should display the search criteria dialog when clicked on Launch button', async () => {
    renderWithProviders(<DynaNSSearchCriteria {...props} />);
    const launchButton = screen.getByText('Launch');

    expect(launchButton).toBeInTheDocument();
    await userEvent.click(launchButton);
    expect(screen.getByText('Operator')).toBeInTheDocument();
    expect(screen.getByText('Search Value')).toBeInTheDocument();
    expect(screen.getByText('Search Value 2')).toBeInTheDocument();
    expect(screen.getByText('Please select')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
    const fields = screen.getAllByRole('textbox');

    expect(fields).toHaveLength(3);
  });
  test('should make a dispatch call when clicked on refresh icon in the form', async () => {
    renderWithProviders(<DynaNSSearchCriteria {...props} />);
    const launchButton = screen.getByText('Launch');

    expect(launchButton).toBeInTheDocument();
    await userEvent.click(launchButton);
    const refreshButton = screen.getByText('Refresh button');

    expect(refreshButton).toBeInTheDocument();
    await userEvent.click(refreshButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalled());
  });
  test('should close the form when clocked on Close button', async () => {
    renderWithProviders(<DynaNSSearchCriteria {...props} />);
    const launchButton = screen.getByText('Launch');

    expect(launchButton).toBeInTheDocument();
    await userEvent.click(launchButton);
    const closeButton = screen.getByText('Close');

    expect(closeButton).toBeInTheDocument();
    expect(screen.getByText('Operator')).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(screen.queryByText('Operator')).toBeNull();
  });
});
