import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OperandSettingsDialog from './OperandSettingsDialog';
import { getCreatedStore } from '../../../../../store';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';

const initialStore = getCreatedStore();

const mockReact = React;

jest.mock('@material-ui/core/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@material-ui/core/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

async function initSettingsDialog(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {filecsv: {
      fieldId: 'file.csv',
      formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
      resourceId: '5b3c75dd5d3c125c88b5dd20',
      resourceType: 'imports',
      sampleDataStatus: props.status,
      data: 'initial feature value',
      editorType: 'jsonParser',
    }};
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<OperandSettingsDialog {...props} />, {initialStore});
}

describe('operandSettingsDialog UI tests', () => {
  test('should pass the initial render', async () => {
    await initSettingsDialog({disabled: false, onClose: jest.fn()});
    expect(screen.getByRole('radio', {name: 'Value'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Field'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Expression'})).toBeInTheDocument();

    expect(screen.getByText('String')).toBeInTheDocument();
  });
  test('should render the Datatype dropdown when operand type is value', async () => {
    await initSettingsDialog({disabled: false, onClose: jest.fn()});
    expect(screen.queryByText('Boolean')).toBeNull();
    expect(screen.queryByText('Date Time')).toBeNull();
    expect(screen.queryByText('Number')).toBeNull();
    expect(screen.getByText('String')).toBeInTheDocument();
    await userEvent.click(screen.getByText('String'));
    expect(screen.getByText('Boolean')).toBeInTheDocument();
    expect(screen.getByText('Date Time')).toBeInTheDocument();
    expect(screen.getByText('Number')).toBeInTheDocument();
  });
  test('should render both dataType and Apply Functions dropdown when Operand type is field', async () => {
    await initSettingsDialog({disabled: false, ruleData: {dataType: 'string'}, onClose: jest.fn()});
    await userEvent.click(screen.getByRole('radio', {name: 'Field'}));
    await waitFor(() => expect(screen.getByRole('radio', {name: 'Field'})).toBeChecked());

    expect(screen.queryByText('Boolean')).toBeNull();
    expect(screen.queryByText('Date Time')).toBeNull();
    expect(screen.queryByText('Number')).toBeNull();
    expect(screen.getByText('String')).toBeInTheDocument();
    await userEvent.click(screen.getByText('String'));
    expect(screen.getByText('Boolean')).toBeInTheDocument();
    expect(screen.getByText('Date Time')).toBeInTheDocument();
    expect(screen.getByText('Number')).toBeInTheDocument();
    const selectButtons = screen.getAllByText('Please select');

    expect(screen.queryByText('Lowercase')).toBeNull();
    expect(screen.queryByText('Uppercase')).toBeNull();

    await userEvent.click(selectButtons[0]);
    await waitFor(() => expect(screen.getByText('Lowercase')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Uppercase')).toBeInTheDocument());
  });
  test('should render a different dropdown for ApplyFunctions field when dataType is number', async () => {
    const mockOnClose = jest.fn();

    await initSettingsDialog({disabled: false, ruleData: {dataType: 'number'}, onClose: mockOnClose});
    await userEvent.click(screen.getByRole('radio', {name: 'Field'}));
    await waitFor(() => expect(screen.getByRole('radio', {name: 'Field'})).toBeChecked());
    const selectButtons = screen.getAllByText('Please select');

    expect(screen.queryByText('Ceiling')).toBeNull();
    expect(screen.queryByText('Floor')).toBeNull();
    expect(screen.queryByText('Absolute')).toBeNull();

    await userEvent.click(selectButtons[0]);
    await waitFor(() => expect(screen.getByText('Ceiling')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Floor')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Absolute')).toBeInTheDocument());
  });
});

