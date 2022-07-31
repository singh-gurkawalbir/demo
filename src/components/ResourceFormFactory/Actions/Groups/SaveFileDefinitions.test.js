/* global describe, expect, jest, test, beforeEach, afterEach */
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import actions from '../../../../actions';
import SaveFileDefinitions from './SaveFileDefinitions';

const ERROR_MSG = 'Filedefinition rules provided is not a valid json, Please correct it.';

async function initSaveFileDefinitions(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <SaveFileDefinitions {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test suite for SaveFileDefinitions', () => {
  let useDispatchSpy;
  let mockDispatchFn;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });

    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy?.mockClear();
    mockDispatchFn?.mockClear();
  });
  test('should pass initial rendering', async () => {
    await initSaveFileDefinitions();
    screen.debug();
    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Close'})).toBeEnabled();
  });

  test('should be able to provide the correct status', async () => {
    const resourceType = 'expeorts';
    const resourceId = '23fgsk';
    const KEY = `${resourceType}-${resourceId}`;
    const initialStore = getCreatedStore();

    initialStore.getState().session.resourceForm[KEY] = { formSaveStatus: 'loading' };
    await initSaveFileDefinitions({resourceType, resourceId}, initialStore);
    expect(screen.getByRole('button', {name: 'Close'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Saving...'})).toBeDisabled();
  });

  test('should throw a snackbar error when error saving form', async () => {
    const formKey = 'form-123';
    const initialStore = getCreatedStore();

    initialStore.getState().session.form[formKey] = {
      value: 'Value as a String.',
      isValid: true,
      fields: {
        tempField: { touched: true },
      },
    };
    await initSaveFileDefinitions({formKey}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save'});

    userEvent.click(saveButton);
    const snackBar = screen.getByRole('alert');

    expect(snackBar).toHaveTextContent(ERROR_MSG);
    expect(snackBar).toHaveStyle({color: 'rgb(51, 61, 71)'});
  });

  test('should be able to save successfully', async () => {
    const formKey = 'form-123';
    const definitionRules = JSON.stringify({
      x: 'abc',
      y: 'def',
    });
    const initialStore = getCreatedStore();

    initialStore.getState().session.form[formKey] = {
      value: {
        '/file/filedefinition/rules': definitionRules,
      },
      isValid: true,
      fields: {
        tempField: { touched: true },
      },
    };
    await initSaveFileDefinitions({formKey}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save'});

    userEvent.click(saveButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.fileDefinitions.definition.userDefined.save(
      JSON.parse(definitionRules),
      { values: { '/file/filedefinition/rules': definitionRules }},
      undefined,
      true
    ));
  });
});
