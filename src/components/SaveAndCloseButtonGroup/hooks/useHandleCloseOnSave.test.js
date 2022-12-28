
import { act, screen } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../test/test-utils';
import { FORM_SAVE_STATUS } from '../../../constants/resourceForm';
import useHandleCloseOnSave from './useHandleCloseOnSave';

async function inituseHandleCloseOnSave(props = {}) {
  let cb;
  const DummyComponent = () => {
    cb = useHandleCloseOnSave(props);

    return (
      <>
        <div>
          Hello
        </div>
      </>
    );
  };

  renderWithProviders(<DummyComponent />);

  return cb;
}

describe('test cases for useHandleCloseOnSave', () => {
  test('should pass initial rendering', async () => {
    await inituseHandleCloseOnSave();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  test('should be able to execute onSave with proper arguments', async () => {
    const onSave = jest.fn();
    const onClose = jest.fn();
    const cb = await inituseHandleCloseOnSave({ onSave, onClose});

    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      cb(true);
    });

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenLastCalledWith(true);
    expect(onClose).not.toHaveBeenCalled();
  });

  test('should execute onClose whenever setCloseTriggered is called and status is complete', async () => {
    const onSave = jest.fn();
    const onClose = jest.fn();
    const cb = await inituseHandleCloseOnSave({ onSave,
      onClose,
      status: FORM_SAVE_STATUS.COMPLETE });

    act(() => {
      cb();
    });
    expect(onSave).toHaveBeenCalledWith(undefined);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('onClose should be called as many number of times as setCloseTriggered is called', async () => {
    const onSave = jest.fn();
    const onClose = jest.fn();
    const cb = await inituseHandleCloseOnSave({ onSave,
      onClose,
      status: FORM_SAVE_STATUS.COMPLETE });

    act(() => {
      cb();
    });
    expect(onSave).toHaveBeenLastCalledWith(undefined);
    expect(onClose).toHaveBeenCalledTimes(1);
    act(() => {
      cb(false);
    });
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(onSave).toHaveBeenLastCalledWith(false);
  });
});
