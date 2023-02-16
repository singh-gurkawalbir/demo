import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OperandSettingsDialog, {optionsHandler} from './OperandSettingsDialog';
import * as DynaSubmit from '../../../../DynaForm/DynaSubmit';
import * as FormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

function initOperandSettingsDialog({
  ruleData,
  onClose,
  onSubmit,
  disabled,
}) {
  const ui = (
    <OperandSettingsDialog ruleData={ruleData} onClose={onClose} onSubmit={onSubmit} disabled={disabled} />
  );

  return render(ui);
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
      <div>formKey = {props.formKey}</div>
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

describe('OperandSettingsDialog', () => {
  describe('Testsuite for OperandSettingsDialog', () => {
    afterEach(() => {
      mockOnClose.mockClear();
      mockOnSubmit.mockClear();
    });
    test('should test operand settings dialog when there are no formvalues and click on save button when the formValues doesn\'t have transformations and no data types', () => {
      jest.spyOn(DynaSubmit, 'default').mockImplementationOnce(
        props => (
          <>
            <div>Mocking Dyna Submit</div>
            <div>formKey = {props.formKey}</div>
            <button
              type="button" data-test={props['data-test']} onClick={() => props.onClick({
                transformations: undefined,
              })}
            >
              {props.children}
            </button>
          </>
        )
      );
      jest.spyOn(FormInitWithPermissions, 'default').mockReturnValueOnce('mockFormKey');
      initOperandSettingsDialog({
        onClose: mockOnClose,
        onSubmit: mockOnSubmit,
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

      expect(saveButtonNode).toBeInTheDocument();
      userEvent.click(saveButtonNode);
      expect(mockOnSubmit).toHaveBeenCalledWith({dataType: undefined, transformations: [], type: undefined});
    });
    test('should test operand settings dialog when there are no formvalues and click on save button when the formValues has transformations and of data type string', () => {
      jest.spyOn(DynaSubmit, 'default').mockImplementationOnce(
        props => (
          <>
            <div>Mocking Dyna Submit</div>
            <div>formKey = {props.formKey}</div>
            <button
              type="button" data-test={props['data-test']} onClick={() => props.onClick({
                type: 'test_type',
                transformations: ['lowercase', 'uppercase'],
                dataType: 'string',
              })}
            >
              {props.children}
            </button>
          </>
        )
      );
      jest.spyOn(FormInitWithPermissions, 'default').mockReturnValueOnce('mockFormKey');
      initOperandSettingsDialog({
        onClose: mockOnClose,
        onSubmit: mockOnSubmit,
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

      expect(saveButtonNode).toBeInTheDocument();
      userEvent.click(saveButtonNode);
      expect(mockOnSubmit).toHaveBeenCalledWith({dataType: 'string', transformations: ['lowercase', 'uppercase'], type: 'test_type'});
    });
    test('should test operand settings dialog when there are no formvalues and click on save button when the formValues has transformations and of data type number', () => {
      jest.spyOn(DynaSubmit, 'default').mockImplementationOnce(
        props => (
          <>
            <div>Mocking Dyna Submit</div>
            <div>formKey = {props.formKey}</div>
            <button
              type="button" data-test={props['data-test']} onClick={() => props.onClick({
                type: 'expression',
                transformations: ['ceiling', 'floor', 'abs'],
                dataType: 'number',
              })}
            >
              {props.children}
            </button>
          </>
        )
      );
      jest.spyOn(FormInitWithPermissions, 'default').mockReturnValueOnce('mockFormKey');
      initOperandSettingsDialog({
        onClose: mockOnClose,
        onSubmit: mockOnSubmit,
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

      expect(saveButtonNode).toBeInTheDocument();
      userEvent.click(saveButtonNode);
      expect(mockOnSubmit).toHaveBeenCalledWith({dataType: '', transformations: ['ceiling', 'floor', 'abs'], type: 'expression'});
    });
    test('should test operand settings dialog and test the cancel button', () => {
      jest.spyOn(DynaSubmit, 'default').mockImplementationOnce(
        props => (
          <>
            <div>Mocking Dyna Submit</div>
            <div>formKey = {props.formKey}</div>
            <button
              type="button" data-test={props['data-test']} onClick={() => props.onClick({
                transformations: undefined,
              })}
            >
              {props.children}
            </button>
          </>
        )
      );
      jest.spyOn(FormInitWithPermissions, 'default').mockReturnValueOnce('mockFormKey');
      initOperandSettingsDialog({
        onClose: mockOnClose,
        onSubmit: mockOnSubmit,
      });
      const cancelButtonNode = screen.getByRole('button', {
        name: /cancel/i,
      });

      expect(cancelButtonNode).toBeInTheDocument();
      userEvent.click(cancelButtonNode);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
  describe('Testsuite for OptionHandler', () => {
    test('should test optionHandler when the fieldId is not equal to transformations', () => {
      const testOptionHandler = optionsHandler();

      expect(testOptionHandler).toBeNull();
    });
    test('should test optionHandler when the fieldId is equal to transformations and the datatype is number', () => {
      const testOptionHandler = optionsHandler('transformations', [{id: 'dataType', value: 'number'}]);

      expect(testOptionHandler).toEqual([{items: [{label: 'Ceiling', value: 'ceiling'}, {label: 'Floor', value: 'floor'}, {label: 'Absolute', value: 'abs'}]}]);
    });
    test('should test optionHandler when the fieldId is equal to transformations and the datatype is string', () => {
      const testOptionHandler = optionsHandler('transformations', [{id: 'dataType', value: 'string'}]);

      expect(testOptionHandler).toEqual([{items: [{label: 'Lowercase', value: 'lowercase'}, {label: 'Uppercase', value: 'uppercase'}]}]);
    });
    test('should test optionHandler when the fieldId is equal to transformations and the datatype is not equal to string and number', () => {
      const testOptionHandler = optionsHandler('transformations', [{id: 'dataType', value: 'test'}]);

      expect(testOptionHandler).toEqual([{items: []}]);
    });
  });
});
