
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
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
    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Close'})).toBeEnabled();
  });

  test('should be able to provide the correct status', async () => {
    const resourceType = 'expeorts';
    const resourceId = '23fgsk';
    const KEY = `${resourceType}-${resourceId}`;
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.resourceForm[KEY] = { formSaveStatus: 'loading' };
    });

    await initSaveFileDefinitions({resourceType, resourceId}, initialStore);
    expect(screen.getByRole('button', {name: 'Close'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Saving...'})).toBeDisabled();
  });

  test('should throw a snackbar error when error saving form', async () => {
    const formKey = 'form-123';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        value: 'Value as a String.',
        isValid: true,
        fields: {
          tempField: { touched: true },
        },
      };
    });

    await initSaveFileDefinitions({formKey}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save'});

    await userEvent.click(saveButton);
    const snackBar = screen.getByRole('alert');

    expect(snackBar).toHaveTextContent(ERROR_MSG);
  });

  test('should be able to save successfully', async () => {
    const formKey = 'form-123';
    const definitionRules = JSON.stringify({
      x: 'abc',
      y: 'def',
    });
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        value: {
          '/file/filedefinition/rules': definitionRules,
        },
        isValid: true,
        fields: {
          tempField: { touched: true },
        },
      };
    });

    await initSaveFileDefinitions({formKey}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save'});

    await userEvent.click(saveButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.fileDefinitions.definition.userDefined.save(
      JSON.parse(definitionRules),
      { values: { '/file/filedefinition/rules': definitionRules }},
      undefined,
      true
    ));
  });
});
