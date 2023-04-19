import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import MultiSelectApplication from '.';
import { renderWithProviders } from '../../../../test/test-utils';

const mockOnFieldChange = jest.fn();

function initMultiSelectApplication({props}) {
  const ui = (
    <MultiSelectApplication {...props} />
  );

  return renderWithProviders(ui);
}

// Mocking Field Help child component as part of unit testing
jest.mock('../../FieldHelp', () => ({
  __esModule: true,
  ...jest.requireActual('../../FieldHelp'),
  default: jest.fn().mockReturnValue(<div>Mock Field Help</div>),
}));

// Mocking Field Message child component as part of unit testing
jest.mock('../FieldMessage', () => ({
  __esModule: true,
  ...jest.requireActual('../FieldMessage'),
  default: jest.fn().mockReturnValue(<div>Mock Field Message</div>),
}));
// Mocking Integration tag child component as part of unit testing
jest.mock('../../../tags/IntegrationTag', () => ({
  __esModule: true,
  ...jest.requireActual('../../../tags/IntegrationTag'),
  default: props => (
    <div>
      <div>Mocking IntegrationTag</div>
      <div>label = {props.label}</div>
    </div>
  ),
}));
// Mocking Search Icon child component as part of unit testing
jest.mock('../../../icons/SearchIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/SearchIcon'),
  default: jest.fn().mockReturnValue(<div>Mock Search Icon</div>),
}));
// Mocking Done button child component as part of unit testing
jest.mock('../../../CeligoSelect', () => ({
  __esModule: true,
  ...jest.requireActual('../../../CeligoSelect'),
  DoneButton: props => (
    <button id={props.id} onClick={props.onClose} type="button">
      Done Button
    </button>
  ),
}));
// Mocking Application Image child component as part of unit testing
jest.mock('../../../icons/ApplicationImg', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/ApplicationImg'),
  default: props => (
    <div>
      <div>Mock Application Image</div>
      <div>type = {props.type}</div>
      <div>assistant = {props.assistant}</div>
    </div>
  ),
}));
describe('Testsuite for Multi Select Application', () => {
  afterEach(() => {
    mockOnFieldChange.mockClear();
  });
  test('should select and multiple application by typing an application name', async () => {
    const props = {
      disabled: false,
      id: 'test_id',
      label: 'test_label',
      required: true,
      placeholder: 'test_place_holder',
      isValid: true,
      options: [{items: [{value: 'accelo', label: 'Accelo', icon: 'accelo', type: 'rest'}, {value: 'test', label: 'Test', icon: 'test', type: 'rest'}]}],
      onFieldChange: mockOnFieldChange,
      creatableMultiSelect: true,
      hideApplicationImg: true,
      isLoggable: true,
    };

    initMultiSelectApplication({props});
    expect(screen.getByText(/mock search icon/i)).toBeInTheDocument();
    expect(screen.getByText(/mock field message/i)).toBeInTheDocument();
    const inputButtonNode = document.querySelector('input');

    expect(inputButtonNode).toBeInTheDocument();
    await userEvent.type(inputButtonNode, 'acce');
    await userEvent.click(screen.getByText('Accelo'));
    expect(screen.getByText('accelo')).toBeInTheDocument();
    await userEvent.type(inputButtonNode, 'tes');
    await userEvent.click(screen.getByText('Test'));
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', ['accelo', 'test']);
  });
  test('should test the search icon and select and application by typing an application name', async () => {
    const props = {
      disabled: false,
      id: 'test_id',
      label: 'test_label',
      required: true,
      placeholder: 'test_place_holder',
      isValid: true,
      options: [{items: [{value: 'accelo', label: 'Accelo', icon: 'accelo', type: 'rest'}]}],
      onFieldChange: mockOnFieldChange,
      creatableMultiSelect: true,
      hideApplicationImg: true,
      isLoggable: true,
    };

    initMultiSelectApplication({props});
    expect(screen.getByText(/mock search icon/i)).toBeInTheDocument();
    expect(screen.getByText(/mock field message/i)).toBeInTheDocument();
    const inputButtonNode = document.querySelector('input');

    expect(inputButtonNode).toBeInTheDocument();
    expect(inputButtonNode).toHaveValue('');
    await userEvent.type(inputButtonNode, 'acce');
    await userEvent.click(screen.getByText('Accelo'));
    expect(screen.getByText('accelo')).toBeInTheDocument();
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', ['accelo']);
  });
  test('should render the form label and field help when isValid and required set to true', () => {
    const props = {
      disabled: true,
      id: 'test_id',
      label: 'test_label',
      required: true,
      placeholder: 'test_place_holder',
      isValid: true,
      options: [{items: []}],
      onFieldChange: mockOnFieldChange,
      creatableMultiSelect: true,
      hideApplicationImg: true,
      isLoggable: true,
    };

    initMultiSelectApplication({props});
    expect(screen.getByText(/test_label/i)).toBeInTheDocument();
    expect(document.querySelector('label').className).toEqual(expect.stringContaining('Mui-required'));
    expect(screen.getByText(/mock field help/i)).toBeInTheDocument();
  });
  test('should render the form label and field help when isValid and required set to false', () => {
    const props = {
      disabled: true,
      id: 'test_id',
      label: 'test_label',
      required: false,
      placeholder: 'test_place_holder',
      isValid: false,
      options: [{items: []}],
      onFieldChange: mockOnFieldChange,
      creatableMultiSelect: true,
      hideApplicationImg: true,
      isLoggable: true,
    };

    initMultiSelectApplication({props});
    expect(screen.getByText(/test_label/i)).toBeInTheDocument();
    expect(document.querySelector('label').className).toEqual(expect.stringContaining('Mui-disabled'));
    expect(document.querySelector('label').className).toEqual(expect.stringContaining('Mui-error'));
    expect(screen.getByText(/mock field help/i)).toBeInTheDocument();
  });
  test('should test the multi select application when there is a default value', async () => {
    const props = {
      disabled: false,
      id: 'test_id',
      label: 'test_label',
      required: false,
      placeholder: 'test_place_holder',
      isValid: false,
      options: [{items: [{value: 'accelo', label: 'Accelo', icon: 'accelo', type: 'rest'}, {value: 'test', label: 'Test', icon: 'test', type: 'rest'}]}],
      value: ['accelo'],
      onFieldChange: mockOnFieldChange,
      creatableMultiSelect: true,
      hideApplicationImg: false,
      isLoggable: true,
    };

    initMultiSelectApplication({props});
    expect(screen.getByText(/accelo/i)).toBeInTheDocument();
    const acceloApplicationCloseButtonNode = document.querySelector('svg[viewBox="0 0 20 20"]');

    expect(acceloApplicationCloseButtonNode).toBeInTheDocument();
    await userEvent.click(acceloApplicationCloseButtonNode);
    waitFor(() => {
      expect(screen.getByText(/option accelo, deselected\./i)).toBeInTheDocument();
      expect(screen.getByText(
        /0 results available\. select is focused ,type to refine list, press down to open the menu, press left to focus selected values/i
      )).toBeInTheDocument();
    });
    const inputButtonNode = document.querySelector('input');

    expect(inputButtonNode).toBeInTheDocument();
    expect(inputButtonNode).toHaveValue('');
    await userEvent.type(inputButtonNode, 'acce');
    await userEvent.click(screen.getByText('Accelo'));
    expect(screen.getByText('accelo')).toBeInTheDocument();
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', ['accelo']);
  });
  test('should select an application checkbox by typing an application name and click on done', async () => {
    const props = {
      disabled: false,
      id: 'test_id',
      label: 'test_label',
      required: true,
      placeholder: 'test_place_holder',
      isValid: true,
      options: [{items: [{value: 'accelo', label: 'Accelo', icon: 'accelo', type: 'rest'}, {value: 'test', label: 'Test', icon: 'test', type: 'webhook'}]}],
      onFieldChange: mockOnFieldChange,
      creatableMultiSelect: true,
      hideApplicationImg: true,
      isLoggable: true,
    };

    initMultiSelectApplication({props});
    expect(screen.getByText(/mock search icon/i)).toBeInTheDocument();
    expect(screen.getByText(/mock field message/i)).toBeInTheDocument();
    const inputButtonNode = document.querySelector('input');

    expect(inputButtonNode).toBeInTheDocument();
    await userEvent.type(inputButtonNode, 'tes');
    await userEvent.click(screen.getByText('Test'));
    await userEvent.type(inputButtonNode, 'acce');
    const doneButton = screen.getByRole('button', {name: 'Done Button'});

    expect(doneButton).toBeInTheDocument();
    await userEvent.click(doneButton);
    expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', ['test']);
  });
  test('should select an application checkbox by typing an application name when the multiselect and hideApplicationImage is set to false', async () => {
    const props = {
      disabled: false,
      id: 'test_id',
      label: 'test_label',
      required: true,
      placeholder: 'test_place_holder',
      isValid: true,
      options: [{items: [{value: 'accelo', label: 'Accelo', icon: 'accelo', type: 'rest'}, {value: 'test', label: 'Test', icon: 'test', type: 'webhook'}]}],
      onFieldChange: mockOnFieldChange,
      creatableMultiSelect: false,
      hideApplicationImg: false,
      isLoggable: true,
    };

    initMultiSelectApplication({props});
    expect(screen.getByText(/mock search icon/i)).toBeInTheDocument();
    expect(screen.getByText(/mock field message/i)).toBeInTheDocument();
    waitFor(async () => {
      const inputButtonNode = document.querySelector('input');

      expect(inputButtonNode).toBeInTheDocument();
      await userEvent.type(inputButtonNode, 'tes');
      expect(screen.getByText(/mock application image/i)).toBeInTheDocument();
      expect(screen.getByText(/type = test/i)).toBeInTheDocument();
      await userEvent.click(screen.getByText('Test'));
      expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', ['test']);
    });
  });
  test('should select an published application checkbox by typing an application name when the multiselect and hideApplicationImage is set to false', async () => {
    const props = {
      disabled: false,
      id: 'test_id',
      label: 'test_label',
      required: true,
      placeholder: 'test_place_holder',
      isValid: true,
      options: [{items: [{value: 'accelo', label: 'Accelo', icon: 'accelo', type: 'rest', published: true}, {value: 'test', label: 'Test', icon: 'test', type: 'webhook'}]}],
      onFieldChange: mockOnFieldChange,
      creatableMultiSelect: false,
      hideApplicationImg: false,
      isLoggable: true,
    };

    initMultiSelectApplication({props});
    expect(screen.getByText(/mock search icon/i)).toBeInTheDocument();
    expect(screen.getByText(/mock field message/i)).toBeInTheDocument();
    waitFor(async () => {
      const inputButtonNode = document.querySelector('input');

      expect(inputButtonNode).toBeInTheDocument();
      await userEvent.type(inputButtonNode, 'acce');
      expect(screen.getByText(/mock application image/i)).toBeInTheDocument();
      expect(screen.getByText(/type = rest/i)).toBeInTheDocument();
      await userEvent.click(screen.getByText('Accelo'));
      expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', ['accelo']);
    });
  });
});
