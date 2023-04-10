import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OperandSettingsDialog from './OperandSettingsDialog';
import * as DynaSubmit from '../../../../DynaForm/DynaSubmit';
import * as FormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { renderWithProviders } from '../../../../../test/test-utils';

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();
let mockOptionsHandler = jest.fn();
const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
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

function initOperandSettingsDialog({
  ruleData,
  onClose,
  onSubmit,
  disabled,
  mockDynaSubmitData,
  optionHandlerData,
}) {
  jest.spyOn(DynaSubmit, 'default').mockImplementationOnce(
    props => (
      <>
        <div>Mocking Dyna Submit</div>
        <div>formKey = {props.formKey}</div>
        <button
          type="button" data-test={props['data-test']} onClick={() => props.onClick(mockDynaSubmitData)}
        >
          {props.children}
        </button>
      </>
    )
  );

  jest.spyOn(FormInitWithPermissions, 'default').mockImplementationOnce(
    props => {
      mockOptionsHandler = props.optionsHandler(...optionHandlerData);

      return 'mockFormKey';
    }
  );
  const ui = (
    <OperandSettingsDialog ruleData={ruleData} onClose={onClose} onSubmit={onSubmit} disabled={disabled} />
  );

  return renderWithProviders(ui);
}

// Mocking ModalDialog as part of unit testing
jest.mock('../../../../ModalDialog', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../ModalDialog'),
  default: props => (
    <>
      <div>Mocking Modal Dialog Box</div>
      <div>show = {props.show}</div>
      <button type="button" onClick={() => props.onClick}>Close</button>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking DynaForm as part of unit testing
jest.mock('../../../../DynaForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../DynaForm'),
  default: props => (
    <>
      <div>Mocking Dyna Form</div>
      <div>formKey = {JSON.stringify(props.formKey)}</div>
    </>
  ),
}));

// Mocking Action Group as part of unit testing
jest.mock('../../../../ActionGroup', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../ActionGroup'),
  default: props => (
    <>
      <div>Mocking Action Group</div>
      <div>{props.children}</div>
    </>
  ),
}));

describe('Testsuite for OperandSettingsDialog', () => {
  afterEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
  });
  test('should test operand settings dialog when there are no formvalues and click on save button when the formValues doesn\'t have transformations and no data types', async () => {
    initOperandSettingsDialog({
      onClose: mockOnClose,
      onSubmit: mockOnSubmit,
      mockDynaSubmitData: {
        transformations: undefined,
      },
      optionHandlerData: '',
    });
    expect(screen.getByText(/mocking modal dialog box/i)).toBeInTheDocument();
    expect(screen.getByText(/show =/i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {
      name: /close/i,
    });

    expect(closeButtonNode).toBeInTheDocument();
    expect(screen.getByText(/operand settings/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking dyna form/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking action group/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking dyna submit/i)).toBeInTheDocument();
    expect(mockOptionsHandler).toBeNull();
    const saveButtonNode = screen.getByRole('button', {
      name: /save/i,
    });

    expect(saveButtonNode).toBeInTheDocument();
    await userEvent.click(saveButtonNode);
    expect(mockOnSubmit).toHaveBeenCalledWith({dataType: undefined, transformations: [], type: undefined});
  });
  test('should test operand settings dialog when there are no formvalues and click on save button when the formValues has transformations and of data type string', async () => {
    initOperandSettingsDialog({
      onClose: mockOnClose,
      onSubmit: mockOnSubmit,
      mockDynaSubmitData: {
        type: 'test_type',
        transformations: ['lowercase', 'uppercase'],
        dataType: 'string',
      },
      optionHandlerData: ['transformations', [{id: 'dataType', value: 'string'}]],
    });
    expect(screen.getByText(/mocking modal dialog box/i)).toBeInTheDocument();
    expect(screen.getByText(/show =/i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {
      name: /close/i,
    });

    expect(closeButtonNode).toBeInTheDocument();
    expect(screen.getByText(/operand settings/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking dyna form/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking action group/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking dyna submit/i)).toBeInTheDocument();
    expect(mockOptionsHandler).toEqual([{items: [{label: 'Lowercase', value: 'lowercase'}, {label: 'Uppercase', value: 'uppercase'}]}]);
    const saveButtonNode = screen.getByRole('button', {
      name: /save/i,
    });

    expect(saveButtonNode).toBeInTheDocument();
    await userEvent.click(saveButtonNode);
    expect(mockOnSubmit).toHaveBeenCalledWith({dataType: 'string', transformations: ['lowercase', 'uppercase'], type: 'test_type'});
  });
  test('should test operand settings dialog when there are no formvalues and click on save button when the formValues has transformations and of data type number', async () => {
    initOperandSettingsDialog({
      onClose: mockOnClose,
      onSubmit: mockOnSubmit,
      mockDynaSubmitData: {
        type: 'expression',
        transformations: ['ceiling', 'floor', 'abs'],
        dataType: 'number',
      },
      optionHandlerData: ['transformations', [{id: 'dataType', value: 'number'}]],
    });
    expect(screen.getByText(/mocking modal dialog box/i)).toBeInTheDocument();
    expect(screen.getByText(/show =/i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {
      name: /close/i,
    });

    expect(closeButtonNode).toBeInTheDocument();
    expect(screen.getByText(/operand settings/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking dyna form/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking action group/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking dyna submit/i)).toBeInTheDocument();
    const saveButtonNode = screen.getByRole('button', {
      name: /save/i,
    });

    expect(mockOptionsHandler).toEqual([{items: [{label: 'Ceiling', value: 'ceiling'}, {label: 'Floor', value: 'floor'}, {label: 'Absolute', value: 'abs'}]}]);

    expect(saveButtonNode).toBeInTheDocument();
    await userEvent.click(saveButtonNode);
    expect(mockOnSubmit).toHaveBeenCalledWith({dataType: '', transformations: ['ceiling', 'floor', 'abs'], type: 'expression'});
  });
  test('should test operand settings dialog and test the cancel button', async () => {
    initOperandSettingsDialog({
      onClose: mockOnClose,
      onSubmit: mockOnSubmit,
      mockDynaSubmitData: {
        transformations: undefined,
      },
      optionHandlerData: ['transformations', [{id: 'dataType', value: 'test'}]],
    });
    const cancelButtonNode = screen.getByRole('button', {
      name: /cancel/i,
    });

    expect(cancelButtonNode).toBeInTheDocument();
    await userEvent.click(cancelButtonNode);
    expect(mockOptionsHandler).toEqual([{items: []}]);
    expect(mockOnClose).toHaveBeenCalled();
  });
});

