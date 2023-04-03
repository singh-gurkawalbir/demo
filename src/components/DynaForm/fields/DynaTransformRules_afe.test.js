
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaTransformRules from './DynaTransformRules_afe';
import actions from '../../../actions';
import { IMPORT_FILTERED_DATA_STAGE } from '../../../utils/flowData';
import { renderWithProviders } from '../../../test/test-utils';

const asyncHelperId = 'async-123';
let mockSave = jest.fn();
const mockHistoryPush = jest.fn();
const mockDispatchFn = jest.fn(action => {
  switch (action.type) {
    case 'EDITOR_INIT':
      mockSave = action.options.onSave;
      break;

    default:
  }
});
const mockRouteMatch = {
  path: '/imports/edit/imports/import-123/:operation(add|edit)/:resourceType/:id',
  url: `/imports/edit/imports/import-123/edit/asyncHelpers/${asyncHelperId}`,
  isExact: true,
  params: {
    operation: 'edit',
    resourceType: 'asyncHelpers',
    id: asyncHelperId,
  },
};

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useRouteMatch: () => mockRouteMatch,
}));

jest.mock('../../CodeEditor2', () => ({
  __esModule: true,
  ...jest.requireActual('../../CodeEditor2'),
  default: ({value, readOnly}) => (
    <div data-testid="codeEditor" readOnly={readOnly}>{value}</div>
  ),
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

describe('test suite for DynaTransformRules_afe', () => {
  afterEach(() => {
    mockHistoryPush.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should populate the saved code in code editor', () => {
    const sampleCode = {
      rules: JSON.stringify({
        record: { sampleRecord: 'Record_123' },
      }),
    };
    const props = {
      id: 'http.submit.transform',
      resourceId: asyncHelperId,
      resourceType: 'asyncHelpers',
      formKey: `asyncHelpers-${asyncHelperId}`,
      value: sampleCode,
      label: 'Transform rules',
    };

    renderWithProviders(<DynaTransformRules {...props} />);
    expect(screen.getByText(props.label)).toBeInTheDocument();

    const codeEditor = screen.getByTestId('codeEditor');

    expect(codeEditor).toHaveTextContent(sampleCode.rules);

    //  should not be able to edit in the code editor
    expect(codeEditor).toHaveAttribute('readOnly', '');
  });

  test('should not be able to open AFE if disabled', () => {
    const props = {
      id: 'http.submit.transform',
      resourceId: asyncHelperId,
      resourceType: 'asyncHelpers',
      formKey: `asyncHelpers-${asyncHelperId}`,
      label: 'Transform rules',
      disabled: true,
    };

    renderWithProviders(<DynaTransformRules {...props} />);
    const openAfeBtn = document.querySelector('[data-test="editTransformation"]');

    expect(openAfeBtn).toBeDisabled();
  });

  test('should open the AFE editor on clicking Edit Icon', async () => {
    const props = {
      id: 'http.submit.transform',
      resourceId: asyncHelperId,
      resourceType: 'asyncHelpers',
      formKey: `asyncHelpers-${asyncHelperId}`,
      label: 'Transform rules',
    };

    renderWithProviders(<DynaTransformRules {...props} />);
    const openAfeBtn = document.querySelector('[data-test="editTransformation"]');

    await userEvent.click(openAfeBtn);

    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('httpsubmittransform', 'transform', {
      data: {},
      rule: undefined,
      formKey: props.formKey,
      flowId: undefined,
      resourceId: props.resourceId,
      resourceType: props.resourceType,
      fieldId: props.id,
      stage: IMPORT_FILTERED_DATA_STAGE,
      onSave: expect.anything(),
    }));

    expect(mockHistoryPush).toHaveBeenCalledWith('/imports/edit/imports/import-123/edit/asyncHelpers/async-123/editor/httpsubmittransform');
  });

  test('should be able to save the modified code in AFE', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'http.submit.transform',
      resourceId: asyncHelperId,
      resourceType: 'asyncHelpers',
      formKey: `asyncHelpers-${asyncHelperId}`,
      label: 'Transform rules',
      onFieldChange,
    };

    renderWithProviders(
      <>
        <DynaTransformRules {...props} />
        <button type="button" onClick={() => mockSave({rule: 'sampleNewRule'})}>Save</button>
      </>
    );
    await userEvent.click(document.querySelector('[data-test="editTransformation"]'));

    const saveBtn = screen.getByRole('button', {name: /save/i});

    await userEvent.click(saveBtn);
    expect(onFieldChange).toHaveBeenCalledWith(props.id, {
      rules: ['sampleNewRule'],
      rulesCollection: {
        mappings: ['sampleNewRule'],
      },
      version: 1,
    });
  });
});
