
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { getCreatedStore } from '../../../../store';
import { runServer } from '../../../../test/api/server';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import useBottomDrawer from './useBottomDrawer';

async function initUseBottomDrawer(initialStore, renderFun) {
  let returnData;
  const DummyComponent = () => {
    returnData = useBottomDrawer();

    return (
      <div>
        Hello World
      </div>
    );
  };

  const { utils, store } = renderWithProviders(<MemoryRouter><DummyComponent /></MemoryRouter>, {initialStore, renderFun});

  return { returnData, utils, store };
}

describe('test suite for useBottomDrawer hook', () => {
  runServer();
  test('should return an array with an initial value of 250 and a function', async () => {
    const { returnData: val } = await initUseBottomDrawer();

    expect(Array.isArray(val)).toBeTruthy();
    expect(val[0]).toBe(250);
    expect(typeof val[1]).toBe('function');
  });

  test('should be able to change the height', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user = {
        preferences: {
          defaultAShareId: '123abc',
          accounts: {
            '123abc': {
              fbBottomDrawerHeight: 443,
            },
          },
        },
        org: {
          accounts: [
            {
              _id: '123abc',
            },
          ],
        },
      };
    });

    const { returnData, utils, store } = await initUseBottomDrawer(initialStore);
    const [height, setHeight] = returnData;

    expect(height).toBe(443);
    setHeight(170);
    const val = await initUseBottomDrawer(store, utils.rerender);

    expect(val.returnData[0]).toBe(170);
  });
});
