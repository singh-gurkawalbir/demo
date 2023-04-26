import { screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import DynaSortOrderSelect from './DynaSortOrderSelect';
import { renderWithProviders } from '../../../../test/test-utils';

const mockOnFieldChange = jest.fn();
const mockOnOrderChange = jest.fn();
const mockUnderScore = '_';

function initDynaSortOrderSelect(props) {
  renderWithProviders(<DynaSortOrderSelect {...props} />);
}

jest.mock('../../FieldHelp', () => ({
  __esModule: true,
  ...jest.requireActual('../../FieldHelp'),
  default: () => (
    <div>
      Mocking Field Help
    </div>
  )}));

jest.mock('../DynaRefreshableSelect', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaRefreshableSelect'),
  default: props => (
    <div>
      <button type="button" onClick={props.onFieldChange('testid')} data-testid="DynaRefreshableSelectWithNoValue" >
        Testing DynaRefreshableSelect with no new value
      </button>
      <button type="button" onClick={props.onFieldChange('testid', 'test')} data-testid="DynaRefreshableSelectWithValue" >
        Testing DynaRefreshableSelect with new value
      </button>
    </div>
  ),
}));

jest.mock('../DynaSelect', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaSelect'),
  default: props => (
    <div>
      <button type="button" onClick={props.onFieldChange(mockUnderScore, 'test')} data-testid="DynaSelect" >
        Testing DynaSelect
      </button>
    </div>
  ),
}));
describe('Testsuite for Dyna Sort Order Select', () => {
  afterEach(() => {
    mockOnFieldChange.mockClear();
    mockOnOrderChange.mockClear();
  });
  test('should test the Dyna Sort Order Select label and help text while rendering', () => {
    initDynaSortOrderSelect({id: '123', label: 'Test Label', value: '123', onFieldChange: mockOnFieldChange, isLoggable: true});
    expect(screen.getByText(/test label/i)).toBeInTheDocument();
    expect(screen.getByText(/Mocking Field Help/i)).toBeInTheDocument();
  });
  test('should test the Dyna Sort Order Select onfieldChange function when there is no new value passed', async () => {
    initDynaSortOrderSelect({id: '123', label: 'Test Label', value: '123', onFieldChange: mockOnFieldChange, isLoggable: true});
    const dynaRefreshableSelectTextBoxNode = screen.getByTestId('DynaRefreshableSelectWithNoValue');

    expect(dynaRefreshableSelectTextBoxNode).toBeInTheDocument();
    await userEvent.click(dynaRefreshableSelectTextBoxNode);
    expect(mockOnFieldChange).toHaveBeenCalledWith('testid', undefined);
  });
  test('should test the Dyna Sort Order Select onfieldChange function when there is new value passed', async () => {
    initDynaSortOrderSelect({id: '123', label: 'Test Label', value: '123', onFieldChange: mockOnFieldChange, isLoggable: true});
    const dynaRefreshableSelectTextBoxNode = screen.getByTestId('DynaRefreshableSelectWithValue');

    expect(dynaRefreshableSelectTextBoxNode).toBeInTheDocument();
    await userEvent.click(dynaRefreshableSelectTextBoxNode);
    expect(mockOnFieldChange).toHaveBeenCalledWith('testid', 'test');
  });
  test('should test the Dyna Sort Order Select onfieldChange function when there is new value passed which has multiple words in it', async () => {
    initDynaSortOrderSelect({id: '123', label: 'Test Label', value: 'Test 123', onFieldChange: mockOnFieldChange, isLoggable: true});
    const dynaRefreshableSelectTextBoxNode = screen.getByTestId('DynaRefreshableSelectWithValue');

    expect(dynaRefreshableSelectTextBoxNode).toBeInTheDocument();
    await userEvent.click(dynaRefreshableSelectTextBoxNode);
    expect(mockOnFieldChange).toHaveBeenCalledWith('testid', 'test 123');
  });
  test('should test the Dyna Sort Order Select onOrderChange function when there is new value passed in it', async () => {
    initDynaSortOrderSelect({id: '123', label: 'Test Label', value: 'Test', onFieldChange: mockOnOrderChange, isLoggable: true});
    const dynaSelectNode = screen.getByTestId('DynaSelect');

    expect(dynaSelectNode).toBeInTheDocument();
    await userEvent.click(dynaSelectNode);
    expect(mockOnOrderChange).toHaveBeenCalledWith('123', 'Test test');
  });
});
