/* eslint-disable jest/require-top-level-describe */

import React from 'react';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import useClearAsyncStateOnUnmount from './useClearAsyncStateOnUnmount';

const key = 'rdbms';

async function inituseClearAsyncStateOnUnmount() {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.asyncTask[key] = {
      data: 'abc',
      defaultData: 'def',
      status: 'aborted',
    };
  });

  let returnData;
  const DummyComponent = () => {
    useClearAsyncStateOnUnmount(key);

    return (
      <div>
        Hello
      </div>
    );
  };

  const { utils, store } = renderWithProviders(<DummyComponent />, { initialStore });

  return { returnData, utils, store };
}

test('should clear async state on unmounting', async () => {
  const { store, utils: { unmount } } = await inituseClearAsyncStateOnUnmount();

  expect(store.getState().session.asyncTask[key]).toEqual({
    data: 'abc',
    defaultData: 'def',
    status: 'aborted',
  });
  unmount();
  expect(store.getState().session.asyncTask[key]).toBeUndefined();
});
