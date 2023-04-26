import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaFTPFileNameWithEditor from './DynaFTPFileNameWithEditor_afe';
import actions from '../../../actions';
import { renderWithProviders } from '../../../test/test-utils';

const resourceId = '626abc';
const mockHistoryPush = jest.fn();
const onFieldChange = jest.fn();
let mockSave = jest.fn();
const mockDispatchFn = jest.fn(action => {
  switch (action.type) {
    case 'EDITOR_INIT':
      mockSave = action.options.onSave;
      break;
    default:
  }
});
const mockRouteMatch = {
  path: '/imports/:operation(add|edit)/:resourceType/:id',
  url: `/imports/edit/imports/${resourceId}`,
  isExact: true,
  params: {
    operation: 'edit',
    resourceType: 'imports',
    id: resourceId,
  },
};
const mockFormContext = {
  fields: {
    'file.type': {
      id: 'file.type',
      value: 'json',
      touched: false,
    },
  },
};

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => mockRouteMatch,
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../Form/FormContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../Form/FormContext'),
  default: () => mockFormContext,
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

jest.mock('./DynaTimestampFileName', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaTimestampFileName'),
  default: ({ label, value }) => (
    <>
      <div data-testid="label">{label}</div>
      <div data-testid="value">{value}</div>
    </>
  ),
}));

describe('test suite for DynaFTPFileNameWithEditor field', () => {
  afterEach(() => {
    mockDispatchFn.mockClear();
    mockHistoryPush.mockClear();
    onFieldChange.mockClear();
  });

  test('should populate the saved value', () => {
    const props = {
      id: 'file.fileName',
      label: 'File name',
      value: 'TC_9697.json',
      resourceId,
      resourceType: 'imports',
      formKey: `imports-${resourceId}`,
      onFieldChange,
    };

    renderWithProviders(<DynaFTPFileNameWithEditor {...props} />);
    expect(screen.getByTestId('label')).toHaveTextContent(props.label);
    expect(screen.getByTestId('value')).toHaveTextContent(props.value);
  });

  test('should be able to open editor', async () => {
    const props = {
      id: 'file.fileName',
      label: 'File name',
      value: 'TC_9697.json',
      resourceId,
      resourceType: 'imports',
      formKey: `imports-${resourceId}`,
      onFieldChange,
    };

    renderWithProviders(<DynaFTPFileNameWithEditor {...props} />);
    const openEditorBtn = screen.getByRole('button', { name: 'Open handlebars editor' });

    await userEvent.click(openEditorBtn);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('filefileName', 'handlebars', {
      formKey: props.formKey,
      flowId: props.flowId,
      resourceId: props.resourceId,
      resourceType: props.resourceType,
      fieldId: props.id,
      stage: 'importMappingExtract',
      onSave: expect.anything(),
    }));
    expect(mockHistoryPush).toHaveBeenCalledWith(`${mockRouteMatch.url}/editor/filefileName`);
  });

  test('should be able to save value in AFE editor', async () => {
    const props = {
      id: 'file.fileName',
      label: 'File name',
      resourceId,
      resourceType: 'imports',
      formKey: `imports-${resourceId}`,
      onFieldChange,
    };

    renderWithProviders(
      <>
        <DynaFTPFileNameWithEditor {...props} />
        <button type="button" onClick={() => mockSave({ rule: 'SampleRule' })}>Save</button>
      </>
    );
    const openEditorBtn = screen.getByRole('button', { name: 'Open handlebars editor' });

    await userEvent.click(openEditorBtn);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'SampleRule');
  });

  describe('should update file name extension on changing file type', () => {
    beforeEach(() => {
      mockFormContext.fields = {
        'file.type': {
          id: 'file.type',
          value: 'json',
          touched: false,
        },
      };
    });

    test('should not do anything if new extension is same as old one', () => {
      const props = {
        id: 'file.fileName',
        label: 'File name',
        value: 'TC_9697.json',
        resourceId,
        resourceType: 'imports',
        formKey: `imports-${resourceId}`,
        onFieldChange,
      };
      const { utils } = renderWithProviders(<DynaFTPFileNameWithEditor {...props} />);

      mockFormContext.fields['file.type'].touched = true;
      mockFormContext.fields['file.type'].value = 'json';

      renderWithProviders(<DynaFTPFileNameWithEditor {...props} />, { renderFun: utils.rerender });
      expect(onFieldChange).not.toHaveBeenCalled();
    });

    test('should give a default file name if not present beforehand', () => {
      const props = {
        id: 'file.fileName',
        label: 'File name',
        resourceId,
        resourceType: 'imports',
        formKey: `imports-${resourceId}`,
        onFieldChange,
      };
      const { utils } = renderWithProviders(<DynaFTPFileNameWithEditor {...props} />);

      mockFormContext.fields['file.type'].touched = true;
      mockFormContext.fields['file.type'].value = 'fixed';

      renderWithProviders(<DynaFTPFileNameWithEditor {...props} />, { renderFun: utils.rerender });
      expect(onFieldChange).toHaveBeenCalledWith(props.id, 'file-{{timestamp}}.edi');
    });

    test('should replace the extension if already has a valid extension', () => {
      const props = {
        id: 'file.fileName',
        label: 'File name',
        value: 'TC_9697.json',
        resourceId,
        resourceType: 'imports',
        formKey: `imports-${resourceId}`,
        onFieldChange,
      };
      const { utils } = renderWithProviders(<DynaFTPFileNameWithEditor {...props} />);

      mockFormContext.fields['file.type'].touched = true;
      mockFormContext.fields['file.type'].value = 'delimited/edifact';

      renderWithProviders(<DynaFTPFileNameWithEditor {...props} />, { renderFun: utils.rerender });
      expect(onFieldChange).toHaveBeenCalledWith(props.id, 'TC_9697.edi');
    });

    test('should simply append the new extension if file name did not have a valid extension previously', () => {
      const props = {
        id: 'file.fileName',
        label: 'File name',
        value: 'TC_9697.pfx',
        resourceId,
        resourceType: 'imports',
        formKey: `imports-${resourceId}`,
        onFieldChange,
      };
      const { utils } = renderWithProviders(<DynaFTPFileNameWithEditor {...props} />);

      mockFormContext.fields['file.type'].touched = true;
      mockFormContext.fields['file.type'].value = 'filedefinition';

      renderWithProviders(<DynaFTPFileNameWithEditor {...props} />, { renderFun: utils.rerender });
      expect(onFieldChange).toHaveBeenCalledWith(props.id, 'TC_9697.pfx.edi');
    });
  });
});
