
import React from 'react';
import { renderWithProviders } from '../../../test/test-utils';
import { CLOSE_AFTER_SAVE } from '..';
import useHandleCancelBasic from './useHandleCancelBasic';

let mockSave;
let mockDiscard;

jest.mock('../../ConfirmDialog', () => ({
  __esModule: true,
  ...jest.requireActual('../../Buttons/TextButton'),
  default: () => ({
    saveDiscardDialog: ({ onSave, onDiscard }) => {
      mockSave = onSave;
      mockDiscard = onDiscard;
    },
  }),
}));

async function inituseHandleCancelBasic(props = {}) {
  let returnData;
  const DummyComponent = () => {
    returnData = useHandleCancelBasic(props);

    return (
      <div>
        Hello
      </div>
    );
  };

  renderWithProviders(<DummyComponent />);

  return returnData;
}

describe('test suite for useHandleCancelBasic hook', () => {
  beforeEach(() => {
    mockSave = undefined;
    mockDiscard = undefined;
  });

  test('should execute onClose when not dirty', async () => {
    const onClose = jest.fn(() => 'onClose Called');
    const handleCancelClick = await inituseHandleCancelBasic({ isDirty: false, onClose });

    expect(onClose).not.toHaveBeenCalled();
    const val = handleCancelClick();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(val).toBe('onClose Called');
  });

  test('should execute onClose when shouldForceClose is set', async () => {
    const onClose = jest.fn(() => 'onClose Called');
    const handleCancelClick = await inituseHandleCancelBasic({ isDirty: true, onClose });

    expect(onClose).not.toHaveBeenCalled();
    const val = handleCancelClick(true);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(val).toBe('onClose Called');
  });

  test('should not execute onClose when Dirty and shouldForceClose is not set', async () => {
    const onClose = jest.fn(() => 'onClose Called');
    const handleCancelClick = await inituseHandleCancelBasic({ isDirty: true, onClose });

    expect(onClose).not.toHaveBeenCalled();
    const val = handleCancelClick();

    expect(onClose).not.toHaveBeenCalled();
    expect(val).toBeUndefined();
  });

  test('should execute saveDiscardDialog when Dirty and shouldForceClose is not set', async () => {
    const onClose = jest.fn();
    const handleSave = jest.fn();
    const handleCancelClick = await inituseHandleCancelBasic({ isDirty: true, onClose, handleSave });

    expect(mockSave).toBeUndefined();
    expect(mockDiscard).toBeUndefined();

    handleCancelClick();

    expect(typeof mockSave).toBe('function');
    expect(typeof mockDiscard).toBe('function');
    expect(onClose).not.toHaveBeenCalled();
    expect(handleSave).not.toHaveBeenCalled();

    mockSave();

    expect(handleSave).toHaveBeenLastCalledWith(CLOSE_AFTER_SAVE);
    expect(handleSave).toHaveBeenCalledTimes(1);

    mockDiscard();

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
