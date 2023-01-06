
import React from 'react';
import { renderWithProviders } from '../../../test/test-utils';
import useHandleCancel from './useHandleCancel';
import { getCreatedStore } from '../../../store';

jest.mock('./useHandleCancelBasic', () => ({
  __esModule: true,
  ...jest.requireActual('./useHandleCancelBasic'),
  default: props => props,
}));

async function inituseHandleCancel(props = {}, initialStore) {
  let returnData;
  const DummyComponent = () => {
    returnData = useHandleCancel(props);

    return (
      <div>
        Hello
      </div>
    );
  };

  renderWithProviders(<DummyComponent />, { initialStore });

  return returnData;
}

describe('test suite for useHandleCancelBasic hook', () => {
  test('should fetch and return from the selector properly', async () => {
    const formKey = 'connections-123';
    const onClose = jest.fn(() => 'onClose Called');
    const handleSave = jest.fn(() => 'handleSave Called');
    const touched = true;
    const initialStore = getCreatedStore();

    initialStore.getState().session.form[formKey] = {
      fields: {
        tempField: { touched },
      },
    };

    const handleCanceClick = await inituseHandleCancel({ formKey, onClose, handleSave }, initialStore);

    expect(handleCanceClick).toEqual({isDirty: touched, onClose, handleSave});
  });
});
