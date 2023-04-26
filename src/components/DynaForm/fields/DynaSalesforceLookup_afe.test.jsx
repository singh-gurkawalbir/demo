import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DynaSalesforceLookupsafe from './DynaSalesforceLookup_afe';
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

function initDynaSalesforceLookupsafe(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form[props.formKey] = {
      fields: {
        'salesforce.sObjectType': { value: 'Account', connectionId: 'connection-123' },
      },
    };
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949'}]}>
      <Route
        path="/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949/">
        <>
          <DynaSalesforceLookupsafe {...props} />
          <button type="button" onClick={() => mockSave({rule: 'SampleRule'})}>Save</button>
        </>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
const props = {
  errorMessages: '',
  id: 'salesforce.idLookup.whereClause',
  isValid: true,
  name: 'whereClauseText',
  onFieldChange: mockonFieldChange,
  placeholder: 'Where clause',
  required: true,
  value: '(Id = 12)',
  resourceType: 'imports',
  resourceId: '6368996d667fdb7984b49949',
  flowId: '63947b4ffc58924d43aec619',
  label: 'How can we find existing records?',
  multiline: true,
  formKey: 'imports-6368996d667fdb7984b49949',
};

describe('dynaSalesforceLookup_afe UI test cases', () => {
  test('should populate the saved values', () => {
    initDynaSalesforceLookupsafe(props);
    const label = document.querySelector('label');

    expect(label).toHaveTextContent(props.label);
    expect(screen.getByRole('textbox')).toHaveValue(props.value);
  });
  test('should open the AFE editor on clicking filter Icon', async () => {
    initDynaSalesforceLookupsafe(props);
    await userEvent.click(document.querySelector('[data-test="salesforce.idLookup.whereClause"]'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('salesforceidLookupwhereClause', 'salesforceLookupFilter', {
      formKey: 'imports-6368996d667fdb7984b49949',
      flowId: '63947b4ffc58924d43aec619',
      resourceId: '6368996d667fdb7984b49949',
      resourceType: 'imports',
      fieldId: 'salesforce.idLookup.whereClause',
      stage: 'importMappingExtract',
      onSave: expect.anything(),
      customOptions: {commMetaPath: 'salesforce/metadata/connections/connection-123/sObjectTypes/Account',
        disableFetch: false,
        resetValue: [] },
    }));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949/editor/salesforceidLookupwhereClause');
  });
  test('should work as expected when the options are passed to the component instead of fetching from form state', async () => {
    const options = {
      disableFetch: false,
      commMetaPath: 'custom_path',
      resetValue: [],
    };

    initDynaSalesforceLookupsafe({ ...props, options });
    await userEvent.click(document.querySelector('[data-test="salesforce.idLookup.whereClause"]'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('salesforceidLookupwhereClause', 'salesforceLookupFilter', {
      formKey: 'imports-6368996d667fdb7984b49949',
      flowId: '63947b4ffc58924d43aec619',
      resourceId: '6368996d667fdb7984b49949',
      resourceType: 'imports',
      fieldId: 'salesforce.idLookup.whereClause',
      stage: 'importMappingExtract',
      onSave: expect.anything(),
      customOptions: options,
    }));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949/editor/salesforceidLookupwhereClause');
  });

  test('should be able to save the modified code in AFE', async () => {
    initDynaSalesforceLookupsafe(props);
    await userEvent.click(document.querySelector('[data-test="salesforce.idLookup.whereClause"]'));

    const saveBtn = screen.getByRole('button', {name: /save/i});

    await userEvent.click(saveBtn);
    expect(mockonFieldChange).toHaveBeenCalledWith(props.id, 'SampleRule');
  });
});
