
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import useHandleRemountAfterSave from './useHandleRemountAfterSave';
import { getCreatedStore } from '../../../../../store';

async function initUseHandleRemountAfterSave(props = {}, initialStore) {
  const DummyComponent = () => {
    const { formKey, onSave, remountAfterSaveFn } = props;

    const cb = useHandleRemountAfterSave(formKey, onSave, remountAfterSaveFn);

    const onClick = () => {
      if (initialStore && initialStore.getState().session.asyncTask[formKey]?.status) {
        mutateStore(initialStore, draft => {
          draft.session.asyncTask[formKey].status = 'complete';
        });
      }
      cb();
    };

    return (
      <>
        <div>
          <button type="button" onClick={onClick}>
            Click Here
          </button>
        </div>
      </>
    );
  };

  return renderWithProviders(<DummyComponent />, {initialStore});
}

describe('test suite for useHandleRemountAfterSave hook', () => {
  test('should pass initial rendering', async () => {
    await initUseHandleRemountAfterSave();
    expect(screen.getByRole('button', {name: 'Click Here'})).toBeInTheDocument();
  });

  test('should be able to execute onSave and remountAfterSaveFn only after onClickWhenValid is executed', async () => {
    const formKey = 'form-123';
    const onSave = jest.fn();
    const remountAfterSaveFn = jest.fn();
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.asyncTask[formKey] = {
        status: 'loading',
      };
      draft.session.form[formKey] = {
        isValid: true,
        fields: {
          tempField: { touched: true },
        },
      };
    });

    await initUseHandleRemountAfterSave({formKey, onSave, remountAfterSaveFn}, initialStore);
    await userEvent.click(screen.getByRole('button', {name: 'Click Here'}));
    expect(onSave).toBeCalled();
    expect(remountAfterSaveFn).toBeCalled();
  });
});
