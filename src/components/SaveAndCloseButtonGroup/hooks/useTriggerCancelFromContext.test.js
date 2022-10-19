/* global describe, jest, expect, test */
import React from 'react';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';
import useTriggerCancelFromContext from './useTriggerCancelFromContext';

const mockCloseCancelTriggered = jest.fn();

jest.mock('../../FormOnCancelContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../FormOnCancelContext'),
  default: () => ({
    cancelTriggeredForAsyncKey: 'connections-123',
    closeCancelTriggered: mockCloseCancelTriggered,
  }),
}));

async function inituseTriggerCancelFromContext(props = {}) {
  const { formKey, onCloseWithDiscardWarning } = props;
  const DummyComponent = () => {
    useTriggerCancelFromContext(formKey, onCloseWithDiscardWarning);

    return (
      <>
        <div>
          Hello
        </div>
      </>
    );
  };

  renderWithProviders(<DummyComponent />);
}

describe('test cases for useTriggerCancelFromContext hook', () => {
  runServer();

  test('should pass initial rendering', async () => {
    await inituseTriggerCancelFromContext();
  });

  test('should not execute the functions in useEffect when formKey is different', async () => {
    const formKey = 'exports-456';
    const onCloseWithDiscardWarning = jest.fn();

    await inituseTriggerCancelFromContext({formKey, onCloseWithDiscardWarning});
    expect(mockCloseCancelTriggered).not.toBeCalled();
    expect(onCloseWithDiscardWarning).not.toBeCalled();
  });

  test('should not execute the functions in useEffect when onCloseWithDiscardWarning is not passed', async () => {
    const formKey = 'connections-123';

    await inituseTriggerCancelFromContext({formKey});
    expect(mockCloseCancelTriggered).not.toBeCalled();
  });

  test('should execute the functions in useEffect when conditions satisfy', async () => {
    const formKey = 'connections-123';
    const onCloseWithDiscardWarning = jest.fn();

    await inituseTriggerCancelFromContext({formKey, onCloseWithDiscardWarning});
    expect(mockCloseCancelTriggered).toHaveBeenCalledTimes(1);
    expect(onCloseWithDiscardWarning).toHaveBeenCalledTimes(1);
  });
});
