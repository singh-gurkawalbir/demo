
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DynaSalesforceQualifiersafe from './DynaSalesforceQualifier_afe';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import actions from '../../../actions';

const mockonFieldChange = jest.fn();
let mockSave = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
const mockDispatchFn = jest.fn(action => {
  switch (action.type) {
    case 'EDITOR_INIT':
      mockSave = action.options.onSave;
      break;

    default:
  }
});

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

const initialStore = reduxStore;

function initDynaSalesforceQualifiersafe(props = {}) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949'}]}>
      <Route
        path="/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949/">
        <DynaSalesforceQualifiersafe {...props} />
        <button type="button" onClick={() => mockSave({rule: 'SampleRule'})}>Save</button>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}
const globalProps = {
  connectionId: '4567',
  errorMessages: '',
  id: 'salesforce.qualifier.whereClause',
  isValid: true,
  name: 'whereClauseText',
  onFieldChange: mockonFieldChange,
  placeholder: 'Where clause',
  required: true,
  value: '((Id = 5) AND (Rating = 200))',
  resourceType: 'imports',
  resourceId: '6368996d667fdb7984b49949',
  flowId: '63947b4ffc58924d43aec619',
  label: 'How can we find existing records?',
  multiline: true,
  formKey: 'imports-6368996d667fdb7984b49949',
};

describe('dynaSalesforceQualifier_afe UI test cases', () => {
  test('should populate the saved values', async () => {
    const props = {
      ...globalProps,
      options: {
        commMetaPath: 'salesforce/metadata/connections/6322ff72b5c15b058122871e/sObjectTypes/Account',
        disableFetch: false,
        resetValue: [],
        hasSObjectType: 'true',
      },
    };

    initDynaSalesforceQualifiersafe(props);
    const label = document.querySelector('label');

    expect(label).toHaveTextContent(props.label);
    expect(screen.getByRole('textbox')).toHaveValue(props.value);
  });
  test('should open the AFE editor on clicking filter Icon with value', async () => {
    const props = {
      ...globalProps,
      options: {
        commMetaPath: 'salesforce/metadata/connections/6322ff72b5c15b058122871e/sObjectTypes/Account',
        disableFetch: false,
        resetValue: [],
        hasSObjectType: 'true',
      },
    };

    initDynaSalesforceQualifiersafe(props);
    await userEvent.click(document.querySelector('[data-test="salesforce.qualifier.whereClause"]'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('salesforcequalifierwhereClause', 'salesforceQualificationCriteria', {
      formKey: 'imports-6368996d667fdb7984b49949',
      flowId: '63947b4ffc58924d43aec619',
      resourceId: '6368996d667fdb7984b49949',
      resourceType: 'imports',
      fieldId: 'salesforce.qualifier.whereClause',
      data: 'dummy data',
      connectionId: '4567',
      onSave: expect.anything(),
      customOptions: {commMetaPath: 'salesforce/metadata/connections/6322ff72b5c15b058122871e/sObjectTypes/Account',
        disableFetch: false,
        resetValue: [],
        hasSObjectType: 'true' },
    }));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949/editor/salesforcequalifierwhereClause');
  });
  test('should open the AFE editor on clicking filter Icon without value', async () => {
    const props = {
      ...globalProps,
      value: undefined,
      options: {
        commMetaPath: 'salesforce/metadata/connections/6322ff72b5c15b058122871e/sObjectTypes/Account',
        disableFetch: false,
        resetValue: [],
        hasSObjectType: 'true',
      },
    };

    initDynaSalesforceQualifiersafe(props);
    await userEvent.click(document.querySelector('[data-test="salesforce.qualifier.whereClause"]'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('salesforcequalifierwhereClause', 'salesforceQualificationCriteria', {
      formKey: 'imports-6368996d667fdb7984b49949',
      flowId: '63947b4ffc58924d43aec619',
      resourceId: '6368996d667fdb7984b49949',
      resourceType: 'imports',
      fieldId: 'salesforce.qualifier.whereClause',
      data: 'dummy data',
      connectionId: '4567',
      onSave: expect.anything(),
      customOptions: {commMetaPath: 'salesforce/metadata/connections/6322ff72b5c15b058122871e/sObjectTypes/Account',
        disableFetch: false,
        resetValue: [],
        hasSObjectType: 'true' },
    }));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949/editor/salesforcequalifierwhereClause');
  });

  test('should be able to save the modified code in AFE', async () => {
    const props = {
      ...globalProps,
      options: {
        commMetaPath: 'salesforce/metadata/connections/6322ff72b5c15b058122871e/sObjectTypes/Account',
        disableFetch: false,
        resetValue: [],
        hasSObjectType: 'true',
      },
    };

    initDynaSalesforceQualifiersafe(props);
    await userEvent.click(document.querySelector('[data-test="salesforce.qualifier.whereClause"]'));

    const saveBtn = screen.getByRole('button', {name: /save/i});

    await userEvent.click(saveBtn);
    expect(mockonFieldChange).toHaveBeenCalledWith(props.id, 'SampleRule');
  });

  describe('dynaSalesforceQualifier_afe sObjectTypeFieldId test cases', () => {
    test('should open the AFE editor on clicking filter Icon with value with sObjectTypeFieldId default value', async () => {
      mutateStore(initialStore, draft => {
        draft.session.form = {
          form_key_1: {
            fields: {
              'salesforce.sObjectType': {
                value: 's_object_1',
              },
            },
          },
        };
      });
      const props = {
        ...globalProps,
        formKey: 'form_key_1',
      };

      initDynaSalesforceQualifiersafe(props);
      await userEvent.click(document.querySelector('[data-test="salesforce.qualifier.whereClause"]'));
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('salesforcequalifierwhereClause', 'salesforceQualificationCriteria', {
        formKey: 'form_key_1',
        flowId: '63947b4ffc58924d43aec619',
        resourceId: '6368996d667fdb7984b49949',
        resourceType: 'imports',
        fieldId: 'salesforce.qualifier.whereClause',
        data: 'dummy data',
        connectionId: '4567',
        onSave: expect.anything(),
        customOptions: {
          commMetaPath: 'salesforce/metadata/connections/4567/sObjectTypes/s_object_1',
          resetValue: true,
          hasSObjectType: true,
          sObjectType: 's_object_1',
        },
      }));
      expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949/editor/salesforcequalifierwhereClause');
    });

    test('should open the AFE editor on clicking filter Icon with value with sObjectTypeFieldId with value', async () => {
      mutateStore(initialStore, draft => {
        draft.session.form = {
          form_key_1: {
            fields: {
              'salesforce.sObjectType_1': {
                value: 's_object_1',
              },
            },
          },
        };
      });
      const props = {
        ...globalProps,
        formKey: 'form_key_1',
        sObjectTypeFieldId: 'salesforce.sObjectType_1',
      };

      initDynaSalesforceQualifiersafe(props);
      await userEvent.click(document.querySelector('[data-test="salesforce.qualifier.whereClause"]'));
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('salesforcequalifierwhereClause', 'salesforceQualificationCriteria', {
        formKey: 'form_key_1',
        flowId: '63947b4ffc58924d43aec619',
        resourceId: '6368996d667fdb7984b49949',
        resourceType: 'imports',
        fieldId: 'salesforce.qualifier.whereClause',
        data: 'dummy data',
        connectionId: '4567',
        onSave: expect.anything(),
        customOptions: {
          commMetaPath: 'salesforce/metadata/connections/4567/sObjectTypes/s_object_1',
          resetValue: true,
          hasSObjectType: true,
          sObjectType: 's_object_1',
        },
      }));
      expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949/editor/salesforcequalifierwhereClause');
    });
  });
});
