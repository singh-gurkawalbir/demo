
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import SaveButtonGroup from './SaveButtonGroup';

const mockClose = jest.fn();
const mockFn = jest.fn();
const HTTPlookupObj = {
  allowFailures: true,
  body: undefined,
  default: undefined,
  extract: undefined,
  method: undefined,
  name: 'lookupName',
  postBody: undefined,
  query: undefined,
  relativeURI: undefined,
};

async function initSaveButtonGroup(props = {}, makeFormDirty = false, _mode = 'static', _failRecord = 'disallowFailure') {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      imports: [
        {
          _id: '_importId1',
          adaptorType: 'NetSuiteDistributedImport',
        },
        {
          _id: '_importId2',
          adaptorType: 'SalesforceImport',
        },
        {
          _id: '_importId3',
          adaptorType: 'HTTPImport',
        },
      ],
    };
    draft.session.form = {
      _formKey: {
        disabled: false,
        isValid: true,
        fields: makeFormDirty ? {_mode: {touched: true}} : {},
        value: {
          _mode,
          _name: 'lookupName',
          _failRecord,
          _mapList: [
            {export: 'exp', import: 'imp'},
            {},
          ],
        },
      },
    };
  });

  return renderWithProviders(<SaveButtonGroup {...props} />, {initialStore});
}

describe('SaveButtonGroup tests', () => {
  test('Should able to test the SaveButtonGroup without form dirty', async () => {
    await initSaveButtonGroup({onCancel: mockClose});
    const saveButton = screen.getByRole('button', {name: 'Save'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(saveButton).toBeDisabled();
    expect(closeButton).toBeEnabled();
    await userEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalled();
  });
  test('Should able to test the SaveButtonGroup with form dirty and static mode', async () => {
    await initSaveButtonGroup({onCancel: mockClose, formKey: '_formKey', parentOnSave: mockFn}, true, 'static', '');
    const saveButton = screen.getByRole('button', {name: 'Save'});

    expect(screen.getByRole('button', {name: 'Save & close'})).toBeEnabled();
    expect(saveButton).toBeEnabled();
    await userEvent.click(saveButton);
    expect(mockFn).toHaveBeenCalledWith(false, {map: {exp: 'imp'}, name: 'lookupName'});
  });
  test('Should able to test the SaveButtonGroup with static mode and disallowFailure on failure', async () => {
    await initSaveButtonGroup({formKey: '_formKey', parentOnSave: mockFn}, true, 'static', 'disallowFailure');
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockFn).toHaveBeenCalledWith(false, {allowFailures: false, map: {exp: 'imp'}, name: 'lookupName'});
  });
  test('Should able to test the SaveButtonGroup with HTTP Import and dynamic lookup and useNull on failure', async () => {
    const props = {resourceType: 'imports', resourceId: '_importId3', formKey: '_formKey', parentOnSave: mockFn};

    await initSaveButtonGroup(props, true, 'dynamic', 'useNull');
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockFn).toHaveBeenCalledWith(false, {...HTTPlookupObj, default: null});
  });
  test('Should able to test the SaveButtonGroup with HTTP Import and dynamic lookup and useEmptyString on failure', async () => {
    const res = {resourceType: 'imports', resourceId: '_importId3', formKey: '_formKey', parentOnSave: mockFn};

    await initSaveButtonGroup({value: {name: 'MockLookupName'}, ...res}, true, 'dynamic', 'useEmptyString');
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockFn).toHaveBeenCalledWith(true, {...HTTPlookupObj, default: ''});
  });
  test('Should able to test the SaveButtonGroup with HTTP Import and dynamic lookup and default on failure', async () => {
    const props = {resourceType: 'imports', resourceId: '_importId3', formKey: '_formKey', parentOnSave: mockFn};

    await initSaveButtonGroup(props, true, 'dynamic', 'default');
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockFn).toHaveBeenCalledWith(false, HTTPlookupObj);
  });
  test('Should able to test the SaveButtonGroup with Netsuite Import and static lookup', async () => {
    const props = {resourceType: 'imports', resourceId: '_importId1', formKey: '_formKey', parentOnSave: mockFn};

    await initSaveButtonGroup(props, true, 'static');
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockFn).toHaveBeenCalledWith(false, {map: {exp: 'imp'}, name: 'lookupName'});
  });
  test('Should able to test the SaveButtonGroup with Netsuite Import and dynamic lookup', async () => {
    const props = {resourceType: 'imports', resourceId: '_importId1', formKey: '_formKey', parentOnSave: mockFn};

    await initSaveButtonGroup(props, true, 'dynamic');
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockFn).toHaveBeenCalledWith(false, {expression: undefined, recordType: undefined, resultField: undefined, name: 'lookupName'});
  });
  test('Should able to test the SaveButtonGroup with Salesforce import and static lookup', async () => {
    const props = {resourceType: 'imports', resourceId: '_importId2', formKey: '_formKey', parentOnSave: mockFn};

    await initSaveButtonGroup(props, true, 'static');
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockFn).toHaveBeenCalledWith(false, {map: {exp: 'imp'}, name: 'lookupName'});
  });
  test('Should able to test the SaveButtonGroup with Salesforce import and dynamic lookup', async () => {
    const props = {resourceType: 'imports', resourceId: '_importId2', formKey: '_formKey', parentOnSave: mockFn};

    await initSaveButtonGroup(props, true, 'dynamic');
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockFn).toHaveBeenCalledWith(false, {expression: undefined, sObjectType: undefined, whereClause: undefined, resultField: undefined, name: 'lookupName'});
  });
});
