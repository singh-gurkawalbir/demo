import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextFieldWithClipboardSupport from './DynaText';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import * as mockEnqueSnackbar from '../../../hooks/enqueueSnackbar';
import { getCreatedStore } from '../../../store';

let initialStore;
const enqueueSnackbar = jest.fn();
const mockOnFieldChange = jest.fn();

function initTextFieldWithClipboardSupport({props, resourcesData, resourceType, id}) {
  mutateStore(initialStore, draft => {
    draft.data.resources = resourcesData;
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/test/${resourceType}/${id}`}]}
    >
      <Route
        path="/test/:resourceType/:id"
        params={{resourceType, id}}
      >
        <TextFieldWithClipboardSupport {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

// Mocking Field Help Child Component for unit testing
jest.mock('../FieldHelp', () => ({
  __esModule: true,
  ...jest.requireActual('../FieldHelp'),
  default: jest.fn().mockReturnValue(<div>Mock Field Help</div>),
}));

// Mocking Help Link Child Component for unit testing
jest.mock('../../HelpLink', () => ({
  __esModule: true,
  ...jest.requireActual('../../HelpLink'),
  default: jest.fn().mockReturnValue(<div>Mock Help Link</div>),
}));

// Mocking Field Message Child Component for unit testing
jest.mock('./FieldMessage', () => ({
  __esModule: true,
  ...jest.requireActual('./FieldMessage'),
  default: props => (
    <div>
      <div>Mocking Field message</div>
      <div>isValid = {props.isValid}</div>
      <div>description = {props.description}</div>
      <div>errorMessages = {props.errorMessages}</div>
    </div>
  ),
}));

describe('Testsuite for TextFieldWithClipboardSupport', () => {
  beforeEach(() => {
    jest.spyOn(mockEnqueSnackbar, 'default').mockReturnValue([enqueueSnackbar]);
    initialStore = getCreatedStore();
  });
  afterEach(() => {
    enqueueSnackbar.mockClear();
    mockOnFieldChange.mockClear();
  });
  test('should test the disabled textbox when the clipboard is set to false and disabled is set to true', () => {
    const props = {
      copyToClipboard: false,
      value: 'test_value',
      subSectionField: true,
      className: 'test_class_name',
      description: 'test_description',
      disabled: true,
      errorMessages: 'test_error_messages',
      id: 'test_id',
      name: 'test_name',
      onFieldChange: mockOnFieldChange,
      placeholder: 'test_place_holder',
      required: true,
      label: 'test_label',
      multiline: true,
      delimiter: '',
      rowMax: '',
      maxLength: '',
    };

    const resourcesData = {
      connections: [{
        id: 'conn_id',
      }],
    };

    initTextFieldWithClipboardSupport({props, resourcesData, resourceType: 'connections', id: 'conn_id'});
    expect(screen.getByText(/test_label/i)).toBeInTheDocument();
    expect(screen.getByText(/mock field help/i)).toBeInTheDocument();
    expect(screen.getByText(/mock help link/i)).toBeInTheDocument();
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    expect(textBoxNode).toBeDisabled();
  });
  test('should test the textbox by changing the value when the clipboard is set to false and when there is delimiter and when the uppsercase is set to true', async () => {
    const props = {
      copyToClipboard: false,
      value: 'test_value',
      subSectionField: true,
      className: 'test_class_name',
      description: 'test_description',
      disabled: false,
      errorMessages: 'test_error_messages',
      id: 'test_id',
      name: 'test_name',
      onFieldChange: mockOnFieldChange,
      placeholder: 'test_place_holder',
      required: true,
      label: 'test_label',
      multiline: true,
      delimiter: ',',
      rowMax: '',
      maxLength: '',
      isApplicationPlaceholder: true,
      options: 'test_options',
      uppercase: true,
    };

    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        type: 'http',
      }],
    };

    initTextFieldWithClipboardSupport({props, resourcesData, resourceType: 'connections', id: 'conn_id'});
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', 'test_options', true);
    mockOnFieldChange.mockClear();
    expect(screen.getByText(/test_label/i)).toBeInTheDocument();
    expect(screen.getByText(/mock field help/i)).toBeInTheDocument();
    expect(screen.getByText(/mock help link/i)).toBeInTheDocument();
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    expect(textBoxNode).toHaveValue('test_value');
    await userEvent.type(textBoxNode, 'vewhucw');
    await waitFor(() => expect(mockOnFieldChange).toHaveBeenCalledTimes(7));
  });
  test('should test the textbox by changing the value when the clipboard is set to false and when there is no delimiter', async () => {
    const props = {
      copyToClipboard: false,
      value: 'test_value',
      subSectionField: true,
      className: 'test_class_name',
      description: 'test_description',
      disabled: false,
      errorMessages: 'test_error_messages',
      id: 'test_id',
      name: 'test_name',
      onFieldChange: mockOnFieldChange,
      placeholder: 'test_place_holder',
      required: true,
      label: 'test_label',
      multiline: true,
      delimiter: '',
      rowMax: '',
      maxLength: '',
      isApplicationPlaceholder: true,
      options: 'test_options',
    };

    const resourcesData = {
      connections: [{
        _id: 'conn_id',
        type: 'http',
      }],
    };

    initTextFieldWithClipboardSupport({props, resourcesData, resourceType: 'connections', id: 'conn_id'});
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', 'test_options', true);
    mockOnFieldChange.mockClear();
    expect(screen.getByText(/test_label/i)).toBeInTheDocument();
    expect(screen.getByText(/mock field help/i)).toBeInTheDocument();
    expect(screen.getByText(/mock help link/i)).toBeInTheDocument();
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    expect(textBoxNode).toHaveValue('test_value');
    await userEvent.type(textBoxNode, 'vewhucw');
    await waitFor(() => expect(mockOnFieldChange).toHaveBeenCalledTimes(7));
  });
  test('should test the textbox placeholder to have lookup name when the resource is not of type connection', async () => {
    const props = {
      copyToClipboard: false,
      value: 'test_value',
      subSectionField: true,
      className: 'test_class_name',
      description: 'test_description',
      disabled: false,
      errorMessages: 'test_error_messages',
      id: 'test_id',
      name: 'test_name',
      onFieldChange: mockOnFieldChange,
      placeholder: 'test_place_holder',
      required: true,
      label: 'test_label',
      multiline: true,
      delimiter: '',
      rowMax: '',
      maxLength: '',
      isApplicationPlaceholder: true,
      options: 'test_options',
      inputType: 'number',
    };

    const resourcesData = {
      exports: [{
        _id: 'export_id',
        adaptorType: 'http',
        isLookup: true,
      }],
    };

    initTextFieldWithClipboardSupport({props, resourcesData, resourceType: 'exports', id: 'export_id'});
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', 'test_options', true);
    mockOnFieldChange.mockClear();
    expect(screen.getByText(/test_label/i)).toBeInTheDocument();
    expect(screen.getByText(/mock field help/i)).toBeInTheDocument();
    expect(screen.getByText(/mock help link/i)).toBeInTheDocument();
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    expect(textBoxNode).toHaveValue('test_value');
    expect(textBoxNode.getAttribute('placeholder')).toBe('test_place_holder');
    await userEvent.type(textBoxNode, 'vewhucw');
    await waitFor(() => expect(mockOnFieldChange).toHaveBeenCalledTimes(7));
  });
  test('should test the textbox placeholder to have http export when the resource is not of type connection and when isLookup is set to false', async () => {
    const props = {
      copyToClipboard: false,
      value: 'test_value',
      subSectionField: true,
      className: 'test_class_name',
      description: 'test_description',
      disabled: false,
      errorMessages: 'test_error_messages',
      id: 'test_id',
      name: 'test_name',
      onFieldChange: mockOnFieldChange,
      placeholder: 'test_place_holder',
      required: true,
      label: 'test_label',
      multiline: true,
      delimiter: '',
      rowMax: '',
      maxLength: '',
      isApplicationPlaceholder: true,
      options: 'test_options',
      inputType: 'number',
    };

    const resourcesData = {
      exports: [{
        _id: 'export_id',
        adaptorType: 'http',
        isLookup: false,
      }],
    };

    initTextFieldWithClipboardSupport({props, resourcesData, resourceType: 'exports', id: 'export_id'});
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', 'test_options', true);
    mockOnFieldChange.mockClear();
    expect(screen.getByText(/test_label/i)).toBeInTheDocument();
    expect(screen.getByText(/mock field help/i)).toBeInTheDocument();
    expect(screen.getByText(/mock help link/i)).toBeInTheDocument();
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    expect(textBoxNode).toHaveValue('test_value');
    expect(textBoxNode.getAttribute('placeholder')).toBe('test_place_holder');
    await userEvent.type(textBoxNode, 'vewhucw');
    await waitFor(() => expect(mockOnFieldChange).toHaveBeenCalledTimes(7));
  });
  test('should test the textbox placeholder when the startAdornment and endAdornment set to true', async () => {
    const props = {
      copyToClipboard: false,
      subSectionField: true,
      className: 'test_class_name',
      description: 'test_description',
      disabled: false,
      errorMessages: 'test_error_messages',
      id: 'test_id',
      name: 'test_name',
      onFieldChange: mockOnFieldChange,
      placeholder: 'test_place_holder',
      required: true,
      label: 'test_label',
      multiline: true,
      delimiter: '',
      rowMax: '',
      maxLength: '10',
      isApplicationPlaceholder: true,
      options: 'test_options',
      inputType: 'number',
      startAdornment: true,
      endAdornment: true,
      readOnly: true,
    };

    const resourcesData = {
      exports: [{
        _id: 'export_id',
        adaptorType: 'http',
        isLookup: false,
      }],
    };

    initTextFieldWithClipboardSupport({props, resourcesData, resourceType: 'exports', id: 'export_id'});
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', 'test_options', true);
    mockOnFieldChange.mockClear();
    expect(screen.getByText(/test_label/i)).toBeInTheDocument();
    expect(screen.getByText(/mock field help/i)).toBeInTheDocument();
    expect(screen.getByText(/mock help link/i)).toBeInTheDocument();
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    expect(textBoxNode.className).toEqual(expect.stringContaining('inputAdornedStart'));
    expect(textBoxNode.className).toEqual(expect.stringContaining('inputAdornedEnd'));
  });
  test('should test the copy clipboard button', async () => {
    const props = {
      copyToClipboard: true,
      subSectionField: true,
      className: 'test_class_name',
      description: 'test_description',
      disabled: false,
      errorMessages: 'test_error_messages',
      id: 'test_id',
      name: 'test_name',
      onFieldChange: mockOnFieldChange,
      placeholder: 'test_place_holder',
      required: true,
      label: 'test_label',
      multiline: true,
      delimiter: '',
      rowMax: '',
      maxLength: '10',
      isApplicationPlaceholder: true,
      options: 'test_options',
      inputType: 'number',
      startAdornment: true,
      endAdornment: true,
      readOnly: true,
      isLabelUpdate: true,
    };

    const resourcesData = {
      exports: [{
        _id: 'export_id',
        adaptorType: 'http',
        isLookup: false,
      }],
    };

    initTextFieldWithClipboardSupport({props, resourcesData, resourceType: 'exports', id: 'export_id'});
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', 'test_options', true);
    mockOnFieldChange.mockClear();
    expect(screen.getByText(/mock field help/i)).toBeInTheDocument();
    expect(screen.getByText(/mock help link/i)).toBeInTheDocument();
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    expect(textBoxNode.className).toEqual(expect.stringContaining('inputAdornedStart'));
    expect(textBoxNode.className).toEqual(expect.stringContaining('inputAdornedEnd'));
    const copyToClipBoardButtonNode = document.querySelector('button[data-test="copyToClipboard"]');

    expect(copyToClipBoardButtonNode).toBeInTheDocument();
    await userEvent.click(copyToClipBoardButtonNode);
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: 'Copied to clipboard'});
  });
});
