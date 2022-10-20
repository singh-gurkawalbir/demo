/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import useFormOnCancelContext, { FormOnCancelProvider, useFormOnCancel } from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders} from '../../test/test-utils';
import { getCreatedStore } from '../../store';
import { FORM_SAVE_STATUS } from '../../constants/resourceForm';

const nullVal = 'No Value Here';
const key = 'rdbms';
const Disabled = 'Disabled';
const Enabled = 'Enabled';
let status = FORM_SAVE_STATUS.LOADING;

async function inituseFormOnCancelContext() {
  let returnData;
  const DummyComponent = () => {
    returnData = useFormOnCancelContext(key);

    return (
      <>
        <div data-testid="value">
          {returnData.cancelTriggeredForAsyncKey || nullVal}
        </div>
      </>
    );
  };

  renderWithProviders(<FormOnCancelProvider><DummyComponent /></FormOnCancelProvider>);

  return returnData;
}

async function inituseFormOnCancel() {
  let returnData;
  const initialStore = getCreatedStore();

  initialStore.getState().session.editors[key] = {
    data: 'abc',
    defaultData: 'def',
  };
  initialStore.getState().session.asyncTask[key] = { status };

  const DummyComponent = () => {
    const { cancelTriggeredForAsyncKey } = useFormOnCancelContext(key);

    returnData = useFormOnCancel(key);

    return (
      <>
        <div data-testid="value">
          {cancelTriggeredForAsyncKey || nullVal}
        </div>
        <div data-testid="disabled">
          {returnData.disabled ? Disabled : Enabled}
        </div>
      </>
    );
  };

  renderWithProviders(<FormOnCancelProvider><DummyComponent /></FormOnCancelProvider>, { initialStore });

  return returnData;
}

describe('test suite for useFormOnCancelContext hook', () => {
  runServer();

  test('should pass initial rendering', async () => {
    await inituseFormOnCancelContext();
    const val = screen.getByTestId('value');

    expect(val.textContent).toBe(nullVal);
  });

  test('should set the value when setCancelTriggered is called', async () => {
    const { setCancelTriggered } = await inituseFormOnCancelContext();
    const val = screen.getByTestId('value');

    act(() => {
      setCancelTriggered();
    });
    expect(val.textContent).toBe(key);
  });

  test('should clear the value when closeCancelTriggered is called', async () => {
    const { setCancelTriggered, closeCancelTriggered } = await inituseFormOnCancelContext();
    const val = screen.getByTestId('value');

    act(() => {
      setCancelTriggered();
    });
    expect(val.textContent).toBe(key);

    act(() => {
      closeCancelTriggered();
    });
    expect(val.textContent).toBe(nullVal);
  });
});

describe('test suite for useFormOnCancel hook', () => {
  runServer();
  test('should pass initial rendering', async () => {
    await inituseFormOnCancel();
    const val = screen.getByTestId('value');
    const abled = screen.getByTestId('disabled');

    expect(val.textContent).toBe(nullVal);
    expect(abled.textContent).toBe(Disabled);
  });

  test('status should be fetched correctly', async () => {
    status = FORM_SAVE_STATUS.COMPLETE;
    await inituseFormOnCancel();
    const val = screen.getByTestId('value');
    const abled = screen.getByTestId('disabled');

    expect(val.textContent).toBe(nullVal);
    expect(abled.textContent).toBe(Enabled);
  });

  test('setCancelTriggered should be able to change the value', async () => {
    status = FORM_SAVE_STATUS.FAILED;
    const { setCancelTriggered } = await inituseFormOnCancel();
    const val = screen.getByTestId('value');
    const abled = screen.getByTestId('disabled');

    expect(val.textContent).toBe(nullVal);
    expect(abled.textContent).toBe(Enabled);

    act(() => {
      setCancelTriggered();
    });
    expect(val.textContent).toBe(key);
  });
});
