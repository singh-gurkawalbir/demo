
import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import actions from '../../../../actions';
// import fieldMeta from './testutil';
import DynaXmlParse from './index';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

let mockSave = jest.fn();

const initialStore = getCreatedStore();
const mockDispatchFn = jest.fn(action => {
  switch (action.type) {
    case 'EDITOR_INIT':
      mockSave = action.options.onSave;
      break;
    default: initialStore.dispatch(action);
  }
});

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

function initDynaXmlParse(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.connectionToken = {
      '5b3c75dd5d3c125c88b5dd20': {
        fieldsToBeSetWithValues: {
          field1: 1,
          field2: 2,
        },
        status: props.status,
        message: props.message,
      },
    };
    draft.session.form = {
      formKey: {
        fieldMeta: {
          layout: {
            containers: [
              {
                type: 'collapse',
                containers: [
                  {
                    collapsed: true,
                    label: 'General',
                    fields: [
                      'name',
                      'description',
                      '_connectionId',
                      'outputMode',
                    ],
                  },
                ],
              },
              {
                fields: [
                  'settings',
                ],
              },
            ],
          },
          fieldMap: {
            name: {
              resourceId: '634eee1c24bd9e5acce44d2b',
              resourceType: 'exports',
              isLoggable: true,
              type: 'text',
              label: 'Name',
              required: true,
              fieldId: 'name',
              id: 'name',
              name: '/name',
              defaultValue: 'SFTP export',
              helpKey: 'export.name',
            },
            description: {
              resourceId: '634eee1c24bd9e5acce44d2b',
              resourceType: 'exports',
              isLoggable: true,
              type: 'text',
              label: 'Description',
              fieldId: 'description',
              id: 'description',
              name: '/description',
              defaultValue: '',
              helpKey: 'export.description',
            } },
        },
      },
    };
    draft.data.resources = {
      exports: [{
        _id: '5b3c75dd5d3c125c88b5dd20',
        adatptorType: 'FTPExport',
        _integrationId: '6b3c75dd5d3c125c88b5dd20',
        assistant: 'googledrive',

      }],
    };
  });

  return renderWithProviders(
    <MemoryRouter>
      <DynaXmlParse {...props} />
      <button type="button" onClick={() => mockSave({rule: 'SampleRule'})}>Save</button>
    </MemoryRouter>,
    {initialStore});
}

// jest.mock('../../../../hooks/useFormInitWithPermissions', () => ({
//   __esModule: true,
//   ...jest.requireActual('../../../../hooks/useFormInitWithPermissions'),
//   default: () => 'formKey',
// }));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('dynaXmlParse_afe UI tests', () => {
  const mockonFieldChange = jest.fn();
  const props = {
    id: 'testId',
    value: {
      0: {
        type: 'xml',
        version: 1,
        rules: {
          V0_json: true,
          trimSpaces: false,
          stripNewLineChars: false,
        },
      },
      resourcePath: '',
      __invalid: true,
    },
    onFieldChange: mockonFieldChange,
    resourceId: '5b3c75dd5d3c125c88b5dd20',
    resourceType: 'exports',
    flowId: '6b3c75dd5d3c125c88b5dd20',
    formKey: 'formKey',
    label: 'demo label',
  };

  test('should pass the initial render', () => {
    initDynaXmlParse(props);
    expect(screen.getByText('demo label')).toBeInTheDocument();
    expect(screen.getByText('Launch')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByText('Automatic')).toBeInTheDocument();
    expect(screen.getByText('Resource path')).toBeInTheDocument();
    expect(screen.getByText('Parse strategy')).toBeInTheDocument();
    const fields = screen.getAllByRole('textbox');
    const buttons = screen.getAllByRole('button');

    expect(fields).toHaveLength(1);
    expect(buttons).toHaveLength(4);
  });
  test('should make a dispatch call and a url redirection when clicked on the launch button', async () => {
    initDynaXmlParse(props);
    const launchButton = screen.getByText('Launch');

    expect(launchButton).toBeInTheDocument();
    await userEvent.click(launchButton);
    await userEvent.click(screen.getByText('Save'));
    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('//editor/testId'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('testId', 'xmlParser', {
      formKey: 'formKey',
      flowId: '6b3c75dd5d3c125c88b5dd20',
      resourceId: '5b3c75dd5d3c125c88b5dd20',
      resourceType: 'exports',
      fieldId: 'testId',
      onSave: expect.anything(),
    }));
  });
});

