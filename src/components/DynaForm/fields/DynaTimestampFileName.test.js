import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaTimestampFileName from './DynaTimestampFileName';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';

let initialStore;
const mockOnFieldChange = jest.fn();

function initDynaTimestampFileName({props}) {
  mutateStore(initialStore, draft => {
    draft.user.profile = {
      timezone: 'Asia/Calcutta',
    };
    draft.session.flowData = {
      [props.flowId]: {
        pageGeneratorsMap: {},
        pageProcessorsMap: {
          [props.resourceId]: {
            preMap: {
              status: 'requested',
            },
            inputFilter: {},
            processedFlowInput: {},
            flowInput: {
              status: 'requested',
            },
          },
        },
        routersMap: {},
        pageGenerators: [
          {
            _exportId: 'export_id',
          },
        ],
        pageProcessors: [
          {
            responseMapping: {
              fields: [],
              lists: [],
            },
            type: 'import',
            _importId: 'import_id',
          },
        ],
        routers: [],
        refresh: false,
        formKey: 'imports-import_id',
      },
    };
  });
  const ui = (
    <DynaTimestampFileName {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}

// Mocking Field Message child component as part of unit testing
jest.mock('./FieldMessage', () => ({
  __esModule: true,
  ...jest.requireActual('./FieldMessage'),
  default: props => (
    <div>
      <div>Mock Field Message</div>
      <div>isValid = {props.isValid}</div>
      <div>description = {props.description}</div>
      <div>errorMessages = {props.errorMessages}</div>
    </div>
  ),
}));
// Mocking Field Help child component as part of unit testing
jest.mock('../FieldHelp', () => ({
  __esModule: true,
  ...jest.requireActual('../FieldHelp'),
  default: jest.fn().mockReturnValue(<div>Mock Field Help</div>),
}));

describe('Testsuite for DynaTimestampFileName', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  afterEach(() => {
    mockOnFieldChange.mockClear();
  });
  test('should render the label and field help', () => {
    const props = {
      description: 'test_description',
      errorMessages: 'test_errormessage',
      id: 'test_id',
      flowId: 'flow_id',
      resourceId: 'import_id',
      resourceType: 'imports',
      isValid: true,
      disabled: true,
      placeholder: 'test_placeholder',
      onFieldChange: mockOnFieldChange,
      name: 'test_name',
      label: 'test_label',
      required: true,
      isLoggable: true,
    };

    initDynaTimestampFileName({props});
    expect(screen.getByText(/test_label/i)).toBeInTheDocument();
    expect(screen.getByText(/mock field help/i)).toBeInTheDocument();
  });
  test('should test the input box text change', async () => {
    const props = {
      description: 'test_description',
      errorMessages: 'test_errormessage',
      id: 'test_id',
      flowId: 'flow_id',
      resourceId: 'import_id',
      resourceType: 'imports',
      isValid: true,
      disabled: false,
      placeholder: 'test_placeholder',
      onFieldChange: mockOnFieldChange,
      name: 'test_name',
      label: 'test_label',
      required: true,
      isLoggable: true,
    };

    initDynaTimestampFileName({props});
    const textBox = document.querySelector('input[name="test_name"]');

    expect(textBox).toBeInTheDocument();
    await userEvent.click(textBox);
    await waitFor(async () => {
      textBox.focus();
      await userEvent.paste('{{');
      expect(mockOnFieldChange).toHaveBeenCalledWith('test_id', '{{');
    });
  });
  test('should test the suggestions on the input', async () => {
    const props = {
      description: 'test_description',
      errorMessages: 'test_errormessage',
      id: 'test_id',
      value: 'file-{{',
      flowId: 'flow_id',
      resourceId: 'import_id',
      resourceType: 'imports',
      isValid: true,
      disabled: false,
      placeholder: 'test_placeholder',
      onFieldChange: mockOnFieldChange,
      name: 'test_name',
      label: 'test_label',
      required: true,
      isLoggable: true,
    };

    initDynaTimestampFileName({props});
    const textBox = document.querySelector('input[name="test_name"]');

    expect(textBox).toBeInTheDocument();
    await userEvent.click(textBox);
    expect(document.querySelector('ul').className).toEqual(expect.stringContaining('makeStyles-suggestions-'));
  });
});
