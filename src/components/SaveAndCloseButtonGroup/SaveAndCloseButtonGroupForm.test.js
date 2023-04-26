
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import { getCreatedStore } from '../../store';
import { FORM_SAVE_STATUS } from '../../constants/resourceForm';
import SaveAndCloseButtonGroupForm from './SaveAndCloseButtonGroupForm';
import { CLOSE_AFTER_SAVE } from '.';

jest.mock('./hooks/useHandleCancel', () => ({
  __esModule: true,
  ...jest.requireActual('./hooks/useHandleCancel'),
  default: ({onClose}) => onClose,
}));

jest.mock('../ResourceFormFactory/Actions/Groups/hooks/useHandleClickWhenValid', () => ({
  __esModule: true,
  ...jest.requireActual('../ResourceFormFactory/Actions/Groups/hooks/useHandleClickWhenValid'),
  default: (_, saveAndClose) => saveAndClose,
}));

jest.mock('../ResourceFormFactory/Actions/Groups/hooks/useHandleRemountAfterSave', () => ({
  __esModule: true,
  ...jest.requireActual('../ResourceFormFactory/Actions/Groups/hooks/useHandleRemountAfterSave'),
  default: (_, onSave) => onSave,
}));

let touched = false;
let status = FORM_SAVE_STATUS.COMPLETE;

async function initSaveAndCloseButtonGroupForm(props = {formKey: 'blank'}) {
  const initialStore = getCreatedStore();
  const { formKey } = props;

  mutateStore(initialStore, draft => {
    draft.session.form[formKey] = {
      fields: {
        tempField: { touched },
      },
    };

    draft.session.asyncTask[formKey] = { status };
  });

  const ui = (
    <MemoryRouter>
      <SaveAndCloseButtonGroupForm {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test cases for SaveAndCloseButtonGroupForm', () => {
  test('should pass initial rendering', async () => {
    const formKey = 'form-123';
    const { store, utils } = await initSaveAndCloseButtonGroupForm({formKey});

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /close/i })).toBeEnabled();

    utils.unmount();
    expect(store.getState().session.asyncTask[formKey]).toBeUndefined();
  });

  test('save and Close buttons should be disabled when inProgress', async () => {
    status = FORM_SAVE_STATUS.LOADING;
    await initSaveAndCloseButtonGroupForm({formKey: 'form-123', disabled: true, disableOnCloseAfterSave: true});

    expect(screen.getByRole('button', {name: /saving.../i})).toBeDisabled();
    expect(screen.getByRole('button', {name: /close/i})).toBeDisabled();
  });

  test('should be able to render and enable all the three buttons', async () => {
    status = FORM_SAVE_STATUS.COMPLETE;
    touched = true;
    await initSaveAndCloseButtonGroupForm({formKey: 'form-123'});

    expect(screen.getByRole('button', {name: 'Save'})).toBeEnabled();
    expect(screen.getByRole('button', {name: 'Save & close'})).toBeEnabled();
    expect(screen.getByRole('button', {name: 'Close'})).toBeEnabled();
  });

  test('should be able to handle save, close, save & close', async () => {
    status = FORM_SAVE_STATUS.COMPLETE;
    touched = true;
    const onSave = jest.fn();
    const onClose = jest.fn();

    await initSaveAndCloseButtonGroupForm({formKey: 'form-123', onSave, onClose });

    const saveButton = screen.getByRole('button', {name: 'Save'});
    const saveAndCloseButton = screen.getByRole('button', {name: 'Save & close'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    await userEvent.click(saveButton);
    expect(onSave).toHaveBeenLastCalledWith(!CLOSE_AFTER_SAVE);

    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);

    await userEvent.click(saveAndCloseButton);
    expect(onSave).toHaveBeenCalledWith(CLOSE_AFTER_SAVE);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
